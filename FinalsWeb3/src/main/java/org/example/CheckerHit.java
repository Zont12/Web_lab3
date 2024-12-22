package org.example;

public class CheckerHit {

    public static boolean hit(float x, float y, float r) {
        return inRectangle(x, y, r) || inTriangle(x, y, r) || inCircle(x, y, r);
    }

    // Проверка попадания в прямоугольник
    private static boolean inRectangle(float x, float y, float r) {
        return x >= 0 && y >= 0 && x <= r / 2 && y <= r;
    }

    // Проверка попадания в треугольник
    private static boolean inTriangle(float x, float y, float r) {
        return x <= 0 && y >= 0 && y <= (-x / 2 + r / 2) && x >= -r && y <= r / 2;
    }

    // Проверка попадания в четверть окружности
    private static boolean inCircle(float x, float y, float r) {
        return x >= 0 && y <= 0 && (x * x + y * y) <= (r / 2) * (r / 2);
    }
}