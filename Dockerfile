# Перед сборкой Докер-образа надо удалить папку из проекта:
# node_modules/$APP/node_modules/sharp
# Разработчик пишет, что это решает конфликт линуксовой и яблочной версии библиотеки.

# Когда образ будет готов, чтобы продолжить разработку, 
# нужно снова установить удаленный модуль:
# npm install

FROM node:current-alpine as base

# Папка приложения
ARG APP_DIR=app
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

# Установка зависимостей
COPY package*.json ./

RUN npm install --ignore-scripts
RUN npm link sharp
RUN rm -rf node_modules/$APP/node_modules/sharp
RUN npm install --verbose

COPY . .

# Уведомление о порте, который будет прослушивать работающее приложение
EXPOSE 3000

# Запуск проекта
CMD ["npm", "start"]