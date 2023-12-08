package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Command;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Spring Data JPA repository for the Command entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CommandRepository extends JpaRepository<Command, Long> {

    @Query("SELECT distinct command FROM Command command left JOIN fetch command.commandItems ci WHERE command.customer.id = :customerId")
    List<Command> getCommandsByCustomerId(
        @Param("customerId") Long customerId
    );

}
