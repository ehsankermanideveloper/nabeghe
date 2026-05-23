import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CourseEnrollmentEntity } from '@modules/course/entity/course-enrollment.entity';
import { CourseEnrollmentRepository } from '@modules/course/repository/course-enrollment.repository';
import { CourseRepository } from '@modules/course/repository/course.repository';
import { CourseStatus } from '@modules/course/enum/course-status.enum';

@Injectable()
export class CourseEnrollmentService {
  constructor(
    private readonly enrollmentRepository: CourseEnrollmentRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async enroll(userId: number, courseId: number): Promise<CourseEnrollmentEntity> {
    const course = await this.courseRepository.findOneById(courseId);
    if (!course || course.status !== CourseStatus.PUBLISHED) {
      throw new NotFoundException('دوره یافت نشد');
    }

    if (!course.isFree) {
      throw new BadRequestException('این دوره پولی است و نیاز به پرداخت دارد');
    }

    const existing = await this.enrollmentRepository.findByUserAndCourse(userId, courseId);
    if (existing) {
      throw new BadRequestException('قبلاً در این دوره ثبت‌نام کرده‌اید');
    }

    const enrollment = this.enrollmentRepository.build({
      userId,
      courseId,
      enrolledAt: new Date(),
    });

    const saved = (await this.enrollmentRepository.save(enrollment)) as CourseEnrollmentEntity;

    const studentCount = await this.enrollmentRepository.countByCourseId(courseId);
    await this.courseRepository.updateOneById(courseId, { studentCount });

    return saved;
  }

  async unenroll(userId: number, courseId: number): Promise<void> {
    const enrollment = await this.enrollmentRepository.findByUserAndCourse(userId, courseId);
    if (!enrollment) {
      throw new NotFoundException('در این دوره ثبت‌نام نکرده‌اید');
    }

    await this.enrollmentRepository.remove(enrollment);

    const studentCount = await this.enrollmentRepository.countByCourseId(courseId);
    await this.courseRepository.updateOneById(courseId, { studentCount });
  }

  isEnrolled(userId: number, courseId: number): Promise<boolean> {
    return this.enrollmentRepository.existsByUserAndCourse(userId, courseId);
  }

  getMyEnrollments(userId: number): Promise<CourseEnrollmentEntity[]> {
    return this.enrollmentRepository.findByUserId(userId);
  }
}
