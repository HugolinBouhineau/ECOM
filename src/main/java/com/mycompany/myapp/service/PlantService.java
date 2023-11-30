package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Plant;
import com.mycompany.myapp.domain.PlantQuantity;
import javax.persistence.EntityManager;
import javax.persistence.LockModeType;
import javax.persistence.PersistenceContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

@Service
@Transactional
public class PlantService {

    private final Logger log = LoggerFactory.getLogger(PlantService.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public Boolean verifyAndUpdateStock(@RequestBody PlantQuantity[] quantitiesAsked) {
        log.debug("REST request to verifyStock :");
        boolean inStock = true;
        for (PlantQuantity quantityAsked : quantitiesAsked) {
            Plant plant = entityManager.find(Plant.class, quantityAsked.getPlantId(), LockModeType.PESSIMISTIC_WRITE);
            log.debug("PLANT : {}", plant);
            int remainingStock = plant.getStock() - quantityAsked.getPlantQuantity();
            if (remainingStock < 0) {
                log.debug(
                    "plante {} pas en stock, asked: {}, stock: {}",
                    quantityAsked.getPlantId(),
                    quantityAsked.getPlantQuantity(),
                    plant.getStock()
                );
                inStock = false;
            } else {
                log.debug(
                    "plante {} en stock, asked: {}, stock: {}, remaining: {}",
                    quantityAsked.getPlantId(),
                    quantityAsked.getPlantQuantity(),
                    plant.getStock(),
                    remainingStock
                );
            }
        }
        if (inStock) {
            for (PlantQuantity quantityAsked : quantitiesAsked) {
                Plant plant = entityManager.find(Plant.class, quantityAsked.getPlantId(), LockModeType.PESSIMISTIC_WRITE);
                plant.setStock(plant.getStock() - quantityAsked.getPlantQuantity());
            }
            return true;
        } else {
            return false;
        }
    }
}
