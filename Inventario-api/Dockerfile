FROM node:20-alpine

WORKDIR /app

# Instalar dependencias necesarias para compilar paquetes nativos (como bcrypt en alpine)
RUN apk add --no-cache python3 make g++

# Copiar archivos de dependencias
COPY package*.json ./

# Usar npm ci para una instalación limpia y robusta en contenedores
RUN npm ci

# Copiar el código fuente, prisma y configuración de TypeScript
COPY prisma ./prisma/
COPY tsconfig.json ./
COPY src ./src

# Generar Prisma y compilar TypeScript
RUN npx prisma generate
RUN npm run build

# Exponer el puerto y definir variables de entorno por defecto
EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

# Iniciar la aplicación
CMD ["node", "dist/index.js"]