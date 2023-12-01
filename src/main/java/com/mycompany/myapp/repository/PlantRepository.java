package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Category;
import com.mycompany.myapp.domain.Plant;
import java.util.List;
import java.util.Optional;
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

    // With Pagination
    @Query("SELECT plant FROM Plant plant")
    Page<Plant> findAllWithPagination(Pageable pageable);

    @Query("SELECT DISTINCT plant FROM Plant plant JOIN plant.categories WHERE locate(replace(lower(:name), ' ', ''), replace(lower(plant.name), ' ', '')) > 0")
    Page<Plant> findPlantsByNameWithPagination(@Param("name") String name, Pageable page);

    @Query(value = "SELECT plant FROM Plant plant JOIN plant.categories pc WHERE locate(replace(lower(:name), ' ', ''), replace(lower(plant.name), ' ', '')) > 0 AND pc IN (:category) GROUP BY plant HAVING COUNT(plant) = :size")
    Page<Plant> findPlantsByCategoriesWithPagination (
        @Param("name") String name,
        @Param("category") List<Category> category,
        @Param("size") Long size,
        Pageable page
    );

    @Query(value = "SELECT MAX(plant.price) FROM Plant plant")
    Integer findMaxPrice();

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
