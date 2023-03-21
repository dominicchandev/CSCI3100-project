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

`python`: version >= 3.8.10

Install docker engine on https://docs.docker.com/engine/install/

Install pnpm by
```bash
npm install -g pnpm
```

# Dependencies

## API Server
If you want to start the api server without using docker, install the python dependencies by the following command:
```bash
cd server
python3 -m virtualenv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

## Frontend
```bash
pnpm install
```

# Usage

## API Server
The server will work on http://localhost:8000.

You may visit http://localhost:8000/docs to carry out api testing. 

### Develop with Docker
```bash
# Start the api server in detached mode
docker-compose up -d

# Start the api server (suggessted)
docker-compose up 

# check how many containers are running
docker ps

# Stop the api server
docker-compose down
```

### Develop with python virtual environment
Make sure that you have activate the virtual environment before running the following command.
```bash
cd server
uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
```


## Frontend
```bash
# Start the frontend serivce in development mode
pnpm dev
```

