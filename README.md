# FLAI - Interactive Media Semester 5 - University of Applied Sciences Augsburg

Repository for the IA5-Team-Project Web-App (Group FLAI)

## Clone repository

```bash
git clone <repository-url>
cd <repository-name>
```

## Create .env files

**.env files must not be committed to the repository!**

Username and password for the postgres superuser and regular user must be passed as parameters, the REST-server hostname can be passed as an optional parameter (the default is set correctly for a local Docker setup):

```bash
bash create_dotenv.sh <superuser username> <superuser password> <regular user username> <regular user password> <rest-hostname>?
```

If env-variables should be changed for all repo users the corresponding array must be edited in the [bash script](./create_dotenv.sh).

## Build Docker Images

```bash
docker-compose build
```

## Start Docker Containers

```bash
docker-compose up
```

## Access Containers

Defaults:

Vue at <http://localhost:3000>

Express at <http://localhost:5000>

Adminer at <http://localhost:7000>

## Shut Down Docker Containers

```bash
docker-compose down
```

## Remove Database Data

```bash
rm -rf backend/postgres_db/pgdata
```

## Remove Docker Images

```bash
docker-compose down --rmi all
```

## Further documentation

More documentation about the individual components can be found here:

[Vue](./frontend/flai_app/README.md)

[Express](./backend/express/README.md)

[Postgres](./backend/postgres_db/README.md)

[Neural Network](./neural_net/README.md)
