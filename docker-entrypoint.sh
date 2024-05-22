#!/bin/bash
set -e
echo "API_URL: $API_URL"
echo "API_OFFICE_URL: $API_OFFICE_URL"
envsubst '${API_URL} ${API_OFFICE_URL}' < /var/www/public/config.js.template > /var/www/public/config.js
cat /var/www/public/config.js
exec "$@"
