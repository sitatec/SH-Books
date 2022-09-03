FROM node:16-alpine

WORKDIR /usr/app

COPY package.json .
RUN npm i --only=prod
COPY . .

CMD ["npm", "start"]