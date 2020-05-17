#!/usr/bin/env sh

# Set Env Vars
PORT=4080
CONVERGENCE_URL="http://localhost:8000/api/realtime/convergence/default"

# Run the docker build
docker run --rm \
  --publish $PORT:80 \
  --env CONVERGENCE_URL=$CONVERGENCE_URL \
  convergencelabs/demo-geo-sketch