#!/bin/bash

echo "# Linking storage..."
php artisan storage:link
echo "# Building frontend assets..."
npm install
npm run build
npm run dev &
echo "# Starting the PHP application..."
php artisan serve --host=0.0.0.0 --port=8000
