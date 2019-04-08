FROM node:8.9-alpine
EXPOSE 4000
COPY . .
CMD npm install --production
CMD node server.js