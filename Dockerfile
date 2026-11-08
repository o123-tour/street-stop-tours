FROM oven/bun:1 AS builder
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install

COPY . .
ENV VITE_BASE_PATH=/
RUN bun run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

COPY --from=builder /app/dist/client ./dist/client
COPY --from=builder /app/server.mjs ./server.mjs

EXPOSE 8080
CMD ["node", "server.mjs"]
