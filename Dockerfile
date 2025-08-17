# Base dependencies stage
FROM node:20-alpine AS deps
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Install system dependencies required by Prisma
RUN apk add --no-cache openssl

# Copy package and lock files
COPY package.json pnpm-lock.yaml ./

# Copy Prisma schema 
COPY prisma ./prisma

# Install dependencies using pnpm (postinstall generates the prisma client)
RUN pnpm install --frozen-lockfile

# Copy application source
FROM node:20-alpine AS builder
WORKDIR /app

# Install pnpm again
RUN npm install -g pnpm

# Copy node_modules and prisma client
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/prisma ./prisma
COPY --from=deps /app/package.json ./package.json

# Copy the rest of the application
COPY . .

# Build the Next.js app
RUN pnpm build

# Final production image
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install pnpm
RUN npm install -g pnpm

# Copy only what's needed to run the app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

EXPOSE ${PORT}

# Start the Next.js app
CMD ["pnpm", "start"]
