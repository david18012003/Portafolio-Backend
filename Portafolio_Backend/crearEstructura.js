const fs = require("fs");

const carpetas = [
  "config",
  "controllers",
  "routes",
  "models",
  "services",
  "middlewares",
  "utils",
  "database",
  "i18n",
  "jobs"
];

const archivos = [
  "app.js"
];

carpetas.forEach((carpeta) => {
  fs.mkdirSync(carpeta, { recursive: true });
});

archivos.forEach((archivo) => {
  fs.writeFileSync(archivo, "", { flag: "w" });
});

console.log("✅ Estructura de 'src' creada correctamente");
