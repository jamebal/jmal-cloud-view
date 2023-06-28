#!/bin/bash
set -e

# 使用envsubst命令替换nginx.conf.template文件中的环境变量
envsubst '$API_BASE_URL' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# 启动Nginx
exec "$@"
