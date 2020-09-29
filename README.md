
<p align="center">
  <img src="https://raw.githubusercontent.com/ccims/overview-and-documentation/c97db39633418d2a0d4e5690a810d62fe5ff5247/app_logos/logo_final_6.25p.svg">
</p>

# Issue Creator

The Issue Creator retrieves logs from the Kafka Queue described in and instantiated with the Error-Response Monitor. Based on the services that have been registered and thus saved in a service database with the Monitoring Service Selection View in the Monitoring Frontend, the Issue Creator will either accept the retrieved log, convert it into an issue and dispatch it to Sandro's API if it pertains to a registered service or ignore the log otherwise. The log with the corresponding issue id received from Sandro's API will then be saved in a log database.

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation with docker compose

```bash
$ docker-compose build
```
## Running the app with docker

```bash
$ docker-compose up
```
#### Start the database only:
```bash
$ docker run -d -p 27017:27017 mongo
```
#### If the database is running you can use:
```bash 
$ npm run start
```
## Usage

```bash
The issue creator sits at localhost:3500. 
If installed with docker the database is available at localhost:27017.
Post Request to localhost:3500 to add logs.
Post Request to localhost:3500/issue with a valid Issue ID to get the associated issue
Get Request to localhost:3500 to get all logs.
A valid component ID has to be specified in the .env file under 'BACKEND_COMPONENT_ID' in order to receive an Issue ID

```

