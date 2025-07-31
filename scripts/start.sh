#!/bin/bash

echo "# Generating Laravel key..."
php artisan key:generate

echo "# Linking storage..."
php artisan storage:link

echo "# Setting up database..."
# Clear file-based caches only
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan cache:clear

# Force HTTPS in production
if [ "$APP_ENV" = "production" ]; then
    echo "# Forcing HTTPS in production..."
    php artisan config:set app.url=https://cs-department-management.onrender.com
    php artisan config:set app.force_https=true
    php artisan config:set app.secure_headers=true
    # Force HTTPS for all asset URLs
    php artisan config:set app.force_asset_https=true
    
    # Force HTTPS for Scribe documentation
    php artisan config:set scribe.base_url=https://cs-department-management.onrender.com
    php artisan config:set scribe.force_https=true
fi

# Simple PostgreSQL reset - separate statements
echo "# Resetting database completely..."
php artisan tinker --execute="DB::statement('DROP SCHEMA public CASCADE');" || true
php artisan tinker --execute="DB::statement('CREATE SCHEMA public');" || true

# Reconnect to database to clear aborted transaction state
echo "# Reconnecting to database..."
php artisan tinker --execute="DB::disconnect(); DB::reconnect();" || true

# Run migrations without transactions
echo "# Running migrations..."
php artisan migrate --force --no-interaction

# Seed the database
echo "# Seeding database..."
php artisan db:seed --force

echo "# Checking and building frontend assets..."
if [ ! -f "public/build/manifest.json" ]; then
    echo "# Manifest not found, building assets with memory optimization..."
    npm install
    NODE_OPTIONS="--max-old-space-size=512" npm run build
else
    echo "# Manifest found, skipping build..."
fi

echo "# Starting the PHP application..."
php artisan serve --host=0.0.0.0 --port=8000
