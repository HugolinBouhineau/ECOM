package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Plants;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface PlantsRepositoryWithBagRelationships {
    Optional<Plants> fetchBagRelationships(Optional<Plants> plants);

    List<Plants> fetchBagRelationships(List<Plants> plants);

    Page<Plants> fetchBagRelationships(Page<Plants> plants);
}
