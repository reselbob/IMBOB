FROM node:10.13.0
EXPOSE 4000
COPY . .
RUN npm install
RUN node server.js