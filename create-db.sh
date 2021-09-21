#!/usr/bin/env bash

echo "This script will install db-migrate package globally if not installed."
echo -n "Proceed? [y/n]: "
read ans

if [[ "$ans" == "${ans#[Yy]}" ]]; then
  exit 1
fi

npm list -g | grep db-migrate || npm install -g db-migrate

if [[ -f .env ]]; then
  db_names=$(grep POSTGRES_DB .env | cut -d '=' -f2)
  if [[ -n "$db_names" ]]; then
    echo "Creating $db_names..."
    for db in $db_names; do
      db-migrate db:create $db
    done
  else
    echo "Couldn't find POSTGRES_DB names. Check the .env.example file and set the values accordingly in your .env file."
  fi
else
  echo "There's no .env file. Check the .example.env file and set the values accordingly in your .env file."
fi
