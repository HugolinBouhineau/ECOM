package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.CommandItem;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CommandItem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CommandItemRepository extends JpaRepository<CommandItem, Long> {}
