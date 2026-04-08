# ESP32 Three.js + WebSocket Project

## Установка

1. Склонируйте репозиторий
2. Установите зависимости:

npm install

3. Запуск дев-сервера:

npm run dev

4. Сборка проекта для ESP32:

npm run build

5. Все файлы будут в папке dist/

Залейте index.html и bundle.js в LittleFS ESP32.


# ESP32 Web Component

## Сборка фронтенда
1. Перейдите в `components/web/`:
   ```bash
   cd components/web
   npm install
   npm run build
   gzip -kf dist/*.js dist/*.html dist/*.css

# Включить флаги для поддржки в браузера
chrome://flags/#enable-web-bluetooth
https://googlechrome.github.io/samples/web-bluetooth/scan.html
https://vueuse.org/core/useBluetooth/


chrome://flags/#canvas-draw-element
chrome://flags/#enable-webgl-draft-extensions
