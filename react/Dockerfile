FROM node:alpine
 
WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm run build

CMD npx serve dist -p 80

EXPOSE 80