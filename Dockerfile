FROM node:20.5

# Указываем рабочую директорию
WORKDIR /app

# Копируем файлы package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci --legacy-peer-deps

# Копируем все остальные файлы проекта
COPY . .

# Генерируем Prisma клиент
RUN npx prisma generate

# Собираем приложение
RUN npm run build
