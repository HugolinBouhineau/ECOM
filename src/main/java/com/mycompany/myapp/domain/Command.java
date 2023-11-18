package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mycompany.myapp.domain.enumeration.CommandState;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Command.
 */
@Entity
@Table(name = "command")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Command implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "state")
    private CommandState state;

    @Column(name = "purchase_date")
    private LocalDate purchaseDate;

    @OneToMany(mappedBy = "command")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "command", "plant" }, allowSetters = true)
    private Set<CommandItem> commandItems = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "commands", "addresses" }, allowSetters = true)
    private Customer customer;

    @ManyToOne
    @JsonIgnoreProperties(value = { "commands", "customer" }, allowSetters = true)
    private Address address;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Command id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CommandState getState() {
        return this.state;
    }

    public Command state(CommandState state) {
        this.setState(state);
        return this;
    }

    public void setState(CommandState state) {
        this.state = state;
    }

    public LocalDate getPurchaseDate() {
        return this.purchaseDate;
    }

    public Command purchaseDate(LocalDate purchaseDate) {
        this.setPurchaseDate(purchaseDate);
        return this;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public Set<CommandItem> getCommandItems() {
        return this.commandItems;
    }

    public void setCommandItems(Set<CommandItem> commandItems) {
        if (this.commandItems != null) {
            this.commandItems.forEach(i -> i.setCommand(null));
        }
        if (commandItems != null) {
            commandItems.forEach(i -> i.setCommand(this));
        }
        this.commandItems = commandItems;
    }

    public Command commandItems(Set<CommandItem> commandItems) {
        this.setCommandItems(commandItems);
        return this;
    }

    public Command addCommandItems(CommandItem commandItem) {
        this.commandItems.add(commandItem);
        commandItem.setCommand(this);
        return this;
    }

    public Command removeCommandItems(CommandItem commandItem) {
        this.commandItems.remove(commandItem);
        commandItem.setCommand(null);
        return this;
    }

    public Customer getCustomer() {
        return this.customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public Command customer(Customer customer) {
        this.setCustomer(customer);
        return this;
    }

    public Address getAddress() {
        return this.address;
    }

    public void setAddress(Address address) {
        this.address = address;
    }

    public Command address(Address address) {
        this.setAddress(address);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Command)) {
            return false;
        }
        return id != null && id.equals(((Command) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Command{" +
            "id=" + getId() +
            ", state='" + getState() + "'" +
            ", purchaseDate='" + getPurchaseDate() + "'" +
            "}";
    }
}
