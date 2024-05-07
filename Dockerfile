FROM node:18.17

# Update npm
RUN npm install --location=global npm@10.7.0

WORKDIR /app

COPY . .

COPY start.sh /usr/local/bin/start.sh
RUN chmod +x /usr/local/bin/start.sh

EXPOSE 3004

CMD ["/usr/local/bin/start.sh"]
