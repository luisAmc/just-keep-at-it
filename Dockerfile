FROM node:20-slim as base
RUN apt-get update && apt-get install -y python3
ARG PNPM_VERSION=9.15.5
RUN npm --global install pnpm@${PNPM_VERSION}

FROM base as builder
WORKDIR /builder
COPY pnpm-*.yaml ./
RUN pnpm fetch
COPY . .
RUN pnpm install --offline --unsafe-perm
RUN pnpm prisma generate
RUN pnpm run build

FROM base AS runner
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production
ENV PORT 3000

COPY --from=builder /builder/package.json ./package.json
COPY --from=builder /builder/next.config.js ./
COPY --from=builder /builder/public ./public
COPY --from=builder /builder/prisma ./prisma
COPY --from=builder /builder/.next ./.next
COPY --from=builder /builder/node_modules ./node_modules

EXPOSE ${PORT}
CMD [ "pnpm", "run", "start" ]