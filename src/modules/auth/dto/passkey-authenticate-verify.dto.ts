import { IsObject } from 'class-validator';
import type { AuthenticationResponseJSON } from '@simplewebauthn/server';

export class PasskeyAuthenticateVerifyDto {
  @IsObject()
  response!: AuthenticationResponseJSON;
}
