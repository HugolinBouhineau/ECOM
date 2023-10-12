package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Command;
import com.mycompany.myapp.domain.enumeration.CommandState;
import com.mycompany.myapp.repository.CommandRepository;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CommandResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class CommandResourceIT {

    private static final String DEFAULT_ADDRESS = "AAAAAAAAAA";
    private static final String UPDATED_ADDRESS = "BBBBBBBBBB";

    private static final CommandState DEFAULT_STATE = CommandState.InProgress;
    private static final CommandState UPDATED_STATE = CommandState.Completed;

    private static final LocalDate DEFAULT_PURCHASE_DATE = LocalDate.ofEpochDay(0L);
    private static final LocalDate UPDATED_PURCHASE_DATE = LocalDate.now(ZoneId.systemDefault());

    private static final String ENTITY_API_URL = "/api/commands";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CommandRepository commandRepository;

    @Mock
    private CommandRepository commandRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCommandMockMvc;

    private Command command;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Command createEntity(EntityManager em) {
        Command command = new Command().address(DEFAULT_ADDRESS).state(DEFAULT_STATE).purchaseDate(DEFAULT_PURCHASE_DATE);
        return command;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Command createUpdatedEntity(EntityManager em) {
        Command command = new Command().address(UPDATED_ADDRESS).state(UPDATED_STATE).purchaseDate(UPDATED_PURCHASE_DATE);
        return command;
    }

    @BeforeEach
    public void initTest() {
        command = createEntity(em);
    }

    @Test
    @Transactional
    void createCommand() throws Exception {
        int databaseSizeBeforeCreate = commandRepository.findAll().size();
        // Create the Command
        restCommandMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(command)))
            .andExpect(status().isCreated());

        // Validate the Command in the database
        List<Command> commandList = commandRepository.findAll();
        assertThat(commandList).hasSize(databaseSizeBeforeCreate + 1);
        Command testCommand = commandList.get(commandList.size() - 1);
        assertThat(testCommand.getAddress()).isEqualTo(DEFAULT_ADDRESS);
        assertThat(testCommand.getState()).isEqualTo(DEFAULT_STATE);
        assertThat(testCommand.getPurchaseDate()).isEqualTo(DEFAULT_PURCHASE_DATE);
    }

    @Test
    @Transactional
    void createCommandWithExistingId() throws Exception {
        // Create the Command with an existing ID
        command.setId(1L);

        int databaseSizeBeforeCreate = commandRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCommandMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(command)))
            .andExpect(status().isBadRequest());

        // Validate the Command in the database
        List<Command> commandList = commandRepository.findAll();
        assertThat(commandList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCommands() throws Exception {
        // Initialize the database
        commandRepository.saveAndFlush(command);

        // Get all the commandList
        restCommandMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(command.getId().intValue())))
            .andExpect(jsonPath("$.[*].address").value(hasItem(DEFAULT_ADDRESS)))
            .andExpect(jsonPath("$.[*].state").value(hasItem(DEFAULT_STATE.toString())))
            .andExpect(jsonPath("$.[*].purchaseDate").value(hasItem(DEFAULT_PURCHASE_DATE.toString())));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCommandsWithEagerRelationshipsIsEnabled() throws Exception {
        when(commandRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCommandMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(commandRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllCommandsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(commandRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restCommandMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(commandRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getCommand() throws Exception {
        // Initialize the database
        commandRepository.saveAndFlush(command);

        // Get the command
        restCommandMockMvc
            .perform(get(ENTITY_API_URL_ID, command.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(command.getId().intValue()))
            .andExpect(jsonPath("$.address").value(DEFAULT_ADDRESS))
            .andExpect(jsonPath("$.state").value(DEFAULT_STATE.toString()))
            .andExpect(jsonPath("$.purchaseDate").value(DEFAULT_PURCHASE_DATE.toString()));
    }

    @Test
    @Transactional
    void getNonExistingCommand() throws Exception {
        // Get the command
        restCommandMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCommand() throws Exception {
        // Initialize the database
        commandRepository.saveAndFlush(command);

        int databaseSizeBeforeUpdate = commandRepository.findAll().size();

        // Update the command
        Command updatedCommand = commandRepository.findById(command.getId()).get();
        // Disconnect from session so that the updates on updatedCommand are not directly saved in db
        em.detach(updatedCommand);
        updatedCommand.address(UPDATED_ADDRESS).state(UPDATED_STATE).purchaseDate(UPDATED_PURCHASE_DATE);

        restCommandMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCommand.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCommand))
            )
            .andExpect(status().isOk());

        // Validate the Command in the database
        List<Command> commandList = commandRepository.findAll();
        assertThat(commandList).hasSize(databaseSizeBeforeUpdate);
        Command testCommand = commandList.get(commandList.size() - 1);
        assertThat(testCommand.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testCommand.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testCommand.getPurchaseDate()).isEqualTo(UPDATED_PURCHASE_DATE);
    }

    @Test
    @Transactional
    void putNonExistingCommand() throws Exception {
        int databaseSizeBeforeUpdate = commandRepository.findAll().size();
        command.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommandMockMvc
            .perform(
                put(ENTITY_API_URL_ID, command.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(command))
            )
            .andExpect(status().isBadRequest());

        // Validate the Command in the database
        List<Command> commandList = commandRepository.findAll();
        assertThat(commandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCommand() throws Exception {
        int databaseSizeBeforeUpdate = commandRepository.findAll().size();
        command.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommandMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(command))
            )
            .andExpect(status().isBadRequest());

        // Validate the Command in the database
        List<Command> commandList = commandRepository.findAll();
        assertThat(commandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCommand() throws Exception {
        int databaseSizeBeforeUpdate = commandRepository.findAll().size();
        command.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommandMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(command)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Command in the database
        List<Command> commandList = commandRepository.findAll();
        assertThat(commandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCommandWithPatch() throws Exception {
        // Initialize the database
        commandRepository.saveAndFlush(command);

        int databaseSizeBeforeUpdate = commandRepository.findAll().size();

        // Update the command using partial update
        Command partialUpdatedCommand = new Command();
        partialUpdatedCommand.setId(command.getId());

        partialUpdatedCommand.address(UPDATED_ADDRESS).state(UPDATED_STATE);

        restCommandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommand.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommand))
            )
            .andExpect(status().isOk());

        // Validate the Command in the database
        List<Command> commandList = commandRepository.findAll();
        assertThat(commandList).hasSize(databaseSizeBeforeUpdate);
        Command testCommand = commandList.get(commandList.size() - 1);
        assertThat(testCommand.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testCommand.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testCommand.getPurchaseDate()).isEqualTo(DEFAULT_PURCHASE_DATE);
    }

    @Test
    @Transactional
    void fullUpdateCommandWithPatch() throws Exception {
        // Initialize the database
        commandRepository.saveAndFlush(command);

        int databaseSizeBeforeUpdate = commandRepository.findAll().size();

        // Update the command using partial update
        Command partialUpdatedCommand = new Command();
        partialUpdatedCommand.setId(command.getId());

        partialUpdatedCommand.address(UPDATED_ADDRESS).state(UPDATED_STATE).purchaseDate(UPDATED_PURCHASE_DATE);

        restCommandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommand.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommand))
            )
            .andExpect(status().isOk());

        // Validate the Command in the database
        List<Command> commandList = commandRepository.findAll();
        assertThat(commandList).hasSize(databaseSizeBeforeUpdate);
        Command testCommand = commandList.get(commandList.size() - 1);
        assertThat(testCommand.getAddress()).isEqualTo(UPDATED_ADDRESS);
        assertThat(testCommand.getState()).isEqualTo(UPDATED_STATE);
        assertThat(testCommand.getPurchaseDate()).isEqualTo(UPDATED_PURCHASE_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingCommand() throws Exception {
        int databaseSizeBeforeUpdate = commandRepository.findAll().size();
        command.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, command.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(command))
            )
            .andExpect(status().isBadRequest());

        // Validate the Command in the database
        List<Command> commandList = commandRepository.findAll();
        assertThat(commandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCommand() throws Exception {
        int databaseSizeBeforeUpdate = commandRepository.findAll().size();
        command.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommandMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(command))
            )
            .andExpect(status().isBadRequest());

        // Validate the Command in the database
        List<Command> commandList = commandRepository.findAll();
        assertThat(commandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCommand() throws Exception {
        int databaseSizeBeforeUpdate = commandRepository.findAll().size();
        command.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommandMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(command)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Command in the database
        List<Command> commandList = commandRepository.findAll();
        assertThat(commandList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCommand() throws Exception {
        // Initialize the database
        commandRepository.saveAndFlush(command);

        int databaseSizeBeforeDelete = commandRepository.findAll().size();

        // Delete the command
        restCommandMockMvc
            .perform(delete(ENTITY_API_URL_ID, command.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Command> commandList = commandRepository.findAll();
        assertThat(commandList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
