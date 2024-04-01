FROM node:lts-alpine

WORKDIR /usr/src/app

COPY . .

ENV VUE_APP_DOTA_BACKEND_API=http://api:3000

RUN npm install

EXPOSE 8080

CMD ["npm", "run", "serve"]