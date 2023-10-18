package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Plant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface PlantRepositoryWithBagRelationships {
    Optional<Plant> fetchBagRelationships(Optional<Plant> plant);

    List<Plant> fetchBagRelationships(List<Plant> plants);

    Page<Plant> fetchBagRelationships(Page<Plant> plants);
}
