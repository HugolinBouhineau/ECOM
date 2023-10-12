package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Plants;
import com.mycompany.myapp.repository.PlantsRepository;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.Plants}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class PlantsResource {

    private final Logger log = LoggerFactory.getLogger(PlantsResource.class);

    private static final String ENTITY_NAME = "plants";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final PlantsRepository plantsRepository;

    public PlantsResource(PlantsRepository plantsRepository) {
        this.plantsRepository = plantsRepository;
    }

    /**
     * {@code POST  /plants} : Create a new plants.
     *
     * @param plants the plants to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new plants, or with status {@code 400 (Bad Request)} if the plants has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/plants")
    public ResponseEntity<Plants> createPlants(@RequestBody Plants plants) throws URISyntaxException {
        log.debug("REST request to save Plants : {}", plants);
        if (plants.getId() != null) {
            throw new BadRequestAlertException("A new plants cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Plants result = plantsRepository.save(plants);
        return ResponseEntity
            .created(new URI("/api/plants/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /plants/:id} : Updates an existing plants.
     *
     * @param id the id of the plants to save.
     * @param plants the plants to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plants,
     * or with status {@code 400 (Bad Request)} if the plants is not valid,
     * or with status {@code 500 (Internal Server Error)} if the plants couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/plants/{id}")
    public ResponseEntity<Plants> updatePlants(@PathVariable(value = "id", required = false) final Long id, @RequestBody Plants plants)
        throws URISyntaxException {
        log.debug("REST request to update Plants : {}, {}", id, plants);
        if (plants.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plants.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!plantsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Plants result = plantsRepository.save(plants);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plants.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /plants/:id} : Partial updates given fields of an existing plants, field will ignore if it is null
     *
     * @param id the id of the plants to save.
     * @param plants the plants to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated plants,
     * or with status {@code 400 (Bad Request)} if the plants is not valid,
     * or with status {@code 404 (Not Found)} if the plants is not found,
     * or with status {@code 500 (Internal Server Error)} if the plants couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/plants/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Plants> partialUpdatePlants(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Plants plants
    ) throws URISyntaxException {
        log.debug("REST request to partial update Plants partially : {}, {}", id, plants);
        if (plants.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, plants.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!plantsRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Plants> result = plantsRepository
            .findById(plants.getId())
            .map(existingPlants -> {
                if (plants.getName() != null) {
                    existingPlants.setName(plants.getName());
                }
                if (plants.getLatinName() != null) {
                    existingPlants.setLatinName(plants.getLatinName());
                }
                if (plants.getDescription() != null) {
                    existingPlants.setDescription(plants.getDescription());
                }
                if (plants.getPrice() != null) {
                    existingPlants.setPrice(plants.getPrice());
                }
                if (plants.getStock() != null) {
                    existingPlants.setStock(plants.getStock());
                }
                if (plants.getImagePath() != null) {
                    existingPlants.setImagePath(plants.getImagePath());
                }

                return existingPlants;
            })
            .map(plantsRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, plants.getId().toString())
        );
    }

    /**
     * {@code GET  /plants} : get all the plants.
     *
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of plants in body.
     */
    @GetMapping("/plants")
    public List<Plants> getAllPlants(@RequestParam(required = false, defaultValue = "false") boolean eagerload) {
        log.debug("REST request to get all Plants");
        if (eagerload) {
            return plantsRepository.findAllWithEagerRelationships();
        } else {
            return plantsRepository.findAll();
        }
    }

    /**
     * {@code GET  /plants/:id} : get the "id" plants.
     *
     * @param id the id of the plants to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the plants, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/plants/{id}")
    public ResponseEntity<Plants> getPlants(@PathVariable Long id) {
        log.debug("REST request to get Plants : {}", id);
        Optional<Plants> plants = plantsRepository.findOneWithEagerRelationships(id);
        return ResponseUtil.wrapOrNotFound(plants);
    }

    /**
     * {@code DELETE  /plants/:id} : delete the "id" plants.
     *
     * @param id the id of the plants to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/plants/{id}")
    public ResponseEntity<Void> deletePlants(@PathVariable Long id) {
        log.debug("REST request to delete Plants : {}", id);
        plantsRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
