# Dockerfile para Frontend React - Docegest
# Build otimizado multi-stage com Nginx

################################################################################
# Stage 1: Build
################################################################################
FROM node:18-alpine AS build

WORKDIR /app

# Argumentos de build para variáveis de ambiente
ARG REACT_APP_API_URL
ARG REACT_APP_WHATSAPP_NUMBER

# Definir variáveis de ambiente
ENV REACT_APP_API_URL=$REACT_APP_API_URL
ENV REACT_APP_WHATSAPP_NUMBER=$REACT_APP_WHATSAPP_NUMBER

# Copiar package.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --legacy-peer-deps

# Copiar código fonte
COPY . .

# Build para produção
RUN npm run build

################################################################################
# Stage 2: Nginx Runtime
################################################################################
FROM nginx:alpine

# Copiar build do React
COPY --from=build /app/build /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost || exit 1

# Nginx já tem CMD, não precisa definir
