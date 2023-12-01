package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.CommandItem;
import com.mycompany.myapp.domain.Plant;
import com.mycompany.myapp.domain.PlantQuantity;
import com.mycompany.myapp.repository.PlantRepository;
import com.mycompany.myapp.service.InvalidPageException;
import com.mycompany.myapp.service.PlantService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Plant}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PlantResource {

    private final Logger log = LoggerFactory.getLogger(PlantResource.class);

    private static final String ENTITY_NAME = "plant";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlantRepository plantRepository;

    private final PlantService plantService;

    private final CommandItemResource cir;

    public PlantResource(PlantRepository plantRepository, PlantService plantService, CommandItemResource cir) {
        this.plantRepository = plantRepository;
        this.plantService = plantService;
        this.cir = cir;
    }

    /**
     * {@code POST  /plants} : Create a new plant.
     *
     * @param plant the plant to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new plant, or with status {@code 400 (Bad Request)} if the plant has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/plants")
    public ResponseEntity<Plant> createPlant(@RequestBody Plant plant) throws URISyntaxException {
        log.debug("REST request to save Plant : {}", plant);
        if (plant.getId() != null) {
            throw new BadRequestAlertException("A new plant cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Plant result = plantRepository.save(plant);
        return ResponseEntity
            .created(new URI("/api/plants/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/plants/verifyAndUpdateStock")
    public Boolean verifyAndUpdateStock(@RequestBody PlantQuantity[] quantitiesAsked) {
        return plantService.verifyAndUpdateStock(quantitiesAsked);
    }

    @PostMapping("/plants/refillPlant")
    public Boolean refillPlant(@RequestBody long commandId) {
        List<CommandItem> list_command = cir.getAllCommandItems();
        return plantService.refillPlant(commandId, list_command);
    }

    /**
     * {@code PUT  /plants/:id} : Updates an existing plant.
     *
     * @param id the id of the plant to save.
     * @param plant the plant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plant,
     * or with status {@code 400 (Bad Request)} if the plant is not valid,
     * or with status {@code 500 (Internal Server Error)} if the plant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/plants/{id}")
    public ResponseEntity<Plant> updatePlant(@PathVariable(value = "id", required = false) final Long id, @RequestBody Plant plant)
        throws URISyntaxException {
        log.debug("REST request to update Plant : {}, {}", id, plant);
        if (plant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!plantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Plant result = plantRepository.save(plant);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plant.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /plants/:id} : Partial updates given fields of an existing plant, field will ignore if it is null
     *
     * @param id the id of the plant to save.
     * @param plant the plant to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plant,
     * or with status {@code 400 (Bad Request)} if the plant is not valid,
     * or with status {@code 404 (Not Found)} if the plant is not found,
     * or with status {@code 500 (Internal Server Error)} if the plant couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/plants/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Plant> partialUpdatePlant(@PathVariable(value = "id", required = false) final Long id, @RequestBody Plant plant)
        throws URISyntaxException {
        log.debug("REST request to partial update Plant partially : {}, {}", id, plant);
        if (plant.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plant.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!plantRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Plant> result = plantRepository
            .findById(plant.getId())
            .map(existingPlant -> {
                if (plant.getName() != null) {
                    existingPlant.setName(plant.getName());
                }
                if (plant.getLatinName() != null) {
                    existingPlant.setLatinName(plant.getLatinName());
                }
                if (plant.getDescription() != null) {
                    existingPlant.setDescription(plant.getDescription());
                }
                if (plant.getPrice() != null) {
                    existingPlant.setPrice(plant.getPrice());
                }
                if (plant.getStock() != null) {
                    existingPlant.setStock(plant.getStock());
                }
                if (plant.getImagePath() != null) {
                    existingPlant.setImagePath(plant.getImagePath());
                }

                return existingPlant;
            })
            .map(plantRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plant.getId().toString())
        );
    }

    /**
     * {@code GET  /plants} : get all the plants.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of plants in body.
     */
    @GetMapping("/plants")
    public List<Plant> getAllPlants(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Plants");
        if (eagerload) {
            return plantRepository.findAllWithEagerRelationships();
        } else {
            return plantRepository.findAll();
        }
    }

    /**
     * {@code GET  /plants/:id} : get the "id" plant.
     *
     * @param id the id of the plant to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the plant, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/plants/{id}")
    public ResponseEntity<Plant> getPlant(@PathVariable Long id) {
        log.debug("REST request to get Plant : {}", id);
        Optional<Plant> plant = plantRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(plant);
    }

    /**
     * {@code GET /plants/filter/paginate} : get the number "page" of a page with "size" plants
     * where the name of the plant contains "name" and all of his categories ids containing "categoriesId"
     *
     * @param page the number of the page
     * @param size the number of elements in a page
     * @param name the name containing in the name of a plant
     * @param categoriesId categories id contains in the categories of a plant
     * @return the page with the "size" plants
     */
    @GetMapping("plants/filter/paginate")
    public Page<Plant> filterPlantPaginate(
        @RequestParam(required = false, defaultValue = "0") int page,
        @RequestParam(required = false, defaultValue = "5") int size,
        @RequestParam(required = false, defaultValue = "no") String sort,
        @RequestParam(required = false, defaultValue = "") String name,
        @RequestParam(required = false, defaultValue = "") List<Long> categoriesId
    ) {
        log.debug(
            "REST request with page {} and size {} to get Plants containing '{}' and with these categories {}",
            page,
            size,
            name,
            categoriesId
        );

        if (page < 0) {
            throw new InvalidPageException(page);
        }

        Page<Plant> pageResult = plantService.filterPlantPaginate(page, size, sort, name, categoriesId);

        if (page > pageResult.getTotalPages()) {
            throw new InvalidPageException(page);
        }

        return pageResult;
    }

    @GetMapping("plants/price/max")
    public Integer getMaxPrice() {
        return plantService.findMaxPrice();
    }

    /**
     * {@code DELETE  /plants/:id} : delete the "id" plant.
     *
     * @param id the id of the plant to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/plants/{id}")
    public ResponseEntity<Void> deletePlant(@PathVariable Long id) {
        log.debug("REST request to delete Plant : {}", id);
        plantRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
