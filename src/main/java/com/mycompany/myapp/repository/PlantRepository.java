package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Category;
import com.mycompany.myapp.domain.Plant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Plant entity.
 *
 * When extending this class, extend PlantRepositoryWithBagRelationships too.
 * For more information refer to https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface PlantRepository extends PlantRepositoryWithBagRelationships, JpaRepository<Plant, Long> {
    @Query("SELECT plant from Plant plant WHERE locate(lower(:name), lower(plant.name)) > 0")
    List<Plant> findPlantsByName(@Param("name") String name);

    @Query("SELECT plant FROM Plant plant left join fetch plant.categories pc where :category = pc")
    List<Plant> findPlantsByCategory(@Param("category") Category category);

    default Optional<Plant> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Plant> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Plant> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }
}
