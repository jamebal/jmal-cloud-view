#!/bin/sh
set -e

# ... 其余内容保持不变 ...
if getent hosts office &> /dev/null; then
    cp /etc/nginx/nginx.conf.template /etc/nginx/nginx.conf
else
    cp /etc/nginx/nginx.conf.no_office.template /etc/nginx/nginx.conf
fi

envsubst '${API_URL} ${API_OFFICE_URL}' < /var/www/public/config.js.template > /var/www/public/config.js

while ! getent hosts jmalcloud > /dev/null 2>&1; do
  echo "jmalcloud is not yet resolvable, waiting 2 seconds..."
  sleep 2
done

echo "jmalcloud is now resolvable. Starting Nginx..."

exec "$@"
