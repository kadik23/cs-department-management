FROM php:8.2-cli

# Install system dependencies
RUN apt-get update -y && apt-get install -y \
    libmcrypt-dev \
    libpq-dev \
    unzip \
    git \
    curl \
    libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql zip

# Install Node.js 20.x
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - \
    && apt-get install -y nodejs

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Set the working directory
WORKDIR /app

# Copy the entire application first
COPY . .

# Copy environment file
COPY .env.example .env

# Set production environment
ENV APP_ENV=production
ENV VITE_APP_ENV=production

# Install PHP dependencies (including dev dependencies for documentation)
RUN composer install --optimize-autoloader --no-interaction

# Install Node.js dependencies and build frontend assets with memory optimization
RUN npm install && NODE_OPTIONS="--max-old-space-size=512" npm run build

# Set proper permissions
RUN chown -R www-data:www-data /app/storage /app/bootstrap/cache

# Expose the Laravel port
ENV PORT 8000
EXPOSE 8000

# Grant execute permission to the start script
RUN chmod +x ./scripts/start.sh

# Start the Laravel application
CMD ["sh", "./scripts/start.sh"]
