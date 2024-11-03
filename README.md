# Webscraper for www.freelancermap.de

## Description

This app scrapes the projects of www.freelancermap.de  

Starting from the start url:
![grafik](https://github.com/user-attachments/assets/486527ec-7a8c-42b9-9022-f1591f9b0c6f)

the next Button is used until the end is reached.
![grafik](https://github.com/user-attachments/assets/f46e5da6-3717-47ed-a914-e9829a627336)

Results are written to Docker Volume

## Configuration

create .env File at root level with values:

```sh
USERNAME=''
PASSWORD=''
STARTURL=''
```

Path to Result file Data.json is defined in compose.yaml file

```sh
services:
  webscraping:
    build:
      context: . 
    env_file:
     - .env
    volumes:
    - ./:/usr/src/app/
    ports:
      - 3000:3000
```

## Run the App

```sh
docker compose up --build
```






