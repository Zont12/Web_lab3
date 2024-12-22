const canvas = document.getElementById("graphCanvas");
const ctx = canvas.getContext("2d");

// Параметры холста
const width = canvas.width;
const height = canvas.height;
const centerX = width / 2; // Центр холста по X
const centerY = height / 2; // Центр холста по Y

// Значение для масштабирования радиуса R
const fixedR = 100; // Фиксированное значение R для отрисовки меток

// Функция для рисования координатных осей и подписей
function drawAxis() {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.lineWidth = 3; // Увеличенная толщина линии

    // Горизонтальная ось
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);

    // Вертикальная ось
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);

    ctx.stroke();
    addLabelsAndPoints(fixedR);
}

// Функция для добавления подписей и точек на координатных осях
function addLabelsAndPoints(R) {
    ctx.fillStyle = "black";
    ctx.font = "bold 14px Courier New"; // Жирный шрифт

    // Разметка и подписи на оси X
    drawPoint(centerX + R, centerY, "R");
    drawPoint(centerX + R / 2, centerY, "R/2");
    drawPoint(centerX - R, centerY, "-R");
    drawPoint(centerX - R / 2, centerY, "-R/2");

    // Разметка и подписи на оси Y
    drawPoint(centerX, centerY - R, "R");
    drawPoint(centerX, centerY - R / 2, "R/2");
    drawPoint(centerX, centerY + R, "-R");
    drawPoint(centerX, centerY + R / 2, "-R/2");

    // Линии разметки на оси Y
    drawLine(centerX - 5, centerY - R, centerX + 5, centerY - R); // Линия на R
    drawLine(centerX - 5, centerY - R / 2, centerX + 5, centerY - R / 2); // Линия на R/2
    drawLine(centerX - 5, centerY + R, centerX + 5, centerY + R); // Линия на -R
    drawLine(centerX - 5, centerY + R / 2, centerX + 5, centerY + R / 2); // Линия на -R/2
}

// Функция для рисования короткой линии разметки
function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

// Функция для рисования метки на осях
function drawPoint(x, y, label) {
    ctx.beginPath();
    ctx.moveTo(x, y - 5);
    ctx.lineTo(x, y + 5);
    ctx.stroke();

    // Добавляем текст метки
    ctx.fillText(label, x + 5, y - 5);
}

// Функция для рисования области фигуры
function drawShape(R) {
    ctx.beginPath();
    ctx.fillStyle = "rgba(0, 0, 255, 0.5)"; // Полупрозрачный синий цвет

    // Рисование прямоугольника
    ctx.rect(centerX, centerY - R, R / 2, R);

    // Рисование треугольника
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX - R/2, centerY);
    ctx.lineTo(centerX, centerY - R/2);

    // Рисование четверти окружности
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, R/2, 1.5, Math.PI , false);

    ctx.closePath();
    ctx.fill();
}
canvas.style.border = "none";

// Функция для рисования точки на месте клика
function drawClickPoint(x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "black";
    ctx.fill();

    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.stroke();
}

// Функция для перерисовки холста
function redrawCanvas() {
    ctx.clearRect(0, 0, width, height); // Очистка холста

    // Сначала рисуем область, затем оси и метки
    drawShape(fixedR); // Область фигуры
    drawAxis();        // Оси и метки сверху

    // Загружаем и рисуем сохраненные точки
    const savedPoints = JSON.parse(localStorage.getItem('clickPoints')) || [];
    savedPoints.forEach(point => drawClickPoint(point.x, point.y));
}

// Функция для создания всплывающего сообщения об ошибке
function createPopup(element, message, id, options = {}) {
    const rect = element.getBoundingClientRect();
    const popup = document.createElement('div');
    popup.className = 'error-popup';
    popup.id = id;
    popup.textContent = message;

    const topOffset = options.topOffset || -35;
    const leftOffset = options.leftOffset || 10;

    popup.style.top = (rect.top + window.scrollY + topOffset) + 'px';
    popup.style.left = (rect.left + window.scrollX + rect.width + leftOffset) + 'px';

    document.body.appendChild(popup);
}

// Функция для удаления всплывающего сообщения об ошибке по ID
function removePopup(id) {
    const popup = document.getElementById(id);
    if (popup) popup.remove();
}

// Функция для отправки данных на сервер
function sendClickDataToServer(x, y, r) {
    $.ajax({
        url: 'http://localhost:45000/wLab2-1.0-SNAPSHOT/controller', // URL сервлета ControllerServlet
        method: 'GET',
        data: {
            x: x,
            y: y,
            r: r
        },
        success: function(response) {
            console.log('Ответ сервера:', response);
            window.location.href = 'result.jsp';
        },
        error: function(xhr, status, error) {
            console.error('Ошибка запроса:', status, error);
            alert('Произошла ошибка при отправке данных на сервер!');
        }
    });
}

// Рисуем оси и фигуру при загрузке
redrawCanvas();

// Обработчик клика на холст
canvas.addEventListener("click", (event) => {
    // Получаем значение радиуса R от пользователя
    const rInput = document.getElementById("r-input");
    const selectedR = parseFloat(rInput.value);

    // Проверка, выбрано ли значение R и находится ли оно в диапазоне от 1 до 4
    if (isNaN(selectedR) || selectedR < 1 || selectedR > 4) {
        createPopup(rInput, "Пожалуйста, выберите значение R в диапазоне от 1 до 4 перед кликом.", "r-error", { topOffset: 1, leftOffset: -80 });
        return;
    } else {
        removePopup("r-error");
    }

    const rect = canvas.getBoundingClientRect();
    const svgX = event.clientX - rect.left; // X координата клика относительно холста
    const svgY = event.clientY - rect.top;  // Y координата клика относительно холста

    // Пересчет координат из пикселей в координаты графика
    let planeX = (svgX - centerX) / (fixedR / selectedR); // Преобразуем SVG X в координату графика X
    let planeY = (centerY - svgY) / (fixedR / selectedR); // Преобразуем SVG Y в координату графика Y

    // Округляем X до целого числа и Y до числа с плавающей точкой
    planeX = Math.round(planeX);
    planeY = parseFloat(planeY.toFixed(2));

    console.log(`Клик по координатам: planeX = ${planeX}, planeY = ${planeY}`);

    // Устанавливаем значения в поля X и Y
    document.getElementById("y-input").value = planeY; // Записываем Y в поле ввода Y

    // Отмечаем соответствующий чекбокс для X
    const xCheckboxes = document.querySelectorAll('input[name="x-value"]');
    let xSelected = false;
    xCheckboxes.forEach(cb => {
        if (Math.round(parseFloat(cb.value)) === planeX) {
            cb.checked = true;
            xSelected = true;
        } else {
            cb.checked = false;
        }
    });

    if (!xSelected) {
        createPopup(xCheckboxes[0], "Пожалуйста, выберите значение X перед кликом.", "x-error", { topOffset: 1, leftOffset: -80 });
        return;
    } else {
        removePopup("x-error");
    }

    // Сохраняем только одну текущую координату точки в localStorage
    const newPoint = { x: svgX, y: svgY };
    localStorage.setItem('clickPoints', JSON.stringify([newPoint]));

    // Перерисовываем холст и добавляем новую точку на месте клика
    redrawCanvas();

    // Отправляем данные на сервер
    sendClickDataToServer(planeX, planeY, selectedR);
});
