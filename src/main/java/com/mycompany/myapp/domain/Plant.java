package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Plant.
 */
@Entity
@Table(name = "plant")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Plant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "latin_name")
    private String latinName;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private Integer price;

    @Column(name = "stock")
    private Integer stock;

    @Column(name = "image_path")
    private String imagePath;

    @OneToMany(mappedBy = "plant")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "command", "plant" }, allowSetters = true)
    private Set<CommandItem> commandItems = new HashSet<>();

    @ManyToMany
    @JoinTable(
        name = "rel_plant__categories",
        joinColumns = @JoinColumn(name = "plant_id"),
        inverseJoinColumns = @JoinColumn(name = "categories_id")
    )
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "plants" }, allowSetters = true)
    private Set<Category> categories = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Plant id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Plant name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLatinName() {
        return this.latinName;
    }

    public Plant latinName(String latinName) {
        this.setLatinName(latinName);
        return this;
    }

    public void setLatinName(String latinName) {
        this.latinName = latinName;
    }

    public String getDescription() {
        return this.description;
    }

    public Plant description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPrice() {
        return this.price;
    }

    public Plant price(Integer price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public Integer getStock() {
        return this.stock;
    }

    public Plant stock(Integer stock) {
        this.setStock(stock);
        return this;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public String getImagePath() {
        return this.imagePath;
    }

    public Plant imagePath(String imagePath) {
        this.setImagePath(imagePath);
        return this;
    }

    public void setImagePath(String imagePath) {
        this.imagePath = imagePath;
    }

    public Set<CommandItem> getCommandItems() {
        return this.commandItems;
    }

    public void setCommandItems(Set<CommandItem> commandItems) {
        if (this.commandItems != null) {
            this.commandItems.forEach(i -> i.setPlant(null));
        }
        if (commandItems != null) {
            commandItems.forEach(i -> i.setPlant(this));
        }
        this.commandItems = commandItems;
    }

    public Plant commandItems(Set<CommandItem> commandItems) {
        this.setCommandItems(commandItems);
        return this;
    }

    public Plant addCommandItems(CommandItem commandItem) {
        this.commandItems.add(commandItem);
        commandItem.setPlant(this);
        return this;
    }

    public Plant removeCommandItems(CommandItem commandItem) {
        this.commandItems.remove(commandItem);
        commandItem.setPlant(null);
        return this;
    }

    public Set<Category> getCategories() {
        return this.categories;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
    }

    public Plant categories(Set<Category> categories) {
        this.setCategories(categories);
        return this;
    }

    public Plant addCategories(Category category) {
        this.categories.add(category);
        category.getPlants().add(this);
        return this;
    }

    public Plant removeCategories(Category category) {
        this.categories.remove(category);
        category.getPlants().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Plant)) {
            return false;
        }
        return id != null && id.equals(((Plant) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Plant{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", latinName='" + getLatinName() + "'" +
            ", description='" + getDescription() + "'" +
            ", price=" + getPrice() +
            ", stock=" + getStock() +
            ", imagePath='" + getImagePath() + "'" +
            "}";
    }
}
