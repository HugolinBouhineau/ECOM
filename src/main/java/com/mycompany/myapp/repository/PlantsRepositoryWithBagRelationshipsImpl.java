package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Plants;
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
public class PlantsRepositoryWithBagRelationshipsImpl implements PlantsRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Plants> fetchBagRelationships(Optional<Plants> plants) {
        return plants.map(this::fetchCategories);
    }

    @Override
    public Page<Plants> fetchBagRelationships(Page<Plants> plants) {
        return new PageImpl<>(fetchBagRelationships(plants.getContent()), plants.getPageable(), plants.getTotalElements());
    }

    @Override
    public List<Plants> fetchBagRelationships(List<Plants> plants) {
        return Optional.of(plants).map(this::fetchCategories).orElse(Collections.emptyList());
    }

    Plants fetchCategories(Plants result) {
        return entityManager
            .createQuery("select plants from Plants plants left join fetch plants.categories where plants is :plants", Plants.class)
            .setParameter("plants", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Plants> fetchCategories(List<Plants> plants) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, plants.size()).forEach(index -> order.put(plants.get(index).getId(), index));
        List<Plants> result = entityManager
            .createQuery(
                "select distinct plants from Plants plants left join fetch plants.categories where plants in :plants",
                Plants.class
            )
            .setParameter("plants", plants)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
