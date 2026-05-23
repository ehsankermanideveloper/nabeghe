import { Injectable, NotFoundException } from '@nestjs/common';
import { CourseWishlistEntity } from '@modules/course/entity/course-wishlist.entity';
import { CourseWishlistRepository } from '@modules/course/repository/course-wishlist.repository';
import { CourseRepository } from '@modules/course/repository/course.repository';

@Injectable()
export class CourseWishlistService {
  constructor(
    private readonly wishlistRepository: CourseWishlistRepository,
    private readonly courseRepository: CourseRepository,
  ) {}

  async toggle(userId: number, courseId: number): Promise<{ wishlisted: boolean }> {
    const existing = await this.wishlistRepository.findByUserAndCourse(userId, courseId);

    if (existing) {
      await this.wishlistRepository.remove(existing);
      return { wishlisted: false };
    }

    const course = await this.courseRepository.findOneById(courseId);
    if (!course) throw new NotFoundException('دوره یافت نشد');

    const item = this.wishlistRepository.build({ userId, courseId });
    await this.wishlistRepository.save(item);
    return { wishlisted: true };
  }

  isWishlisted(userId: number, courseId: number): Promise<boolean> {
    return this.wishlistRepository.existsByUserAndCourse(userId, courseId);
  }

  getMyWishlist(userId: number): Promise<CourseWishlistEntity[]> {
    return this.wishlistRepository.findByUserId(userId);
  }
}
