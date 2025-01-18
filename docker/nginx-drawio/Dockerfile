FROM nginx:latest

RUN apt-get update && \
    apt-get install -y unzip wget && \
    mkdir -p /etc/nginx/servers /var/www && \
    wget https://github.com/jgraph/drawio/releases/download/v24.4.10/draw.war -O /var/www/draw.war && \
    wget https://github.com/mozilla/pdf.js/releases/download/v4.3.136/pdfjs-4.3.136-dist.zip -O /var/www/pdfjs.zip && \
    wget https://github.com/jamebal/excalidraw/releases/download/v0.17.3/build.tar.gz -O /var/www/excalidraw.tar.gz && \
    mkdir -p /var/www/excalidraw && \
    unzip /var/www/draw.war -d /var/www/draw && \
    unzip /var/www/pdfjs.zip -d /var/www/pdfjs && \
    tar -xvf /var/www/excalidraw.tar.gz -C /var/www/excalidraw && \
    rm -rf /var/www/pdfjs.zip /var/www/excalidraw.tar.gz /var/www/draw.war /var/www/draw/META-INF /var/www/draw/WEB-INF && \
    apt-get remove -y unzip wget && \
    apt-get autoremove -y && \
    apt-get clean

COPY docker/nginx-drawio/drawio.conf /etc/nginx/servers/drawio.conf
COPY docker/nginx-drawio/excalidraw.conf /etc/nginx/servers/excalidraw.conf
COPY docker/nginx-drawio/pdfjs.conf /etc/nginx/servers/pdfjs.conf
COPY docker/nginx-drawio/mime.types /etc/nginx/mime.types
