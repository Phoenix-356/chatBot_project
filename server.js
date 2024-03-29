const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

const app = express();

// Парсинг JSON
app.use(bodyParser.json());

// Подключение статических файлов
app.use(express.static('public'));

// GET запрос на корневой URL
app.get('/', (req, res) => {
    // Отправляем файл index.html
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST запрос на /login
app.post('/login', (req, res) => {
    // Получаем данные из тела запроса
    const { email, password } = req.body;

    // Сохраняем данные в JSON файл
    const userData = { email, password };
    saveDataToJson(userData);

    // Вместо этого места можно добавить логику проверки авторизации пользователя
    // Например, можно сравнить полученные данные с данными в базе данных

    // Отправляем ответ в формате JSON
    res.json({ success: true, message: 'Авторизация прошла успешно', email });
});

// Создание директории 'data', если она не существует
const dataDirectory = path.join(__dirname, 'data');
if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory);
}

// Функция для сохранения данных в JSON файл
function saveDataToJson(data) {
    // Создаем путь к файлу, в который будем сохранять данные
    const filePath = path.join(dataDirectory, 'users.json');

    // Читаем содержимое файла
    fs.readFile(filePath, 'utf8', (err, fileData) => {
        if (err) {
            // Если произошла ошибка при чтении файла, выводим сообщение об ошибке и выходим из функции
            console.error('Ошибка при чтении файла:', err);
            return;
        }

        // Инициализируем переменную для хранения данных из файла
        let jsonData = [];

        // Если файл не пустой, парсим его содержимое из JSON обратно в объект JavaScript
        if (fileData) {
            jsonData = JSON.parse(fileData);
        }

        // Добавляем новые данные в массив данных
        jsonData.push(data);

        // Записываем обновленные данные обратно в файл
        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), err => {
            if (err) {
                // Если произошла ошибка при записи в файл, выводим сообщение об ошибке
                console.error('Ошибка при записи в файл:', err);
                return;
            }
            // В случае успешной записи выводим сообщение об успехе
            console.log('Данные успешно сохранены в файл');
        });
    });
}

// Запуск сервера на порту 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
});
