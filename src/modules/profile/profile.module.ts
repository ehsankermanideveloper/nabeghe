import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { CourseModule } from '@modules/course/course.module';
import { ArticleModule } from '@modules/article/article.module';
import { ProfileApiController } from '@modules/profile/profile-api.controller';
import { ProfileController } from '@modules/profile/profile.controller';

@Module({
  imports: [AuthModule, CourseModule, ArticleModule],
  controllers: [ProfileController, ProfileApiController],
})
export class ProfileModule {}
