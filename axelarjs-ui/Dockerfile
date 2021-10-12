## syntax=docker/dockerfile:1

# pull official base image
FROM node:13.12.0-alpine

ARG NPM_TOKEN

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc

# install app dependencies
COPY package.json ./
#COPY package-lock.json ./
RUN npm install
RUN npm install react-scripts@4.0.3 -g
RUN rm -f .npmrc

# add app
COPY . ./

# start app
CMD ["npm", "start"]