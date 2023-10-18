package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PlantTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Plant.class);
        Plant plant1 = new Plant();
        plant1.setId(1L);
        Plant plant2 = new Plant();
        plant2.setId(plant1.getId());
        assertThat(plant1).isEqualTo(plant2);
        plant2.setId(2L);
        assertThat(plant1).isNotEqualTo(plant2);
        plant1.setId(null);
        assertThat(plant1).isNotEqualTo(plant2);
    }
}
