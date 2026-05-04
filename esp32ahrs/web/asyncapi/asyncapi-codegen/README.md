# AsyncAPI Generated SDK — Usage Guide
# Этот проект генерирует **типобезопасный клиент и Pinia stores** на основе AsyncAPI схемы.
---

## 📦 Что генерируетсяПосле запуска codegen:
generated/
├─ client.ts        # API клиент (WebSocket)
├─ message-map.ts   # карта типов сообщений
├─ types.ts         # TypeScript типы payload'ов
├─ stores/
│  ├─ foo.ts        # Pinia stores по каналам
│  └─ ...
---

## 🚀 Быстрый старт

### 1. Импорт store```tsimport { useFooStore } from "@/generated/stores/foo";

2. Использование в компоненте (Vue + Pinia)
const store = useFooStore();store.connect();

📡 Получение данных (receive)
Данные приходят автоматически после connect():
watch(() => store.data, (data) => {  console.log(data);});
Тип data соответствует AsyncAPI message payload.

📤 Отправка сообщений (send)
Методы генерируются автоматически из AsyncAPI:
store.sendTemperature({  value: 42});
✅ Типобезопасность
store.sendTemperature({ value: 42 });     // OKstore.sendTemperature({ foo: "bar" });    // ❌ ошибка TS

🔌 Работа с клиентом напрямую (опционально)
import { APIClient } from "@/generated/client";const client = new APIClient();client.send("Temperature", { value: 42 });client.on("Temperature", (payload) => {  console.log(payload.value);});

🧠 Как это работает
AsyncAPI → генерирует типы сообщений
типы → используются в:
client (send/on)
stores (actions)
всё связано через MessageMap

🔄 Обновление кода
После изменения asyncapi.yaml:
npm run generate
или (если включён watch):
npm run generate -- --watch

⚠️ Важно
Не редактируй файлы в generated/ вручную
Все изменения делай через AsyncAPI
Генерация перезапишет код

🛠 Требования
Vue.js + Composition API
Pinia
TypeScript

💡 Рекомендации
Используй stores как единую точку работы с WS
Не вызывай client напрямую в компонентах
Типизируй UI через сгенерированные types

🐞 Отладка
Если что-то не работает:
Проверь asyncapi.yaml
Перегенерируй код
Убедись, что типы совпадают


---
