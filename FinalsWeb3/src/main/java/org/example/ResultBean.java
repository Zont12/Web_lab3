package org.example;

import java.util.Collections;
import java.util.List;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.logging.Logger;

import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Named;

@Named("resultBean")
@SessionScoped
public class ResultBean implements Serializable {
    private final List<Point> results = Collections.synchronizedList(new ArrayList<>());
    private static final Logger logger = Logger.getLogger(ResultBean.class.getName());

    public List<Point> getResults() {
        return results;
    }

    public void addResult(Point point) {
        logger.info(point.getX() + " " + point.getY());
        results.add(point);
    }
    public void updatePoints(float radius) {
        for (Point point : results) {
            logger.info(point.toString());
            point.setR(radius);
            point.setIsHit(CheckerHit.hit(point.getX(), point.getY(), radius));
        }
    }
    public void clearPoints() {
        results.clear();
    }
}       