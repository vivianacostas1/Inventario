# -- ETAPA 1: BUILDER (compilar TypeScript) --
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Generar Prisma Client (necesita el schema.prisma)
RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src

# Compilar TypeScript -> JavaScript
RUN npm run build

# -- ETAPA 2: RUNNER (imagen final más pequeña) --
FROM node:20-alpine AS runner

WORKDIR /app

# dumb-init: manejo correcto de señales para cerrar la app limpiamente
RUN apk add --no-cache dumb-init

# Usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001

COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

# Copiar también la carpeta prisma por si se necesitan los esquemas o migraciones en runtime
COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

USER nodejs

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Comando de inicio usando dumb-init y apuntando al archivo compilado en dist/
CMD ["dumb-init", "node", "dist/index.js"]