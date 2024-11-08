FROM node:18-alpine

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Create logs directory with proper permissions
RUN mkdir -p logs && chmod 777 logs

# Copy package files first (for better caching)
COPY package.json ./

# Install dependencies
RUN pnpm install

# Copy source code
COPY src/ ./src/

COPY .env ./

COPY data/company_products.json ./data/company_products.json
COPY data/patents.json ./data/patents.json
RUN echo "[]" > ./data/reports.json

# Expose port from .env (default 3001)
EXPOSE 3001

# Start the server
CMD ["pnpm", "start"] 