#!/usr/bin/env bash
set -e

# $1 username for postgres superuser
# $2 password for postgres superuser
# $3 username for regular postgres user
# $4 password for regular postgres user

PG_DB="flai_db_v1"
PG_PORT="5432"

declare -A express=(
    ["dir"]="backend/express"
    ["PORT"]="5000"
    ["ACCESS_TOKEN_SECRET"]=$(openssl rand -hex 64)
    ["REFRESH_TOKEN_SECRET"]=$(openssl rand -hex 64)
    ["PG_USER"]="$3"
    ["PG_PASSWORD"]="$4"
    ["PG_DB"]="$PG_DB"
    ["PG_HOSTNAME"]="localhost"
    ["PG_PORT"]="$PG_PORT"
)

declare -A docker=(
    ["dir"]="."
    ["IMAGE_TAG"]="flai"
    ["VUE_APP_HOST_PORT"]="3000"
    ["VUE_APP_CONTAINER_PORT"]="3000"
    ["EXPRESS_APP_HOST_PORT"]="5000"
    ["EXPRESS_APP_CONTAINER_PORT"]="5000"
    ["ACCESS_TOKEN_SECRET"]=$(openssl rand -hex 64)
    ["REFRESH_TOKEN_SECRET"]=$(openssl rand -hex 64)
    ["POSTGRES_DB_HOST_PORT"]="$PG_PORT"
    ["POSTGRES_DB_CONTAINER_PORT"]="5432"
    ["PG_USER"]="$1"
    ["PG_PASSWORD"]="$2"
    ["PG_DB"]="postgres"
    ["DEV_USER"]="$3"
    ["DEV_PASSWORD"]="$4"
    ["DEV_DB"]="$PG_DB"
    ["ADMINER_HOST_PORT"]="7000"
    ["ADMINER_CONTAINER_PORT"]="8080"
)

create_env_variables(){
    for env in $1
    do
        declare -n dict=$env
        directory=${dict[dir]}
        cd $directory
        echo "Creating $env .env in $directory"
        [ ! -e .env ] || rm .env
        for var in "${!dict[@]}"
        do  
            [ "$var" != "dir" ] && echo "$var=${dict[$var]}" >> .env
        done
        unset -n dict
        cd - >/dev/null
    done
}

create_env_variables 'express docker'

echo "------------> $0 has finished successfully"