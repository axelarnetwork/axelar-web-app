# syntax=docker/dockerfile:1
FROM node:12-alpine

ARG NPM_TOKEN

COPY .npmrc .npmrc
RUN apk add --no-cache python g++ make
WORKDIR /rest
COPY . .
RUN npm install
RUN rm -f .npmrc
CMD ["npm", "run", "container-dev"]
EXPOSE 4000
