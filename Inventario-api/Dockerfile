FROM node:20-alpine

WORKDIR /app

# Instalar dependencias de producción y desarrollo para compilar
COPY package*.json ./
RUN npm install

# Copiar el código fuente y prisma
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src

# Compilar TypeScript
RUN npx prisma generate
RUN npm run build

# Exponer el puerto
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Iniciar la aplicación directamente desde el dist compilado
CMD ["node", "dist/index.js"]