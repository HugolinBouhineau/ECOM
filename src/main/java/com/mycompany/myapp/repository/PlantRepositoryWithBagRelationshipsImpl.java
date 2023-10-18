package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Plant;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import org.hibernate.annotations.QueryHints;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class PlantRepositoryWithBagRelationshipsImpl implements PlantRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Plant> fetchBagRelationships(Optional<Plant> plant) {
        return plant.map(this::fetchCategories);
    }

    @Override
    public Page<Plant> fetchBagRelationships(Page<Plant> plants) {
        return new PageImpl<>(fetchBagRelationships(plants.getContent()), plants.getPageable(), plants.getTotalElements());
    }

    @Override
    public List<Plant> fetchBagRelationships(List<Plant> plants) {
        return Optional.of(plants).map(this::fetchCategories).orElse(Collections.emptyList());
    }

    Plant fetchCategories(Plant result) {
        return entityManager
            .createQuery("select plant from Plant plant left join fetch plant.categories where plant is :plant", Plant.class)
            .setParameter("plant", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Plant> fetchCategories(List<Plant> plants) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, plants.size()).forEach(index -> order.put(plants.get(index).getId(), index));
        List<Plant> result = entityManager
            .createQuery("select distinct plant from Plant plant left join fetch plant.categories where plant in :plants", Plant.class)
            .setParameter("plants", plants)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
