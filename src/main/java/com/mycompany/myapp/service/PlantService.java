package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.CommandItem;
import com.mycompany.myapp.domain.Plant;
import com.mycompany.myapp.domain.PlantQuantity;
import javax.persistence.EntityManager;
import javax.persistence.LockModeType;
import javax.persistence.PersistenceContext;

import com.mycompany.myapp.web.rest.CommandItemResource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
@Transactional
public class PlantService {

    private final Logger log = LoggerFactory.getLogger(PlantService.class);

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    public Boolean verifyAndUpdateStock(@RequestBody PlantQuantity[] quantitiesAsked) {
        log.debug("REST request to verifyStock :");
        for (PlantQuantity quantityAsked : quantitiesAsked) {
            Plant plant = entityManager.find(Plant.class, quantityAsked.getPlantId(), LockModeType.PESSIMISTIC_WRITE);
            int remainingStock = plant.getStock() - quantityAsked.getPlantQuantity();
            if (remainingStock < 0) {
                log.debug(
                    "plante {} pas en stock, asked: {}, stock: {}",
                    quantityAsked.getPlantId(),
                    quantityAsked.getPlantQuantity(),
                    plant.getStock()
                );
                throw new DataIntegrityViolationException("Une plante n'est plus en stock dans la quantité demandé");
            } else {
                plant.setStock(remainingStock);
                log.debug(
                    "plante {} en stock, asked: {}, stock: {}, remaining: {}",
                    quantityAsked.getPlantId(),
                    quantityAsked.getPlantQuantity(),
                    plant.getStock(),
                    remainingStock
                );
            }
        }
        return true;
    }

    @Transactional
    public Boolean refillPlant(@RequestBody long commandId, List<CommandItem> list_command ) {
        log.debug("REST request to refillPlant for {}:", commandId);
        for(CommandItem command : list_command){
            log.debug("item : {} ", command.getCommand().getId());
            if(command.getCommand().getId() == commandId){
                Plant plant = entityManager.find(Plant.class, command.getPlant().getId(), LockModeType.PESSIMISTIC_WRITE);
                int refillStock = plant.getStock() + command.getQuantity();
                plant.setStock(refillStock);
                log.debug(
                    "plante {} en stock, asked: {}, stock: {}, now: {}",
                    command.getPlant().getId(),
                    command.getQuantity(),
                    plant.getStock(),
                    refillStock
                );
            }
        }
        return true;
    }
}
