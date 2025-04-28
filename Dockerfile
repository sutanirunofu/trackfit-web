FROM node:18-alpine AS builder
WORKDIR /app

# Устанавливаем зависимости
COPY package.json package-lock.json ./
RUN npm ci

# Копируем исходный код и собираем проект
COPY . .
RUN npm run build

# Финализируем образ
FROM node:18-alpine

WORKDIR /app

# Копируем только нужные файлы из собранного приложения
COPY package.json package-lock.json ./
COPY --from=builder /app/dist/fitness-client ./dist/fitness-client

EXPOSE 4000
CMD ["npm", "run", "serve:ssr:FitnessClient"]