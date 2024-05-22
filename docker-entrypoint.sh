#!/bin/bash
set -e
export API_URL=
export API_OFFICE_URL=
envsubst '${API_URL} ${API_OFFICE_URL}' < /var/www/public/config.js.template > /var/www/public/config.js
cat /var/www/public/config.js
exec "$@"
