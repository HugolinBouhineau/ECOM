package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.CommandItem;
import com.mycompany.myapp.domain.Plant;
import com.mycompany.myapp.repository.CommandItemRepository;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class CommandItemService {

    private final CommandItemRepository commandItemRepository;

    private final Logger log = LoggerFactory.getLogger(CommandItemService.class);

    public CommandItemService(CommandItemRepository commandItemRepository) {
        this.commandItemRepository = commandItemRepository;
    }

    public List<Plant> getBestSeller() {
        log.debug("REST request to get all CommandItems");
        List<CommandItem> list_items = commandItemRepository.findAll();
        List<Plant> list_plant = new ArrayList<Plant>();
        List<Integer> list_quantite = new ArrayList<Integer>();
        int index = 0;
        for (CommandItem item : list_items) {
            Plant plant = item.getPlant();
            Integer quantite = item.getQuantity();
            if (list_plant.contains(plant)) {
                index = list_plant.indexOf(plant);
                quantite = list_quantite.get(index) + quantite;
                list_quantite.set(index, quantite);
            } else {
                list_plant.add(plant);
                list_quantite.add(quantite);
            }
        }
        List<Plant> list_final = new ArrayList<Plant>();
        for (int i = 0; i < 3; i++) {
            if (!list_plant.isEmpty()) {
                Integer max = Collections.max(list_quantite);
                index = list_quantite.indexOf(max);
                list_final.add(list_plant.get(index));
                list_quantite.remove(index);
                list_plant.remove(index);
            }
        }
        return list_final;
    }
}
