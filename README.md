# joi · deck

Personal media dashboard — Next.js 15 (App Router) + MongoDB.

## Prerequisites

- Node.js 18+
- A MongoDB instance (local `mongod`, Docker, or Atlas)

## Setup

```bash
npm install
cp .env.example .env.local      # then edit MONGODB_URI if needed
npm run seed                    # loads the sample clips
npm run dev                     # http://localhost:3000
```

The default `MONGODB_URI` is `mongodb://127.0.0.1:27017/joi_deck`.

### Quick MongoDB via Docker

```bash
docker run -d --name joi-mongo -p 27017:27017 mongo:7
```

## Run the whole stack with Docker

A multi-stage `Dockerfile` (Next.js standalone output) and a local Compose file
(`local/docker-compose.yml`) bring up the app **and** MongoDB together:

```bash
# build + start MongoDB and the app  →  http://localhost:3000
docker compose -f local/docker-compose.yml up --build

# load the sample entries (one-off; run once the stack is up)
docker compose -f local/docker-compose.yml run --rm seed

# stop everything (add -v to also wipe the database volume)
docker compose -f local/docker-compose.yml down
```

Mongo is published on host port **27018** (to avoid clashing with a local `mongod`
on 27017). Build the production image on its own with `docker build -t joi-deck .`
(expects `MONGODB_URI` at runtime).
