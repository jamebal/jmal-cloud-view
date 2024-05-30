FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

COPY dist /var/www/public

COPY config.js.template /var/www/public/config.js.template

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
