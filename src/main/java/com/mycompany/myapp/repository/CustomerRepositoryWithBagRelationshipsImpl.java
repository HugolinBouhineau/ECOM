package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Customer;
import org.hibernate.annotations.QueryHints;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.Optional;

public class CustomerRepositoryWithBagRelationshipsImpl implements CustomerRepositoryWithBagRelationships {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Customer> fetchBagRelationships(Optional<Customer> customer) {
        return customer.map(this::fetchAddresses);
    }

    Customer fetchAddresses(Customer result) {
        return entityManager
            .createQuery("select customer from Customer customer left join fetch customer.addresses where customer is :customer", Customer.class)
            .setParameter("customer", result)
            .setHint(QueryHints.PASS_DISTINCT_THROUGH, false)
            .getSingleResult();
    }
}
