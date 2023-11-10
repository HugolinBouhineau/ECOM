package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Customer;

import java.util.Optional;

public interface CustomerRepositoryWithBagRelationships {
    Optional<Customer> fetchBagRelationships(Optional<Customer> customer);
}
