package org.example;


import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;

import java.util.Date;
import java.util.logging.Logger;

@Named("formBean")
@RequestScoped
public class FormBean {
    @Inject
    private ResultBean resultBean;
    private static final Logger logger = Logger.getLogger(ResultBean.class.getName());

    public void processForm(Point point) {
        long startTime = System.nanoTime();
        boolean isHit = CheckerHit.hit(point.getX(), point.getY(), point.getR());
        point.setIsHit(isHit);
        point.setCreatedAt(new Date());
        long endTime = System.nanoTime();
        point.setExecutionTime(endTime - startTime);
        if (shouldUpdateAllPoints(point.getR())) {
            resultBean.updatePoints(point.getR());
        }
        resultBean.addResult(point);
        logger.info(point.getX() + " " + point.getY() + " " + point.getR());

    }
    private boolean shouldUpdateAllPoints(float radius) {
        return !resultBean.getResults().isEmpty() && resultBean.getResults().get(0).getR() != radius;
    }
    public void processClean() {
        resultBean.clearPoints();
    }
}