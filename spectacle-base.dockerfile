ARG SPECTACLE_NODE_IMAGE_VERSION=17.0.1
ARG SPECTACLE_NGINX_IMAGE_VERSION=stable-alpine

FROM node:${SPECTACLE_NODE_IMAGE_VERSION}
WORKDIR /app

ADD package.json /app
ADD package-lock.json /app

RUN npm install -g npm@8.5.2
RUN npm install
