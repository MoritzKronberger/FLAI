# Postgres Database

## About

This project uses PostgreSQL and Adminer

## Getting Started

### Build Docker Images

The Postgres database is started from the docker-compose.yml in the project root.

To only start the Postgres database and Adminer the below commands can be used:

```bash
docker-compose up --build postgres-db
```

### Shut Down Docker Containers

```bash
docker-compose down
```

### Remove Postgres Data

Remove pgdata to reset the database:

```bash
rm -rf backend/postgres_db/pgdata
```

### Access Adminer

At <http://localhost:7000>
