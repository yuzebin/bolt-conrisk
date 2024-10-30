FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Create necessary directories with proper permissions
RUN mkdir -p server/database server/uploads \
    && chown -R node:node server/database server/uploads

# Copy source code
COPY . .

# Build frontend
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --production

# Create necessary directories
RUN mkdir -p server/database server/uploads \
    && chown -R node:node server/database server/uploads

# Copy built frontend and server files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server
COPY .env ./

# Switch to non-root user
USER node

EXPOSE 3000

CMD ["node", "server/index.js"]