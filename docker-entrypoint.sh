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

# 循环检查，直到 jmalcloud 主机名可以被成功解析
# 使用 getent hosts 是比 ping 更可靠的方式，因为它直接查询名称服务
while ! getent hosts jmalcloud > /dev/null 2>&1; do
  echo "jmalcloud is not yet resolvable, waiting 2 seconds..."
  sleep 2
done

echo "jmalcloud is now resolvable. Starting Nginx..."

exec "$@"
