# ---- Build Stage ----
FROM node:20-alpine AS builder

# Install OpenSSL 3 compatibility for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Copy dependency files first for better layer caching
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install all dependencies (including devDependencies for build)
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY tsconfig.json ./
COPY src ./src/

# Build TypeScript
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS production

# Install OpenSSL 3 compatibility for Prisma
RUN apk add --no-cache openssl

WORKDIR /app

# Add non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Copy dependency files
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install production dependencies only
RUN npm install --omit=dev

# Generate Prisma client for production
RUN npx prisma generate

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Create uploads directory
RUN mkdir -p public/assets/uploads && \
    chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port (Cloud Run uses PORT env var)
EXPOSE 8080

# Set default environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Start the application
CMD ["node", "dist/server.js"]
