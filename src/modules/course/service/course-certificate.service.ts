import { Injectable } from '@nestjs/common';
import { randomBytes } from 'crypto';

const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';

function generateCertCode(): string {
  const year = new Date().getFullYear();
  const bytes = randomBytes(8);
  const part = Array.from(bytes).map((b) => ALPHABET[b % ALPHABET.length]).join('');
  return `CERT-${year}-${part}`;
}
import { CourseCertificateEntity } from '@modules/course/entity/course-certificate.entity';
import { CourseCertificateRepository } from '@modules/course/repository/course-certificate.repository';
import { CourseEpisodeRepository } from '@modules/course/repository/course-episode.repository';
import { CourseProgressRepository } from '@modules/course/repository/course-progress.repository';

@Injectable()
export class CourseCertificateService {
  constructor(
    private readonly certificateRepository: CourseCertificateRepository,
    private readonly episodeRepository: CourseEpisodeRepository,
    private readonly progressRepository: CourseProgressRepository,
  ) {}

  async isEligible(userId: number, courseId: number): Promise<boolean> {
    const totalPublished = await this.episodeRepository.countPublishedByCourseId(courseId);
    if (totalPublished === 0) return false;
    const completedCount = await this.progressRepository.countCompletedByUserAndCourse(userId, courseId);
    return completedCount >= totalPublished;
  }

  async getOrIssue(userId: number, courseId: number): Promise<CourseCertificateEntity | null> {
    const existing = await this.certificateRepository.findByUserAndCourse(userId, courseId);
    if (existing) return existing;

    const eligible = await this.isEligible(userId, courseId);
    if (!eligible) return null;

    const cert = this.certificateRepository.build({
      userId,
      courseId,
      code: generateCertCode(),
      issuedAt: new Date(),
    });
    return this.certificateRepository.save(cert) as Promise<CourseCertificateEntity>;
  }

  findByUserAndCourse(userId: number, courseId: number): Promise<CourseCertificateEntity | null> {
    return this.certificateRepository.findByUserAndCourse(userId, courseId);
  }

  findByUserAndCourseWithUser(userId: number, courseId: number): Promise<CourseCertificateEntity | null> {
    return this.certificateRepository.findOne({
      where: { userId, courseId },
      relations: { user: true },
    });
  }

  findByCode(code: string): Promise<CourseCertificateEntity | null> {
    return this.certificateRepository.findByCode(code);
  }
}
