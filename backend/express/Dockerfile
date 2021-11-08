FROM node:lts-alpine

ARG PORT
ENV ENV_PORT $PORT

# make the 'flai_app' folder the current working directory
WORKDIR /flai_express_app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN npm install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

CMD PORT=$ENV_PORT node src/server.js