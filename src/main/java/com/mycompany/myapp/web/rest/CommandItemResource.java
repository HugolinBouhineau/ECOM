package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.CommandItem;
import com.mycompany.myapp.domain.Plant;
import com.mycompany.myapp.repository.CommandItemRepository;
import com.mycompany.myapp.service.CommandItemService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.CommandItem}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CommandItemResource {

    private final Logger log = LoggerFactory.getLogger(CommandItemResource.class);

    private static final String ENTITY_NAME = "commandItem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CommandItemRepository commandItemRepository;

    private final CommandItemService commandItemService;

    public CommandItemResource(CommandItemRepository commandItemRepository, CommandItemService commandItemService) {
        this.commandItemRepository = commandItemRepository;
        this.commandItemService = commandItemService;
    }

    /**
     * {@code POST  /command-items} : Create a new commandItem.
     *
     * @param commandItem the commandItem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new commandItem, or with status {@code 400 (Bad Request)} if the commandItem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/command-items")
    public ResponseEntity<CommandItem> createCommandItem(@RequestBody CommandItem commandItem) throws URISyntaxException {
        log.debug("REST request to save CommandItem : {}", commandItem);
        if (commandItem.getId() != null) {
            throw new BadRequestAlertException("A new commandItem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        CommandItem result = commandItemRepository.save(commandItem);
        return ResponseEntity
            .created(new URI("/api/command-items/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /command-items/:id} : Updates an existing commandItem.
     *
     * @param id the id of the commandItem to save.
     * @param commandItem the commandItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated commandItem,
     * or with status {@code 400 (Bad Request)} if the commandItem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the commandItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/command-items/{id}")
    public ResponseEntity<CommandItem> updateCommandItem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CommandItem commandItem
    ) throws URISyntaxException {
        log.debug("REST request to update CommandItem : {}, {}", id, commandItem);
        if (commandItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, commandItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!commandItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        CommandItem result = commandItemRepository.save(commandItem);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, commandItem.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /command-items/:id} : Partial updates given fields of an existing commandItem, field will ignore if it is null
     *
     * @param id the id of the commandItem to save.
     * @param commandItem the commandItem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated commandItem,
     * or with status {@code 400 (Bad Request)} if the commandItem is not valid,
     * or with status {@code 404 (Not Found)} if the commandItem is not found,
     * or with status {@code 500 (Internal Server Error)} if the commandItem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/command-items/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CommandItem> partialUpdateCommandItem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody CommandItem commandItem
    ) throws URISyntaxException {
        log.debug("REST request to partial update CommandItem partially : {}, {}", id, commandItem);
        if (commandItem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, commandItem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!commandItemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CommandItem> result = commandItemRepository
            .findById(commandItem.getId())
            .map(existingCommandItem -> {
                if (commandItem.getQuantity() != null) {
                    existingCommandItem.setQuantity(commandItem.getQuantity());
                }

                return existingCommandItem;
            })
            .map(commandItemRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, commandItem.getId().toString())
        );
    }

    /**
     * {@code GET  /command-items} : get all the commandItems.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of commandItems in body.
     */
    @GetMapping("/command-items")
    public List<CommandItem> getAllCommandItems() {
        log.debug("REST request to get all CommandItems");
        return commandItemRepository.findAll();
    }

    /**
     * {@code GET  /command-items/:id} : get the "id" commandItem.
     *
     * @param id the id of the commandItem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the commandItem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/command-items/{id}")
    public ResponseEntity<CommandItem> getCommandItem(@PathVariable Long id) {
        log.debug("REST request to get CommandItem : {}", id);
        Optional<CommandItem> commandItem = commandItemRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(commandItem);
    }

    /**
     * {@code DELETE  /command-items/:id} : delete the "id" commandItem.
     *
     * @param id the id of the commandItem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/command-items/{id}")
    public ResponseEntity<Void> deleteCommandItem(@PathVariable Long id) {
        log.debug("REST request to delete CommandItem : {}", id);
        commandItemRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/command-items/best-seller")
    public List<Plant> getBestSeller() {
        return commandItemService.getBestSeller();
    }
}
