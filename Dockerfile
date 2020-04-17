FROM node:13.8.0-alpine3.11

RUN apk update
RUN apk add docker

WORKDIR /app
COPY ./package.json /app/package.json
RUN npm install
COPY . .

CMD ["npm", "run-script", "start-production"]