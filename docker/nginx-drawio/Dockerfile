FROM nginx:latest

RUN apt-get update && apt-get install -y unzip wget

RUN mkdir -p /etc/nginx/servers /var/www

RUN wget https://github.com/jgraph/drawio/releases/download/v24.4.10/draw.war -O /var/www/draw.war

RUN unzip /var/www/draw.war -d /var/www/draw

RUN rm -rf /var/www/draw.war /var/www/draw/META-INF /var/www/draw/WEB-INF

RUN apt-get remove -y unzip wget && \
        apt-get autoremove -y && \
        apt-get clean

COPY docker/nginx-drawio/drawio.conf /etc/nginx/servers/drawio.conf
