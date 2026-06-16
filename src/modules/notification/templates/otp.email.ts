interface OtpEmailOptions {
  code: string;
  locale: string;
  siteName: string;
  siteUrl: string;
  expiryMinutes: number;
}

const LABELS: Record<string, Record<string, string>> = {
  fa: {
    title: 'کد تایید',
    greeting: 'سلام',
    body: 'کد تایید ورود به آکادمی شما:',
    expiry: 'این کد تا {min} دقیقه دیگر معتبر است.',
    ignore: 'اگر درخواست ورود نداشته‌اید، این ایمیل را نادیده بگیرید.',
    footer: 'با احترام',
  },
  en: {
    title: 'Verification Code',
    greeting: 'Hello',
    body: 'Your verification code for the academy:',
    expiry: 'This code expires in {min} minutes.',
    ignore: 'If you did not request this, please ignore this email.',
    footer: 'Best regards',
  },
  ps: {
    title: 'د تایید کوډ',
    greeting: 'سلام',
    body: 'ستاسو د اکاډمۍ ننوتلو د تایید کوډ:',
    expiry: 'دا کوډ د {min} دقیقو لپاره معتبر دی.',
    ignore: 'که تاسو دا غوښتنه نه وه کړې، دا بریښنالیک له پامه غورځوئ.',
    footer: 'د درناوي سره',
  },
};

export function buildOtpEmail(opts: OtpEmailOptions): { subject: string; html: string } {
  const dir = opts.locale === 'en' ? 'ltr' : 'rtl';
  const l = LABELS[opts.locale] ?? LABELS['fa'];
  const expiry = l.expiry.replace('{min}', String(opts.expiryMinutes));

  const subject = `${l.title} — ${opts.siteName}`;

  const html = `<!DOCTYPE html>
<html lang="${opts.locale}" dir="${dir}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${subject}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0f172a; font-family: system-ui, -apple-system, sans-serif; padding: 32px 16px; }
    .card { background: #1e293b; border-radius: 16px; max-width: 480px; margin: 0 auto; overflow: hidden; }
    .header { background: #0ea5e9; padding: 24px 32px; text-align: center; }
    .header h1 { color: #fff; font-size: 20px; font-weight: 800; }
    .body { padding: 32px; direction: ${dir}; }
    .greeting { color: #94a3b8; font-size: 14px; margin-bottom: 16px; }
    .label { color: #cbd5e1; font-size: 14px; margin-bottom: 12px; }
    .code-box { background: #0f172a; border: 2px solid #0ea5e9; border-radius: 12px; padding: 20px; text-align: center; margin: 20px 0; }
    .code { color: #0ea5e9; font-size: 36px; font-weight: 900; letter-spacing: 10px; font-family: monospace; }
    .expiry { color: #64748b; font-size: 12px; margin-top: 16px; }
    .ignore { color: #475569; font-size: 11px; margin-top: 24px; border-top: 1px solid #334155; padding-top: 16px; }
    .footer { background: #0f172a; padding: 16px 32px; text-align: center; }
    .footer p { color: #475569; font-size: 11px; }
    .footer a { color: #0ea5e9; text-decoration: none; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>${opts.siteName}</h1>
    </div>
    <div class="body">
      <p class="greeting">${l.greeting} 👋</p>
      <p class="label">${l.body}</p>
      <div class="code-box">
        <div class="code">${opts.code}</div>
      </div>
      <p class="expiry">${expiry}</p>
      <p class="ignore">${l.ignore}</p>
    </div>
    <div class="footer">
      <p>${l.footer} — <a href="${opts.siteUrl}">${opts.siteName}</a></p>
    </div>
  </div>
</body>
</html>`;

  return { subject, html };
}
