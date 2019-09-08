FROM node:current-alpine as base
# FROM jorgehortelano/node-sharp as base

# Add necessary packages for Sharp to work
#RUN apk add --update-cache --repository http://dl-3.alpinelinux.org/alpine/edge/testing \
#  vips-dev fftw-dev gcc g++ make libc6-compat


ENV SHARP_VERSION 0.18.1

RUN  apk --no-cache add libpng librsvg libgsf giflib libjpeg-turbo musl \
     && apk add vips-dev fftw-dev build-base --update-cache  --repository https://alpine.global.ssl.fastly.net/alpine/edge/testing/  --repository https://alpine.global.ssl.fastly.net/alpine/edge/main \
     && apk --no-cache add --virtual .build-dependencies g++ make python curl tar gtk-doc gobject-introspection expat-dev glib-dev libpng-dev libjpeg-turbo-dev giflib-dev librsvg-dev  \
     && su node \
     && npm install sharp@${SHARP_VERSION} --g --production --unsafe-perm \
     && chown node:node /usr/local/lib/node_modules -R \
     && apk del .build-dependencies

# Папка приложения
ARG APP_DIR=app
RUN mkdir -p ${APP_DIR}
WORKDIR ${APP_DIR}

# Установка зависимостей
COPY package*.json ./
# RUN npm install sharp
RUN npm install --build-from-source
# RUN npm install
# Для использования в продакшне
# RUN npm install --production

# Копирование файлов проекта
COPY . .

# Уведомление о порте, который будет прослушивать работающее приложение
EXPOSE 3000

# Запуск проекта
CMD ["npm", "start"]