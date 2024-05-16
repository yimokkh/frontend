# Указываем базовый образ
FROM node:18-alpine

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем все файлы проекта
COPY . .

# Строим проект (если нужно)
RUN npm run build

# Запускаем сервер разработки Vite
CMD ["npm", "run", "dev", "--", "--host"]
