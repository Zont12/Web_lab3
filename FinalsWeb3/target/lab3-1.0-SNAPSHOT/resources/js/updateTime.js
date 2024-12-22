function updateClock() {
    var now = new Date();
    var formattedDate = now.toLocaleString();
    document.getElementById('current-time').innerHTML = formattedDate;
}

// Обновляем время каждые 12 секунд
setInterval(updateClock, 12000);

// Первоначальное обновление времени
updateClock();