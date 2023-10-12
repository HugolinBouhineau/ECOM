package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Command;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface CommandRepositoryWithBagRelationships {
    Optional<Command> fetchBagRelationships(Optional<Command> command);

    List<Command> fetchBagRelationships(List<Command> commands);

    Page<Command> fetchBagRelationships(Page<Command> commands);
}
