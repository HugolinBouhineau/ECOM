package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Command;
import com.mycompany.myapp.repository.CommandRepository;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Command}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class CommandResource {

    private final Logger log = LoggerFactory.getLogger(CommandResource.class);

    private static final String ENTITY_NAME = "command";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CommandRepository commandRepository;

    public CommandResource(CommandRepository commandRepository) {
        this.commandRepository = commandRepository;
    }

    /**
     * {@code POST  /commands} : Create a new command.
     *
     * @param command the command to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new command, or with status {@code 400 (Bad Request)} if the command has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/commands")
    public ResponseEntity<Command> createCommand(@RequestBody Command command) throws URISyntaxException {
        log.debug("REST request to save Command : {}", command);
        if (command.getId() != null) {
            throw new BadRequestAlertException("A new command cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Command result = commandRepository.save(command);
        return ResponseEntity
            .created(new URI("/api/commands/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /commands/:id} : Updates an existing command.
     *
     * @param id the id of the command to save.
     * @param command the command to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated command,
     * or with status {@code 400 (Bad Request)} if the command is not valid,
     * or with status {@code 500 (Internal Server Error)} if the command couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/commands/{id}")
    public ResponseEntity<Command> updateCommand(@PathVariable(value = "id", required = false) final Long id, @RequestBody Command command)
        throws URISyntaxException {
        log.debug("REST request to update Command : {}, {}", id, command);
        if (command.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, command.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!commandRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Command result = commandRepository.save(command);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, command.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /commands/:id} : Partial updates given fields of an existing command, field will ignore if it is null
     *
     * @param id the id of the command to save.
     * @param command the command to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated command,
     * or with status {@code 400 (Bad Request)} if the command is not valid,
     * or with status {@code 404 (Not Found)} if the command is not found,
     * or with status {@code 500 (Internal Server Error)} if the command couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/commands/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Command> partialUpdateCommand(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Command command
    ) throws URISyntaxException {
        log.debug("REST request to partial update Command partially : {}, {}", id, command);
        if (command.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, command.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!commandRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Command> result = commandRepository
            .findById(command.getId())
            .map(existingCommand -> {
                if (command.getState() != null) {
                    existingCommand.setState(command.getState());
                }
                if (command.getPurchaseDate() != null) {
                    existingCommand.setPurchaseDate(command.getPurchaseDate());
                }

                return existingCommand;
            })
            .map(commandRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, command.getId().toString())
        );
    }

    /**
     * {@code GET  /commands} : get all the commands.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of commands in body.
     */
    @GetMapping("/commands")
    public List<Command> getAllCommands() {
        log.debug("REST request to get all Commands");
        return commandRepository.findAll();
    }

    /**
     * {@code GET  /commands/:id} : get the "id" command.
     *
     * @param id the id of the command to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the command, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/commands/{id}")
    public ResponseEntity<Command> getCommand(@PathVariable Long id) {
        log.debug("REST request to get Command : {}", id);
        Optional<Command> command = commandRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(command);
    }

    /**
     * {@code DELETE  /commands/:id} : delete the "id" command.
     *
     * @param id the id of the command to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/commands/{id}")
    public ResponseEntity<Void> deleteCommand(@PathVariable Long id) {
        log.debug("REST request to delete Command : {}", id);
        commandRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
