#!/bin/bash
set -e
envsubst < /var/www/public/config.js > /var/www/public/config.js
exec "$@"
