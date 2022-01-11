# Vue dockerization similar to https://vuejs.org/v2/cookbook/dockerize-vuejs-app.html
# uses simple http server for prototyping, that should be switched to nginx or apache for serious production

FROM node:lts-alpine

ARG PORT
ENV ENV_PORT $PORT

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /flai_vue_app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN npm run build

CMD http-server dist --port $ENV_PORT