import { Module } from '@nestjs/common';
import { AuthModule } from '@modules/auth/auth.module';
import { ProfileController } from '@modules/profile/profile.controller';

@Module({
  imports: [AuthModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
