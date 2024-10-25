FROM jmal/nginx-drawio:latest

COPY nginx.conf.no_office.template /etc/nginx/nginx.conf.no_office.template
COPY nginx.conf.template /etc/nginx/nginx.conf.template

COPY dist /var/www/public

COPY config.js.template /var/www/public/config.js.template

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
