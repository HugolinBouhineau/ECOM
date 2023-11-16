package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Address;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the Address entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AddressRepository extends JpaRepository<Address, Long> {

    @Query("SELECT address FROM Address address WHERE address.customer.id = :customer_id")
    Optional<List<Address>> findByCustomerId(@Param("customer_id") Long id);
}
