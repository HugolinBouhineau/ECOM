package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.CommandItem;
import com.mycompany.myapp.repository.CommandItemRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link CommandItemResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CommandItemResourceIT {

    private static final Integer DEFAULT_QUANTITY = 1;
    private static final Integer UPDATED_QUANTITY = 2;

    private static final String ENTITY_API_URL = "/api/command-items";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private CommandItemRepository commandItemRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restCommandItemMockMvc;

    private CommandItem commandItem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CommandItem createEntity(EntityManager em) {
        CommandItem commandItem = new CommandItem().quantity(DEFAULT_QUANTITY);
        return commandItem;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static CommandItem createUpdatedEntity(EntityManager em) {
        CommandItem commandItem = new CommandItem().quantity(UPDATED_QUANTITY);
        return commandItem;
    }

    @BeforeEach
    public void initTest() {
        commandItem = createEntity(em);
    }

    @Test
    @Transactional
    void createCommandItem() throws Exception {
        int databaseSizeBeforeCreate = commandItemRepository.findAll().size();
        // Create the CommandItem
        restCommandItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commandItem)))
            .andExpect(status().isCreated());

        // Validate the CommandItem in the database
        List<CommandItem> commandItemList = commandItemRepository.findAll();
        assertThat(commandItemList).hasSize(databaseSizeBeforeCreate + 1);
        CommandItem testCommandItem = commandItemList.get(commandItemList.size() - 1);
        assertThat(testCommandItem.getQuantity()).isEqualTo(DEFAULT_QUANTITY);
    }

    @Test
    @Transactional
    void createCommandItemWithExistingId() throws Exception {
        // Create the CommandItem with an existing ID
        commandItem.setId(1L);

        int databaseSizeBeforeCreate = commandItemRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCommandItemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commandItem)))
            .andExpect(status().isBadRequest());

        // Validate the CommandItem in the database
        List<CommandItem> commandItemList = commandItemRepository.findAll();
        assertThat(commandItemList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllCommandItems() throws Exception {
        // Initialize the database
        commandItemRepository.saveAndFlush(commandItem);

        // Get all the commandItemList
        restCommandItemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(commandItem.getId().intValue())))
            .andExpect(jsonPath("$.[*].quantity").value(hasItem(DEFAULT_QUANTITY)));
    }

    @Test
    @Transactional
    void getCommandItem() throws Exception {
        // Initialize the database
        commandItemRepository.saveAndFlush(commandItem);

        // Get the commandItem
        restCommandItemMockMvc
            .perform(get(ENTITY_API_URL_ID, commandItem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(commandItem.getId().intValue()))
            .andExpect(jsonPath("$.quantity").value(DEFAULT_QUANTITY));
    }

    @Test
    @Transactional
    void getNonExistingCommandItem() throws Exception {
        // Get the commandItem
        restCommandItemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingCommandItem() throws Exception {
        // Initialize the database
        commandItemRepository.saveAndFlush(commandItem);

        int databaseSizeBeforeUpdate = commandItemRepository.findAll().size();

        // Update the commandItem
        CommandItem updatedCommandItem = commandItemRepository.findById(commandItem.getId()).get();
        // Disconnect from session so that the updates on updatedCommandItem are not directly saved in db
        em.detach(updatedCommandItem);
        updatedCommandItem.quantity(UPDATED_QUANTITY);

        restCommandItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCommandItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCommandItem))
            )
            .andExpect(status().isOk());

        // Validate the CommandItem in the database
        List<CommandItem> commandItemList = commandItemRepository.findAll();
        assertThat(commandItemList).hasSize(databaseSizeBeforeUpdate);
        CommandItem testCommandItem = commandItemList.get(commandItemList.size() - 1);
        assertThat(testCommandItem.getQuantity()).isEqualTo(UPDATED_QUANTITY);
    }

    @Test
    @Transactional
    void putNonExistingCommandItem() throws Exception {
        int databaseSizeBeforeUpdate = commandItemRepository.findAll().size();
        commandItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommandItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, commandItem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commandItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the CommandItem in the database
        List<CommandItem> commandItemList = commandItemRepository.findAll();
        assertThat(commandItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchCommandItem() throws Exception {
        int databaseSizeBeforeUpdate = commandItemRepository.findAll().size();
        commandItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommandItemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(commandItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the CommandItem in the database
        List<CommandItem> commandItemList = commandItemRepository.findAll();
        assertThat(commandItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamCommandItem() throws Exception {
        int databaseSizeBeforeUpdate = commandItemRepository.findAll().size();
        commandItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommandItemMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(commandItem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the CommandItem in the database
        List<CommandItem> commandItemList = commandItemRepository.findAll();
        assertThat(commandItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateCommandItemWithPatch() throws Exception {
        // Initialize the database
        commandItemRepository.saveAndFlush(commandItem);

        int databaseSizeBeforeUpdate = commandItemRepository.findAll().size();

        // Update the commandItem using partial update
        CommandItem partialUpdatedCommandItem = new CommandItem();
        partialUpdatedCommandItem.setId(commandItem.getId());

        partialUpdatedCommandItem.quantity(UPDATED_QUANTITY);

        restCommandItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommandItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommandItem))
            )
            .andExpect(status().isOk());

        // Validate the CommandItem in the database
        List<CommandItem> commandItemList = commandItemRepository.findAll();
        assertThat(commandItemList).hasSize(databaseSizeBeforeUpdate);
        CommandItem testCommandItem = commandItemList.get(commandItemList.size() - 1);
        assertThat(testCommandItem.getQuantity()).isEqualTo(UPDATED_QUANTITY);
    }

    @Test
    @Transactional
    void fullUpdateCommandItemWithPatch() throws Exception {
        // Initialize the database
        commandItemRepository.saveAndFlush(commandItem);

        int databaseSizeBeforeUpdate = commandItemRepository.findAll().size();

        // Update the commandItem using partial update
        CommandItem partialUpdatedCommandItem = new CommandItem();
        partialUpdatedCommandItem.setId(commandItem.getId());

        partialUpdatedCommandItem.quantity(UPDATED_QUANTITY);

        restCommandItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCommandItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCommandItem))
            )
            .andExpect(status().isOk());

        // Validate the CommandItem in the database
        List<CommandItem> commandItemList = commandItemRepository.findAll();
        assertThat(commandItemList).hasSize(databaseSizeBeforeUpdate);
        CommandItem testCommandItem = commandItemList.get(commandItemList.size() - 1);
        assertThat(testCommandItem.getQuantity()).isEqualTo(UPDATED_QUANTITY);
    }

    @Test
    @Transactional
    void patchNonExistingCommandItem() throws Exception {
        int databaseSizeBeforeUpdate = commandItemRepository.findAll().size();
        commandItem.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCommandItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, commandItem.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(commandItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the CommandItem in the database
        List<CommandItem> commandItemList = commandItemRepository.findAll();
        assertThat(commandItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchCommandItem() throws Exception {
        int databaseSizeBeforeUpdate = commandItemRepository.findAll().size();
        commandItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommandItemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(commandItem))
            )
            .andExpect(status().isBadRequest());

        // Validate the CommandItem in the database
        List<CommandItem> commandItemList = commandItemRepository.findAll();
        assertThat(commandItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamCommandItem() throws Exception {
        int databaseSizeBeforeUpdate = commandItemRepository.findAll().size();
        commandItem.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCommandItemMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(commandItem))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the CommandItem in the database
        List<CommandItem> commandItemList = commandItemRepository.findAll();
        assertThat(commandItemList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteCommandItem() throws Exception {
        // Initialize the database
        commandItemRepository.saveAndFlush(commandItem);

        int databaseSizeBeforeDelete = commandItemRepository.findAll().size();

        // Delete the commandItem
        restCommandItemMockMvc
            .perform(delete(ENTITY_API_URL_ID, commandItem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<CommandItem> commandItemList = commandItemRepository.findAll();
        assertThat(commandItemList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
