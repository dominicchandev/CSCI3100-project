# Pre-requisite
`docker`: version 23.0.0

`docker-compose`: version 1.29.2

`python`: version 3.8.10


# Python Packages
```bash
cd server
python3 -m virtualenv venv
source venv/bin/activate
pip install -r requirements.txt
```

# Usage
```bash
# Start the database server first
docker-compose up -d

# Start the api server
uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
```
