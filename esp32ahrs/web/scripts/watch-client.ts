/*
6. Ручная генерация клиента
npm run gen:client
🔁 7. (опционально) watch режим генерации

Добавь:

npm i -D chokidar ts-node

scripts/watch-client.ts
*/
import chokidar from "chokidar";
import { execSync } from "child_process";

chokidar.watch("./asyncapi.yaml").on("change", () => {
  console.log("🔄 regenerating client...");
  execSync("npm run gen:client", { stdio: "inherit" });
});
