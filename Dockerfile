FROM node:16 as builder

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build:prod

FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

COPY nginx.conf /etc/nginx/nginx.conf.template

COPY --from=builder /app/dist /usr/share/nginx/html

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
