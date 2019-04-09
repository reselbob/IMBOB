FROM node:10.13.0
EXPOSE 4000
COPY . .
CMD npm install
CMD node server.js