package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Customer;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Customer entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CustomerRepository extends CustomerRepositoryWithBagRelationships, JpaRepository<Customer, Long> {
    @Query("SELECT customer from Customer customer WHERE customer.user.login = :login")
    Optional<Customer> findCustomerByLogin(@Param("login") Optional<String> login);

    default Optional<Customer> findOneWithEagerRelationships(Optional<String> currentLogin) {
        return this.fetchBagRelationships(this.findCustomerByLogin(currentLogin));
    }
}
