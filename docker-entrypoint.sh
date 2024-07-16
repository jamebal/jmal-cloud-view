#!/bin/bash
set -e
envsubst '${API_URL} ${API_OFFICE_URL}' < /var/www/public/config.js.template > /var/www/public/config.js
exec "$@"
