#!/usr/bin/env bash
set -e

declare -A express=(
    ["dir"]="backend/express"
    ["PORT"]="5000"
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

create_env_variables 'express'

echo "------------> $0 has finished successfully"