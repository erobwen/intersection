FROM node:alpine
 
ENV PRODUCTION=true

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

CMD node dist/src/main.js

EXPOSE 3000