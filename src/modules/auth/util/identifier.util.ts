import { parsePhoneNumberWithError, isValidPhoneNumber, ParseError } from 'libphonenumber-js';

export type IdentifierKind = 'phone' | 'email';

export interface ParsedIdentifier {
  kind: IdentifierKind;
  /** E.164 for phones (e.g. +989123456789), lowercase for emails */
  normalized: string;
  masked: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function maskPhone(e164: string): string {
  // e164 = "+989123456789" → "+9891*****89"
  if (e164.length <= 5) return e164;
  return `${e164.slice(0, 5)}*****${e164.slice(-2)}`;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const visible = local.length <= 2 ? local[0] ?? '' : local.slice(0, 2);
  return `${visible}***@${domain}`;
}

/**
 * Parses a raw identifier (phone or email) entered by the user.
 *
 * Phone numbers are accepted in any national or international format.
 * Numbers without a country code prefix are assumed to be Iranian (+98).
 * The stored `normalized` value is always E.164 (e.g. +989123456789).
 */
export function parseIdentifier(raw: string): ParsedIdentifier | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // ── Email ────────────────────────────────────────────────────────────────
  if (trimmed.includes('@')) {
    const email = trimmed.toLowerCase();
    if (!EMAIL_RE.test(email)) return null;
    return { kind: 'email', normalized: email, masked: maskEmail(email) };
  }

  // ── Phone ────────────────────────────────────────────────────────────────
  // Strip visible formatting (spaces, dashes, parens) but keep leading +
  const cleaned = trimmed.replace(/[\s\-().]/g, '');

  try {
    // Default country = IR so that 09XXXXXXXXX works without a + prefix
    const parsed = parsePhoneNumberWithError(cleaned, 'IR');

    if (!parsed.isValid()) return null;

    const e164 = parsed.number; // always "+XXXXXXXXXXXX"
    return { kind: 'phone', normalized: e164, masked: maskPhone(e164) };
  } catch (err) {
    if (err instanceof ParseError) return null;
    throw err;
  }
}

/** Quick validity check without building a full ParsedIdentifier. */
export function isValidIdentifier(raw: string): boolean {
  return parseIdentifier(raw) !== null;
}
