# syntax=docker/dockerfile:1
FROM node:12-alpine

ARG NPM_TOKEN
COPY .npmrc .npmrc
RUN apk add --no-cache python g++ make
WORKDIR /src
COPY . .
RUN npm install
RUN rm -f .npmrc
CMD ["npm", "run", "dev"]
EXPOSE 4000
