#!/bin/bash

# Load .env from parent directory
set -a
source ../.env
set +a

# Run migration
for file in setup.sql; do
  echo "Running db setup: $file"
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -f "$file"
done

# Run seeds
for file in seeds/*.sql; do
  echo "Running seed: $file"
  psql -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -f "$file"
done

echo "Database setup complete"