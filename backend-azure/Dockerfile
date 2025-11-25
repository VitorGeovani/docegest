# Dockerfile para Backend Node.js - Docegest
# Build otimizado multi-stage

################################################################################
# Stage 1: Dependencies
################################################################################
FROM node:18-alpine AS dependencies

WORKDIR /app

# Copiar apenas package.json e package-lock.json primeiro (cache layer)
COPY package*.json ./

# Instalar apenas dependências de produção
RUN npm ci --only=production && npm cache clean --force

################################################################################
# Stage 2: Build
################################################################################
FROM node:18-alpine AS build

WORKDIR /app

# Copiar package.json
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies)
RUN npm ci

# Copiar código fonte
COPY . .

# Se houver build/transpile (TypeScript, etc)
# RUN npm run build

################################################################################
# Stage 3: Runtime
################################################################################
FROM node:18-alpine

# Instalar curl para healthcheck
RUN apk add --no-cache curl

# Criar usuário não-root para segurança
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

WORKDIR /app

# Copiar dependências de produção
COPY --from=dependencies --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copiar código fonte
COPY --chown=nodejs:nodejs . .

# Criar diretórios para logs e uploads
RUN mkdir -p logs uploads && \
    chown -R nodejs:nodejs logs uploads

# Mudar para usuário não-root
USER nodejs

# Expor porta
EXPOSE 5000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5000/api/health || exit 1

# Comando de inicialização
CMD ["node", "server.js"]
