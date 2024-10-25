#!/bin/bash
set -e

# 使用 getent 检查是否可以解析 office 容器的 IP
if getent hosts office &> /dev/null; then
    # 使用包含 office 的 Nginx 配置
    cp /etc/nginx/nginx.conf.template /etc/nginx/nginx.conf
else
    # 使用不包含 office 的 Nginx 配置
    cp /etc/nginx/nginx.conf.no_office.template /etc/nginx/nginx.conf
fi

envsubst '${API_URL} ${API_OFFICE_URL}' < /var/www/public/config.js.template > /var/www/public/config.js
exec "$@"
