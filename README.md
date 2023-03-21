# Group members
Group ID: C1 

|Name|SID|
|:-:|:-:|
|Tse Ka Hei|1155159810| 
|Cheng Ming Chun Jason|1155126862| 
|Ng Hiu Tsun|1155144015| 
|Chan Ching Yan|115512569| 
|Chan Tin Lok|1155126874|


# Pre-requisite
`docker`: version 23.0.0

`docker-compose`: version 1.29.2

Install docker engine on https://docs.docker.com/engine/install/

Install pnpm by
```bash
npm install -g pnpm
```


# Usage

## Server and Database
The server and the database containers will work on http://localhost:8000 and http://localhost:5432 respectively.

You may visit http://localhost:8000/docs to carry out api testing. 
```bash
# Start the database server and the api server in detached mode
docker-compose up -d

# Start the database server and the api server (suggessted)
docker-compose up 

# check how many containers are running
docker ps

# Stop the database server and the api server
docker-compose down

# Stop the servers and clean up the database
docker-compose down -v
```


## Frontend
```bash
# Install dependencies to node_module
pnpm install 

# Start the frontend serivce in development mode
pnpm dev
```

