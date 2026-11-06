#!/usr/bin/env bash
# Waits for required docker containers to be healthy before starting app
set -euo pipefail

echo "Checking local infrastructure..."
timeout 15 bash -c 'until nc -z localhost 6379; do sleep 1; done' && echo "Redis is ready!"
timeout 15 bash -c 'until nc -z localhost 27017; do sleep 1; done' && echo "MongoDB is ready!"
echo "All infrastructure components are available."
