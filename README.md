# Group members
Group ID: C1 

|Name|SID|
|:-:|:-:|
|Tse Ka Hei|1155159810| 
|Cheng Ming Chun Jason|1155126862| 
|Ng Hiu Tsun|1155144015| 
|Chan Ching Yan|115512569| 
|Chan Tin Lok|1155126874|

# OS
This readme is based on ubuntu macine.

# Pre-requisite
`python`: version >= 3.8.10

Install pnpm by
```bash
npm install -g pnpm
```

Also, please add `.env` to the root directory.

# Dependencies

## API Server
If you want to start the api server, install the python dependencies by the following command:
```bash
python3 -m virtualenv server/venv
source server/venv/bin/activate
pip install --upgrade pip
pip install -r server/requirements.txt
```

## Frontend
```bash
pnpm install
```

# Usage

## API Server
The server will work on http://localhost:8000.

You may visit http://localhost:8000/docs to carry out api testing. 


### Develop with python virtual environment
Make sure that you have activate the virtual environment before running the following command. Run the following command in the root directory:
```bash
uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
```


## Frontend
```bash
# Start the frontend serivce in development mode
pnpm dev
```

