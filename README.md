# Storefront Backend Project

## Requirements
* docker-compose
* db-migrate (ideally, installed globally)

## Setup and connection to DB
Before starting the app, you need to configure some things and start the DB. So...
1. Rename the `.env.example` file to `.env` and provide values for the environment variables.
2. Start the docker container with the database. The project contains a docker-compose file, so you only need to run:
````
$ docker-compose up -d
````
3. When the container is running, you'll have to create the databases for dev and test environments. You can do it manually or run the `create-db` script. For the latter, run:
````
$ bash create-db.sh
````
:warning: It will install *db-migrate* globally if you haven't done it yet.

## Start the application
In order to start the server, run
````
npm start
````
It will be running on port __3000__
Check the requirements.md file for a list of the available endpoints.

## Running the tests
Before running the tests, tables have to be created on the test DB. Make sure that DB exists and then run:
````
npm test
`````
If all tests were successful, the tables on the test DB should have been dropped. If not, manually run `npm run test:drop-db`.
