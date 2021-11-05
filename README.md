# ia5_teamprojekt_flai

Repository für das IA5-Teamprojekt Web-App (Gruppe FLAI)

## Clone repository

**A [VPN connection to the HSA](https://www.hs-augsburg.de/Rechenzentrum/Datennetz-WLAN-VPN.html) is needed to clone this repository.**

```bash
git clone https://gitlab.multimedia.hs-augsburg.de/mokro/gruppenprojekt-webprogrammierung.git
cd ProjectSetupTest
```

## Create .env files

**.env files must not be commited to the repository!**

Username and password for the postgres superuser and regular user are passed as arguments:

```bash
bash create_dotenv.sh <superuser username> <superuser password> <regular user username> <regular user password>
```

The env-variables can be changed by editing the corresponding array in the [bash script](./create_dotenv.sh) and re-executing it

## Build Docker Images

```bash
docker-compose build
```

## Start Docker Containers

```bash
docker-compose up
```

## Access Adminer

Vue at <http://localhost:3000>

Adminer at <http://localhost:7000>

## Shut Down Docker Containers

```bash
docker-compose down
```
