import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OtpChallengeEntity } from '@modules/auth/entity/otp-challenge.entity';
import { PasskeyEntity } from '@modules/auth/entity/passkey.entity';
import { UserEntity } from '@modules/auth/entity/user.entity';
import { AuthController } from '@modules/auth/controller/auth.controller';
import { PasskeyApiController } from '@modules/auth/controller/passkey-api.controller';
import { CurrentUserMiddleware } from '@modules/auth/middleware/current-user.middleware';
import { OtpChallengeRepository } from '@modules/auth/repository/otp-challenge.repository';
import { PasskeyRepository } from '@modules/auth/repository/passkey.repository';
import { UserRepository } from '@modules/auth/repository/user.repository';
import { AuthService } from '@modules/auth/service/auth.service';
import { GoogleAuthService } from '@modules/auth/service/google-auth.service';
import { PasskeyService } from '@modules/auth/service/passkey.service';
import { SessionAuthGuard } from '@modules/auth/guard/session-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, OtpChallengeEntity, PasskeyEntity])],
  controllers: [AuthController, PasskeyApiController],
  providers: [
    UserRepository,
    OtpChallengeRepository,
    PasskeyRepository,
    AuthService,
    GoogleAuthService,
    PasskeyService,
    SessionAuthGuard,
  ],
  exports: [AuthService, GoogleAuthService, PasskeyService, SessionAuthGuard],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
