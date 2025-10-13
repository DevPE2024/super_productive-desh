# Use Node.js 20 as base image
FROM node:20-alpine

# Install OpenSSL, Python, build tools and other required dependencies for Prisma and bcrypt
RUN apk add --no-cache \
    openssl \
    openssl-dev \
    libc6-compat \
    python3 \
    make \
    g++

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (including dev dependencies for build)
RUN npm ci --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application with increased memory limit
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Expose port
EXPOSE 8001

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8001

# Start the application
CMD ["npm", "start"]