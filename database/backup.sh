#!/bin/bash

# Load .env from parent directory
set -a
source ../.env
set +a

# Backup directory - creates it if it doesn't exist
BACKUP_DIR="./backups"
mkdir -p "$BACKUP_DIR"

# Create timestamp for the backup file
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/${PGDATABASE}_backup_$TIMESTAMP.sql"

# Create the backup
echo "Creating database backup: $BACKUP_FILE"
pg_dump -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -d "$PGDATABASE" -f "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "Backup created successfully"
    
    # Delete backups older than 7 days
    echo "Cleaning up old backups (older than 7 days)"
    find "$BACKUP_DIR" -name "${PGDATABASE}_backup_*.sql" -type f -mtime +7 -exec rm -v {} \;
else
    echo "Backup failed" >&2
    exit 1
fi

echo "Database backup complete"