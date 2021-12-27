FROM node:lts-alpine

ARG PORT
ARG ACCESS_TOKEN_SECRET
ARG REFRESH_TOKEN_SECRET
ARG PG_USER
ARG PG_PASSWORD
ARG PG_DB
ARG PG_HOSTNAME
ARG PG_PORT

ENV PORT                 $PORT
ENV ACCESS_TOKEN_SECRET  $ACCESS_TOKEN_SECRET
ENV REFRESH_TOKEN_SECRET $REFRESH_TOKEN_SECRET
ENV PG_USER              $PG_USER
ENV PG_PASSWORD          $PG_PASSWORD
ENV PG_DB                $PG_DB
ENV PG_HOSTNAME          $PG_HOSTNAME
ENV PG_PORT              $PG_PORT

# make the 'flai_app' folder the current working directory
WORKDIR /flai_express_app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./                  

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

CMD node src/server.js