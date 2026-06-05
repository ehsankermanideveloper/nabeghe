#!/bin/bash
# ─────────────────────────────────────────────────────────────────
#  Nabeghe — Nginx setup script (Ubuntu 22.04 / 24.04)
#  Usage: sudo bash nginx/setup.sh YOUR_DOMAIN /opt/nabeghe
#  Example: sudo bash nginx/setup.sh nabeghe.ir /opt/nabeghe
# ─────────────────────────────────────────────────────────────────
set -e

DOMAIN="${1:?Usage: sudo bash nginx/setup.sh YOUR_DOMAIN DEPLOY_PATH}"
DEPLOY_PATH="${2:-/opt/nabeghe}"

echo ""
echo "══════════════════════════════════════════"
echo "  Domain      : $DOMAIN"
echo "  Deploy path : $DEPLOY_PATH"
echo "══════════════════════════════════════════"
echo ""

# ── 1. Install nginx ──────────────────────────────────────────
echo "▶ Installing nginx..."
apt update -qq
apt install -y nginx

systemctl enable nginx
systemctl start nginx
echo "  ✓ nginx installed"

# ── 2. Install Certbot ────────────────────────────────────────
echo "▶ Installing Certbot..."
apt install -y certbot python3-certbot-nginx
echo "  ✓ certbot installed"

# ── 3. Copy configs ───────────────────────────────────────────
echo "▶ Copying configs..."

cp "$DEPLOY_PATH/nginx/nginx.conf" /etc/nginx/nginx.conf

# Replace domain placeholder
sed "s/YOUR_DOMAIN/$DOMAIN/g" \
    "$DEPLOY_PATH/nginx/nabeghe.conf" \
    > /etc/nginx/sites-available/nabeghe.conf

# Enable site, disable default
ln -sf /etc/nginx/sites-available/nabeghe.conf /etc/nginx/sites-enabled/nabeghe.conf
rm -f /etc/nginx/sites-enabled/default

# Cache dir
mkdir -p /var/cache/nginx/nabeghe
chown -R www-data:www-data /var/cache/nginx/nabeghe

echo "  ✓ configs copied"

# ── 4. Get SSL certificate ────────────────────────────────────
echo "▶ Getting SSL certificate for $DOMAIN ..."

# Temporarily serve HTTP only so Certbot can verify domain
# (comment out SSL lines in config before first cert issue)
sed -i \
    -e '/ssl_certificate/s/^/# /' \
    -e '/ssl_session/s/^/# /' \
    -e '/ssl_protocols/s/^/# /' \
    -e '/ssl_ciphers/s/^/# /' \
    -e '/ssl_prefer/s/^/# /' \
    -e '/Strict-Transport/s/^/# /' \
    -e 's/listen 443 ssl;/listen 443;/' \
    -e 's/listen \[::\]:443 ssl;/listen [::]:443;/' \
    -e 's/http2 on;//' \
    /etc/nginx/sites-available/nabeghe.conf

nginx -t && systemctl reload nginx

certbot --nginx \
    -d "$DOMAIN" \
    -d "www.$DOMAIN" \
    --non-interactive \
    --agree-tos \
    --register-unsafely-without-email \
    --redirect

# ── 5. Restore full config (certbot already injects SSL paths) ─
cp "$DEPLOY_PATH/nginx/nabeghe.conf" /etc/nginx/sites-available/nabeghe.conf.bak
sed "s/YOUR_DOMAIN/$DOMAIN/g" \
    "$DEPLOY_PATH/nginx/nabeghe.conf" \
    > /etc/nginx/sites-available/nabeghe.conf

nginx -t && systemctl reload nginx
echo "  ✓ SSL certificate obtained"

# ── 6. Auto-renew cron ────────────────────────────────────────
echo "▶ Setting up auto-renewal..."
(crontab -l 2>/dev/null; echo "0 3 * * * certbot renew --quiet && systemctl reload nginx") | crontab -
echo "  ✓ auto-renewal scheduled (daily at 3am)"

# ── 7. Done ───────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════════"
echo "  ✓ Done!"
echo "  Site: https://$DOMAIN"
echo "══════════════════════════════════════════"
