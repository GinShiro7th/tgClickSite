const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");

const app = express();
const port = 3000;

// Настройки для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "archievs");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// Рендеринг HTML-страницы
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Обработка загрузки файла
app.post("/upload", upload.single("fileToUpload"), async (req, res) => {
  console.log(req.file);
  const file = req.file;
  if (!file) {
    return res.status(400).send("Файл не был загружен.");
  }
  // Переместите файл из временной директории в нужное место
  const destinationDir = "archievs"; // Папка, куда нужно переместить файл
  const newFilePath = `${destinationDir}/${file.originalname}`;

  fs.rename(file.path, newFilePath, (err) => {
    if (err) {
      return res.status(500).send("Ошибка при перемещении файла.");
    }
  });

  res.send("Файл был успешно загружен в бот Telegram.");
});

module.exports = app;

app.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});
