FROM debian:bookworm-slim AS builder

# 1. 安装必要的工具
RUN apt-get update && \
    apt-get install -y wget unzip tar && \
    rm -rf /var/lib/apt/lists/*

# 2. 设置工作目录
WORKDIR /app

# 3. 下载所有需要的资源
RUN wget https://github.com/jgraph/drawio/releases/download/v24.4.10/draw.war -O draw.war && \
    wget https://github.com/mozilla/pdf.js/releases/download/v4.3.136/pdfjs-4.3.136-dist.zip -O pdfjs.zip && \
    wget https://github.com/jamebal/excalidraw/releases/download/v0.17.3/build.tar.gz -O excalidraw.tar.gz

# 4. 创建目录并解压文件到对应目录
RUN mkdir -p draw pdfjs excalidraw && \
    unzip draw.war -d draw && \
    unzip pdfjs.zip -d pdfjs && \
    tar -xvf excalidraw.tar.gz -C excalidraw

# 5. 清理不必要的文件
RUN rm -rf draw/META-INF draw/WEB-INF


FROM nginx:1.27-alpine

# 1. 清理 Nginx 默认的配置和欢迎页面
RUN rm -f /etc/nginx/conf.d/* /usr/share/nginx/html/*

# 2. 从构建阶段 (builder) 复制处理好的静态文件到 Nginx 的服务目录
COPY --from=builder /app/draw /usr/share/nginx/html/draw
COPY --from=builder /app/pdfjs /usr/share/nginx/html/pdfjs
COPY --from=builder /app/excalidraw /usr/share/nginx/html/excalidraw

# 3. 复制你的自定义 Nginx 配置文件
COPY docker/nginx-drawio/drawio.conf /etc/nginx/conf.d/drawio.conf
COPY docker/nginx-drawio/excalidraw.conf /etc/nginx/conf.d/excalidraw.conf
COPY docker/nginx-drawio/pdfjs.conf /etc/nginx/conf.d/pdfjs.conf
COPY docker/nginx-drawio/mime.types /etc/nginx/mime.types
