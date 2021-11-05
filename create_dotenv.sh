#!/usr/bin/env bash
set -e

# $1 username for postgres superuser
# $2 password for postgres superuser
# $3 username for regular postgres user
# $4 passowrd for regular postgres user

declare -A express=(
    ["dir"]="backend/express"
    ["PORT"]="5000"
)

declare -A docker=(
    ["dir"]="."
    ["IMAGE_TAG"]="flai"
    ["VUE_APP_HOST_PORT"]="3000"
    ["VUE_APP_CONTAINER_PORT"]="3000"
    ["POSTGRES_DB_HOST_PORT"]="5432"
    ["POSTGRES_DB_CONTAINER_PORT"]="5432"
    ["PG_USER"]="$1"
    ["PG_PASSWORD"]="$2"
    ["PG_DB"]="postgres"
    ["DEV_USER"]="$3"
    ["DEV_PASSWORD"]="$4"
    ["DEV_DB"]="flai_db_v1"
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