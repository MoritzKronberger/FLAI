# Express Server

## About

This project uses Express.

## Getting Started

### Install dependencies

```bash
npm install
```

### Run server for development

```bash
npm run dev
```

### Run server for production

```bash
npm run prod
```

### Run from Docker, including Database

The Express-server can be started from the docker-compose.yml in the project root.

```bash
docker-compose up --build express-server
```

### Access server

At: <http://localhost:5000>

## Using the REST Client

Make sure you have the [REST Client extension](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) installed.

The .rest files used to test the API are located in `/src/requests`.

### Get Webtoken

In `auth.rest` use **POST /login** to log into an existing account  
or create new account with `user.rest` > **POST /user**.

### Setup environment variables

Environment variables are used to share ids and tokens across all rest files.

1. Copy values from the responses body

    **user_id** and **token** from `auth.rest` **POST /login**  
    **exercise_id**           form `exercise.rest` **GET /all**

2. Paste values into the given variable placeholders in the root `/.vscode/settings.json`.
