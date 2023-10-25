package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Customer;
import com.mycompany.myapp.domain.User;
import com.mycompany.myapp.repository.CustomerRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing customers.
 */
@Service
@Transactional
public class CustomerService {

    private final Logger log = LoggerFactory.getLogger(CustomerService.class);

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public Customer registerCustomer(User user) {
        Customer customer = new Customer();
        customer.setId(user.getId());
        customer.setUser(user);
        customerRepository.save(customer);
        log.debug("Created Information for Customer: {}", customer);
        return customer;
    }
}
