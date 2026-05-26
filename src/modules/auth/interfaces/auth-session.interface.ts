import type { UserRole } from '@common/enum/user-role.enum';

export interface SessionUserPayload {
  id: number;
  role: UserRole;
  displayName: string | null;
  phone: string | null;
  email: string | null;
  birthday: string | null;
  bio: string | null;
}

export interface ViewCurrentUser {
  id: number;
  role: UserRole;
  displayLabel: string;
  maskedContact: string;
}

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    csrfToken?: string;
    otpChallengeId?: number;
    pendingMasked?: string;
    pendingKind?: 'phone' | 'email';
    phoneChangeOtpChallengeId?: number;
    pendingNewPhone?: string;
  }
}
