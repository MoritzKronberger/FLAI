#!/usr/bin/env bash
set -e
db=$DEV_DB

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
CREATE USER $DEV_USER WITH LOGIN CREATEDB PASSWORD '$DEV_PASSWORD';
EOSQL

echo "Creating Database $db"
createdb --username $DEV_USER $db 

FILES=/tmp/*.sql

for f in $FILES
do
  echo "Inserting schema and data into $db"
  psql -v ON_ERROR_STOP=1 --username $DEV_USER -f $f $db
done

echo "------------> $0 has finished successfully"