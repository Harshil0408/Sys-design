# Multi-stage Dockerfile for BookMyShow Backend
FROM node:20-alpine AS base
WORKDIR /app

# Stage 1: Dependencies
FROM base AS dependencies
COPY package.json ./
RUN npm install

# Stage 2: Builder
FROM base AS builder
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json tsconfig.json ./
COPY src ./src
RUN npm run build

# Stage 3: Runner
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY package.json ./
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/server.js"]
