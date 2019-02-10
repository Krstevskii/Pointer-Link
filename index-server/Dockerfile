FROM node:8-alpine

EXPOSE 3000

WORKDIR /usr/src/app

COPY ./package.json .

RUN npm install && npm install -g nodemon

COPY . .

CMD ["npm", "run", "start"]