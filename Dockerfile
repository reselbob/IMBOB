FROM node:8.9-alpine
EXPOSE 4000
COPY . .
CMD apt install npm -y
CMD npm install --production
CMD node server.js