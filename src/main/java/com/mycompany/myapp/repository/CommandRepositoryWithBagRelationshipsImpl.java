package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Command;
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
public class CommandRepositoryWithBagRelationshipsImpl implements CommandRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Command> fetchBagRelationships(Optional<Command> command) {
        return command.map(this::fetchPlants);
    }

    @Override
    public Page<Command> fetchBagRelationships(Page<Command> commands) {
        return new PageImpl<>(fetchBagRelationships(commands.getContent()), commands.getPageable(), commands.getTotalElements());
    }

    @Override
    public List<Command> fetchBagRelationships(List<Command> commands) {
        return Optional.of(commands).map(this::fetchPlants).orElse(Collections.emptyList());
    }

    Command fetchPlants(Command result) {
        return entityManager
            .createQuery("select command from Command command left join fetch command.plants where command is :command", Command.class)
            .setParameter("command", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }

    List<Command> fetchPlants(List<Command> commands) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, commands.size()).forEach(index -> order.put(commands.get(index).getId(), index));
        List<Command> result = entityManager
            .createQuery(
                "select distinct command from Command command left join fetch command.plants where command in :commands",
                Command.class
            )
            .setParameter("commands", commands)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
