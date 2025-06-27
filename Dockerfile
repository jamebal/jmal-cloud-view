FROM jmal/nginx-drawio:latest

COPY nginx/nginx.conf.no_office.template /etc/nginx/nginx.conf.no_office.template
COPY nginx/nginx.conf.template /etc/nginx/nginx.conf.template

COPY nginx/proxy_params.conf /etc/nginx/conf/proxy_params.conf
COPY nginx/proxy_params_file.conf /etc/nginx/conf/proxy_params_file.conf

COPY dist /var/www/public

COPY config.js.template /var/www/public/config.js.template

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
