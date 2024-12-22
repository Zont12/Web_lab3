//package org.example;
//
//import jakarta.ejb.Stateless;
//import jakarta.persistence.EntityManager;
//import jakarta.persistence.EntityManagerFactory;
//import jakarta.persistence.Persistence;
//
//@Stateless
//public class ResultService {
//
//    private EntityManagerFactory emf = Persistence.createEntityManagerFactory("lab3_123");
//
//    public void saveResult(ResultBean result) {
//        EntityManager em = emf.createEntityManager();
//        em.getTransaction().begin();
//        for (MyBean point : result.getResults()) {
//            em.persist(point);
//        }
//        em.getTransaction().commit();
//        em.close();
//    }
//}
