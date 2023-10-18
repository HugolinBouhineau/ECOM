package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Plant;
import com.mycompany.myapp.repository.PlantRepository;
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
 * Integration tests for the {@link PlantResource} REST controller.
 */
@IntegrationTest
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc
@WithMockUser
class PlantResourceIT {

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
    private PlantRepository plantRepository;

    @Mock
    private PlantRepository plantRepositoryMock;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restPlantMockMvc;

    private Plant plant;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plant createEntity(EntityManager em) {
        Plant plant = new Plant()
            .name(DEFAULT_NAME)
            .latinName(DEFAULT_LATIN_NAME)
            .description(DEFAULT_DESCRIPTION)
            .price(DEFAULT_PRICE)
            .stock(DEFAULT_STOCK)
            .imagePath(DEFAULT_IMAGE_PATH);
        return plant;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Plant createUpdatedEntity(EntityManager em) {
        Plant plant = new Plant()
            .name(UPDATED_NAME)
            .latinName(UPDATED_LATIN_NAME)
            .description(UPDATED_DESCRIPTION)
            .price(UPDATED_PRICE)
            .stock(UPDATED_STOCK)
            .imagePath(UPDATED_IMAGE_PATH);
        return plant;
    }

    @BeforeEach
    public void initTest() {
        plant = createEntity(em);
    }

    @Test
    @Transactional
    void createPlant() throws Exception {
        int databaseSizeBeforeCreate = plantRepository.findAll().size();
        // Create the Plant
        restPlantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plant)))
            .andExpect(status().isCreated());

        // Validate the Plant in the database
        List<Plant> plantList = plantRepository.findAll();
        assertThat(plantList).hasSize(databaseSizeBeforeCreate + 1);
        Plant testPlant = plantList.get(plantList.size() - 1);
        assertThat(testPlant.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testPlant.getLatinName()).isEqualTo(DEFAULT_LATIN_NAME);
        assertThat(testPlant.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testPlant.getPrice()).isEqualTo(DEFAULT_PRICE);
        assertThat(testPlant.getStock()).isEqualTo(DEFAULT_STOCK);
        assertThat(testPlant.getImagePath()).isEqualTo(DEFAULT_IMAGE_PATH);
    }

    @Test
    @Transactional
    void createPlantWithExistingId() throws Exception {
        // Create the Plant with an existing ID
        plant.setId(1L);

        int databaseSizeBeforeCreate = plantRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restPlantMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plant)))
            .andExpect(status().isBadRequest());

        // Validate the Plant in the database
        List<Plant> plantList = plantRepository.findAll();
        assertThat(plantList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllPlants() throws Exception {
        // Initialize the database
        plantRepository.saveAndFlush(plant);

        // Get all the plantList
        restPlantMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(plant.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].latinName").value(hasItem(DEFAULT_LATIN_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].price").value(hasItem(DEFAULT_PRICE)))
            .andExpect(jsonPath("$.[*].stock").value(hasItem(DEFAULT_STOCK)))
            .andExpect(jsonPath("$.[*].imagePath").value(hasItem(DEFAULT_IMAGE_PATH)));
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPlantsWithEagerRelationshipsIsEnabled() throws Exception {
        when(plantRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPlantMockMvc.perform(get(ENTITY_API_URL + "?eagerload=true")).andExpect(status().isOk());

        verify(plantRepositoryMock, times(1)).findAllWithEagerRelationships(any());
    }

    @SuppressWarnings({ "unchecked" })
    void getAllPlantsWithEagerRelationshipsIsNotEnabled() throws Exception {
        when(plantRepositoryMock.findAllWithEagerRelationships(any())).thenReturn(new PageImpl(new ArrayList<>()));

        restPlantMockMvc.perform(get(ENTITY_API_URL + "?eagerload=false")).andExpect(status().isOk());
        verify(plantRepositoryMock, times(1)).findAll(any(Pageable.class));
    }

    @Test
    @Transactional
    void getPlant() throws Exception {
        // Initialize the database
        plantRepository.saveAndFlush(plant);

        // Get the plant
        restPlantMockMvc
            .perform(get(ENTITY_API_URL_ID, plant.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(plant.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.latinName").value(DEFAULT_LATIN_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.price").value(DEFAULT_PRICE))
            .andExpect(jsonPath("$.stock").value(DEFAULT_STOCK))
            .andExpect(jsonPath("$.imagePath").value(DEFAULT_IMAGE_PATH));
    }

    @Test
    @Transactional
    void getNonExistingPlant() throws Exception {
        // Get the plant
        restPlantMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingPlant() throws Exception {
        // Initialize the database
        plantRepository.saveAndFlush(plant);

        int databaseSizeBeforeUpdate = plantRepository.findAll().size();

        // Update the plant
        Plant updatedPlant = plantRepository.findById(plant.getId()).get();
        // Disconnect from session so that the updates on updatedPlant are not directly saved in db
        em.detach(updatedPlant);
        updatedPlant
            .name(UPDATED_NAME)
            .latinName(UPDATED_LATIN_NAME)
            .description(UPDATED_DESCRIPTION)
            .price(UPDATED_PRICE)
            .stock(UPDATED_STOCK)
            .imagePath(UPDATED_IMAGE_PATH);

        restPlantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedPlant.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedPlant))
            )
            .andExpect(status().isOk());

        // Validate the Plant in the database
        List<Plant> plantList = plantRepository.findAll();
        assertThat(plantList).hasSize(databaseSizeBeforeUpdate);
        Plant testPlant = plantList.get(plantList.size() - 1);
        assertThat(testPlant.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPlant.getLatinName()).isEqualTo(UPDATED_LATIN_NAME);
        assertThat(testPlant.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPlant.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testPlant.getStock()).isEqualTo(UPDATED_STOCK);
        assertThat(testPlant.getImagePath()).isEqualTo(UPDATED_IMAGE_PATH);
    }

    @Test
    @Transactional
    void putNonExistingPlant() throws Exception {
        int databaseSizeBeforeUpdate = plantRepository.findAll().size();
        plant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, plant.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(plant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plant in the database
        List<Plant> plantList = plantRepository.findAll();
        assertThat(plantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchPlant() throws Exception {
        int databaseSizeBeforeUpdate = plantRepository.findAll().size();
        plant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(plant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plant in the database
        List<Plant> plantList = plantRepository.findAll();
        assertThat(plantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamPlant() throws Exception {
        int databaseSizeBeforeUpdate = plantRepository.findAll().size();
        plant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(plant)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Plant in the database
        List<Plant> plantList = plantRepository.findAll();
        assertThat(plantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdatePlantWithPatch() throws Exception {
        // Initialize the database
        plantRepository.saveAndFlush(plant);

        int databaseSizeBeforeUpdate = plantRepository.findAll().size();

        // Update the plant using partial update
        Plant partialUpdatedPlant = new Plant();
        partialUpdatedPlant.setId(plant.getId());

        partialUpdatedPlant.name(UPDATED_NAME).price(UPDATED_PRICE);

        restPlantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlant))
            )
            .andExpect(status().isOk());

        // Validate the Plant in the database
        List<Plant> plantList = plantRepository.findAll();
        assertThat(plantList).hasSize(databaseSizeBeforeUpdate);
        Plant testPlant = plantList.get(plantList.size() - 1);
        assertThat(testPlant.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPlant.getLatinName()).isEqualTo(DEFAULT_LATIN_NAME);
        assertThat(testPlant.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testPlant.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testPlant.getStock()).isEqualTo(DEFAULT_STOCK);
        assertThat(testPlant.getImagePath()).isEqualTo(DEFAULT_IMAGE_PATH);
    }

    @Test
    @Transactional
    void fullUpdatePlantWithPatch() throws Exception {
        // Initialize the database
        plantRepository.saveAndFlush(plant);

        int databaseSizeBeforeUpdate = plantRepository.findAll().size();

        // Update the plant using partial update
        Plant partialUpdatedPlant = new Plant();
        partialUpdatedPlant.setId(plant.getId());

        partialUpdatedPlant
            .name(UPDATED_NAME)
            .latinName(UPDATED_LATIN_NAME)
            .description(UPDATED_DESCRIPTION)
            .price(UPDATED_PRICE)
            .stock(UPDATED_STOCK)
            .imagePath(UPDATED_IMAGE_PATH);

        restPlantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedPlant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedPlant))
            )
            .andExpect(status().isOk());

        // Validate the Plant in the database
        List<Plant> plantList = plantRepository.findAll();
        assertThat(plantList).hasSize(databaseSizeBeforeUpdate);
        Plant testPlant = plantList.get(plantList.size() - 1);
        assertThat(testPlant.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testPlant.getLatinName()).isEqualTo(UPDATED_LATIN_NAME);
        assertThat(testPlant.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testPlant.getPrice()).isEqualTo(UPDATED_PRICE);
        assertThat(testPlant.getStock()).isEqualTo(UPDATED_STOCK);
        assertThat(testPlant.getImagePath()).isEqualTo(UPDATED_IMAGE_PATH);
    }

    @Test
    @Transactional
    void patchNonExistingPlant() throws Exception {
        int databaseSizeBeforeUpdate = plantRepository.findAll().size();
        plant.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restPlantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, plant.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(plant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plant in the database
        List<Plant> plantList = plantRepository.findAll();
        assertThat(plantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchPlant() throws Exception {
        int databaseSizeBeforeUpdate = plantRepository.findAll().size();
        plant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(plant))
            )
            .andExpect(status().isBadRequest());

        // Validate the Plant in the database
        List<Plant> plantList = plantRepository.findAll();
        assertThat(plantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamPlant() throws Exception {
        int databaseSizeBeforeUpdate = plantRepository.findAll().size();
        plant.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restPlantMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(plant)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Plant in the database
        List<Plant> plantList = plantRepository.findAll();
        assertThat(plantList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deletePlant() throws Exception {
        // Initialize the database
        plantRepository.saveAndFlush(plant);

        int databaseSizeBeforeDelete = plantRepository.findAll().size();

        // Delete the plant
        restPlantMockMvc
            .perform(delete(ENTITY_API_URL_ID, plant.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Plant> plantList = plantRepository.findAll();
        assertThat(plantList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
