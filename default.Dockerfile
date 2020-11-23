FROM mhart/alpine-node:12.19

RUN apk add --no-cache make gcc g++ python git mysql-client

RUN mkdir -p /var/app/dist /var/app/logs
WORKDIR /var/app

COPY . .
RUN npm install
RUN rm -f /var/app/.npmrc

EXPOSE 3000
