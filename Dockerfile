# syntax=docker/dockerfile:experimental

# build stage
FROM node:lts-alpine AS builder

WORKDIR /app
COPY package.json /app/package.json
RUN npm install

ENV NODE_ENV=production

COPY . /app
RUN npm run build

# production stage
FROM nginx:1.7-alpine

COPY --from=builder /app/build /usr/share/nginx/html
