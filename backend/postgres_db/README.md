# Postgres Database

The Postgres database is started from the docker-compose.yml in the project root.

To only start the Postgres database and Adminer the below commands can be used, however both are also started if the whole docker-compose is executed.

## Build Docker Images

```bash
docker-compose build postgres-db
```

## Start Docker Containers

```bash
docker-compose up postgres-db
```

## Access Adminer

At <http://localhost:7000>

## Shut Down Docker Containers

```bash
docker-compose down
```
