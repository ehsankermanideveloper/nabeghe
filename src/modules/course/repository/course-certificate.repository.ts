import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BaseRepository } from '@common/repository/base.repository';
import { CourseCertificateEntity } from '@modules/course/entity/course-certificate.entity';

@Injectable()
export class CourseCertificateRepository extends BaseRepository<CourseCertificateEntity> {
  constructor(
    @InjectRepository(CourseCertificateEntity)
    repository: Repository<CourseCertificateEntity>,
  ) {
    super(repository);
  }

  findByUserAndCourse(userId: number, courseId: number): Promise<CourseCertificateEntity | null> {
    return this.findOne({ where: { userId, courseId } });
  }

  findByCode(code: string): Promise<CourseCertificateEntity | null> {
    return this.findOne({ where: { code } });
  }
}
