FROM node:18-alpine

WORKDIR /app

RUN npm install -g pnpm

# Copy package files
COPY package*.json ./

# Install dependencies with frozen lockfile for security
RUN pnpm install 

COPY index.html ./

# Copy source code
COPY src/ ./src/

COPY .env ./

COPY vite.config.js ./

# Build the app
RUN pnpm run build

# Use a multi-stage build to reduce final image size
FROM node:18-alpine

WORKDIR /app

# Install serve globally in the final stage
RUN npm install -g serve

# Copy only the built files from previous stage
COPY --from=0 /app/dist ./dist

# Expose port 3002
EXPOSE 3002

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002/ || exit 1

# Start the app with non-root user for security
USER node

# Start serve with explicit host binding
CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:3002"]