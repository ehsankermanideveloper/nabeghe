export type IdentifierKind = 'phone' | 'email';

export interface ParsedIdentifier {
  kind: IdentifierKind;
  normalized: string;
  masked: string;
}

const IR_MOBILE = /^(\+98|0098|98|0)?9\d{9}$/;

export function parseIdentifier(raw: string): ParsedIdentifier | null {
  const trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.includes('@')) {
    const email = trimmed.toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return null;
    }
    const [local, domain] = email.split('@');
    const masked =
      local.length <= 2
        ? `${local[0] ?? ''}***@${domain}`
        : `${local.slice(0, 2)}***@${domain}`;
    return { kind: 'email', normalized: email, masked };
  }

  const digits = trimmed.replace(/\D/g, '');
  let phone = digits;
  if (phone.startsWith('98') && phone.length === 12) {
    phone = `0${phone.slice(2)}`;
  } else if (phone.startsWith('9') && phone.length === 10) {
    phone = `0${phone}`;
  }

  if (!IR_MOBILE.test(phone)) {
    return null;
  }

  const masked = `${phone.slice(0, 4)}*****${phone.slice(-2)}`;
  return { kind: 'phone', normalized: phone, masked };
}
