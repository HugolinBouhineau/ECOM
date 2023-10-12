package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Plants;
import com.mycompany.myapp.repository.PlantsRepository;
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
 * Integration tests for the {@link PlantsResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PlantsResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LATIN_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LATIN_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Integer DEFAULT_PRICE = 1;
    private static final Integer UPDATED_PRICE = 2;

    private static final Integer DEFAULT_STOCK = 1;
    private static final Integer UPDATED_STOCK = 2;

    private static final String DEFAULT_IMAGE_PATH = "AAAAAAAAAA";
    private static final String UPDATED_IMAGE_PATH = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/plants";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private PlantsRepository plantsRepository;

    @Mock
    private PlantsRepository plantsRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlantsMockMvc;

    private Plants plants;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plants createEntity(EntityManager em) {
        Plants plants = new Plants()
            .name(DEFAULT_NAME)
            .latinName(DEFAULT_LATIN_NAME)
            .description(DEFAULT_DESCRIPTION)
            .price(DEFAULT_PRICE)
            .stock(DEFAULT_STOCK)
            .imagePath(DEFAULT_IMAGE_PATH);
        return plants;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plants createUpdatedEntity(EntityManager em) {
        Plants plants = new Plants()
            .name(UPDATED_NAME)
            .latinName(UPDATED_LATIN_NAME)
            .description(UPDATED_DESCRIPTION)
            .price(UPDATED_PRICE)
            .stock(UPDATED_STOCK)
            .imagePath(UPDATED_IMAGE_PATH);
        return plants;
    }

    @BeforeEach
    public void initTest() {
        plants = createEntity(em);
    }

    @Test
    @Transactional
    void createPlants() throws Exception {
        int databaseSizeBeforeCreate = plantsRepository.findAll().size();
        // Create the Plants
        restPlantsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plants)))
            .andExpect(status().isCreated());

        // Validate the Plants in the database
        List<Plants> plantsList = plantsRepository.findAll();
        assertThat(plantsList).hasSize(databaseSizeBeforeCreate + 1);
        Plants testPlants = plantsList.get(plantsList.size() - 1);
        assertThat(testPlants.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPlants.getLatinName()).isEqualTo(DEFAULT_LATIN_NAME);
        assertThat(testPlants.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testPlants.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testPlants.getStock()).isEqualTo(DEFAULT_STOCK);
        assertThat(testPlants.getImagePath()).isEqualTo(DEFAULT_IMAGE_PATH);
    }

    @Test
    @Transactional
    void createPlantsWithExistingId() throws Exception {
        // Create the Plants with an existing ID
        plants.setId(1L);

        int databaseSizeBeforeCreate = plantsRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlantsMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plants)))
            .andExpect(status().isBadRequest());

        // Validate the Plants in the database
        List<Plants> plantsList = plantsRepository.findAll();
        assertThat(plantsList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPlants() throws Exception {
        // Initialize the database
        plantsRepository.saveAndFlush(plants);

        // Get all the plantsList
        restPlantsMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(plants.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].latinName").value(hasItem(DEFAULT_LATIN_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)))
            .andExpect(jsonPath("$.[*].stock").value(hasItem(DEFAULT_STOCK)))
            .andExpect(jsonPath("$.[*].imagePath").value(hasItem(DEFAULT_IMAGE_PATH)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPlantsWithEagerRelationshipsIsEnabled() throws Exception {
        when(plantsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPlantsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(plantsRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPlantsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(plantsRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPlantsMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(plantsRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPlants() throws Exception {
        // Initialize the database
        plantsRepository.saveAndFlush(plants);

        // Get the plants
        restPlantsMockMvc
            .perform(get(ENTITY_API_URL_ID, plants.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(plants.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.latinName").value(DEFAULT_LATIN_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE))
            .andExpect(jsonPath("$.stock").value(DEFAULT_STOCK))
            .andExpect(jsonPath("$.imagePath").value(DEFAULT_IMAGE_PATH));
    }

    @Test
    @Transactional
    void getNonExistingPlants() throws Exception {
        // Get the plants
        restPlantsMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPlants() throws Exception {
        // Initialize the database
        plantsRepository.saveAndFlush(plants);

        int databaseSizeBeforeUpdate = plantsRepository.findAll().size();

        // Update the plants
        Plants updatedPlants = plantsRepository.findById(plants.getId()).get();
        // Disconnect from session so that the updates on updatedPlants are not directly saved in db
        em.detach(updatedPlants);
        updatedPlants
            .name(UPDATED_NAME)
            .latinName(UPDATED_LATIN_NAME)
            .description(UPDATED_DESCRIPTION)
            .price(UPDATED_PRICE)
            .stock(UPDATED_STOCK)
            .imagePath(UPDATED_IMAGE_PATH);

        restPlantsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPlants.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPlants))
            )
            .andExpect(status().isOk());

        // Validate the Plants in the database
        List<Plants> plantsList = plantsRepository.findAll();
        assertThat(plantsList).hasSize(databaseSizeBeforeUpdate);
        Plants testPlants = plantsList.get(plantsList.size() - 1);
        assertThat(testPlants.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPlants.getLatinName()).isEqualTo(UPDATED_LATIN_NAME);
        assertThat(testPlants.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPlants.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testPlants.getStock()).isEqualTo(UPDATED_STOCK);
        assertThat(testPlants.getImagePath()).isEqualTo(UPDATED_IMAGE_PATH);
    }

    @Test
    @Transactional
    void putNonExistingPlants() throws Exception {
        int databaseSizeBeforeUpdate = plantsRepository.findAll().size();
        plants.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlantsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, plants.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(plants))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plants in the database
        List<Plants> plantsList = plantsRepository.findAll();
        assertThat(plantsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlants() throws Exception {
        int databaseSizeBeforeUpdate = plantsRepository.findAll().size();
        plants.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantsMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(plants))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plants in the database
        List<Plants> plantsList = plantsRepository.findAll();
        assertThat(plantsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlants() throws Exception {
        int databaseSizeBeforeUpdate = plantsRepository.findAll().size();
        plants.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantsMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plants)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Plants in the database
        List<Plants> plantsList = plantsRepository.findAll();
        assertThat(plantsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlantsWithPatch() throws Exception {
        // Initialize the database
        plantsRepository.saveAndFlush(plants);

        int databaseSizeBeforeUpdate = plantsRepository.findAll().size();

        // Update the plants using partial update
        Plants partialUpdatedPlants = new Plants();
        partialUpdatedPlants.setId(plants.getId());

        partialUpdatedPlants.name(UPDATED_NAME).description(UPDATED_DESCRIPTION).price(UPDATED_PRICE);

        restPlantsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlants.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlants))
            )
            .andExpect(status().isOk());

        // Validate the Plants in the database
        List<Plants> plantsList = plantsRepository.findAll();
        assertThat(plantsList).hasSize(databaseSizeBeforeUpdate);
        Plants testPlants = plantsList.get(plantsList.size() - 1);
        assertThat(testPlants.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPlants.getLatinName()).isEqualTo(DEFAULT_LATIN_NAME);
        assertThat(testPlants.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPlants.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testPlants.getStock()).isEqualTo(DEFAULT_STOCK);
        assertThat(testPlants.getImagePath()).isEqualTo(DEFAULT_IMAGE_PATH);
    }

    @Test
    @Transactional
    void fullUpdatePlantsWithPatch() throws Exception {
        // Initialize the database
        plantsRepository.saveAndFlush(plants);

        int databaseSizeBeforeUpdate = plantsRepository.findAll().size();

        // Update the plants using partial update
        Plants partialUpdatedPlants = new Plants();
        partialUpdatedPlants.setId(plants.getId());

        partialUpdatedPlants
            .name(UPDATED_NAME)
            .latinName(UPDATED_LATIN_NAME)
            .description(UPDATED_DESCRIPTION)
            .price(UPDATED_PRICE)
            .stock(UPDATED_STOCK)
            .imagePath(UPDATED_IMAGE_PATH);

        restPlantsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlants.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlants))
            )
            .andExpect(status().isOk());

        // Validate the Plants in the database
        List<Plants> plantsList = plantsRepository.findAll();
        assertThat(plantsList).hasSize(databaseSizeBeforeUpdate);
        Plants testPlants = plantsList.get(plantsList.size() - 1);
        assertThat(testPlants.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPlants.getLatinName()).isEqualTo(UPDATED_LATIN_NAME);
        assertThat(testPlants.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPlants.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testPlants.getStock()).isEqualTo(UPDATED_STOCK);
        assertThat(testPlants.getImagePath()).isEqualTo(UPDATED_IMAGE_PATH);
    }

    @Test
    @Transactional
    void patchNonExistingPlants() throws Exception {
        int databaseSizeBeforeUpdate = plantsRepository.findAll().size();
        plants.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlantsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, plants.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(plants))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plants in the database
        List<Plants> plantsList = plantsRepository.findAll();
        assertThat(plantsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlants() throws Exception {
        int databaseSizeBeforeUpdate = plantsRepository.findAll().size();
        plants.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantsMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(plants))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plants in the database
        List<Plants> plantsList = plantsRepository.findAll();
        assertThat(plantsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlants() throws Exception {
        int databaseSizeBeforeUpdate = plantsRepository.findAll().size();
        plants.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantsMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(plants)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Plants in the database
        List<Plants> plantsList = plantsRepository.findAll();
        assertThat(plantsList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlants() throws Exception {
        // Initialize the database
        plantsRepository.saveAndFlush(plants);

        int databaseSizeBeforeDelete = plantsRepository.findAll().size();

        // Delete the plants
        restPlantsMockMvc
            .perform(delete(ENTITY_API_URL_ID, plants.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Plants> plantsList = plantsRepository.findAll();
        assertThat(plantsList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
