package com.univ.rouen.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "shop")
public class Shop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String openingHours;

    @Column(nullable = false)
    private String closingHours;

    @Column(nullable = false)
    private boolean available;

    @Column(nullable = false)
    private LocalDate creationDate;

    @OneToMany(mappedBy = "shop")
    @JsonIgnore
    private List<Product> products = new ArrayList<>();

    public Shop() {
        this.creationDate = LocalDate.now();
    }

    public Shop(String name, String openingHours, String closingHours, boolean available) {
        this.name = name;
        this.openingHours = openingHours;
        this.closingHours = closingHours;
        this.available = available;
        this.creationDate = LocalDate.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOpeningHours() {
        return openingHours;
    }

    public void setOpeningHours(String openingHours) {
        this.openingHours = openingHours;
    }

    public String getClosingHours() {
        return closingHours;
    }

    public void setClosingHours(String closingHours) {
        this.closingHours = closingHours;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public LocalDate getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    public List<Product> getProducts() {
        return products;
    }

    public void addProduct(Product product) {
        this.products.add(product);
        product.setShop(this);
    }

    public void removeProduct(Product product) {
        this.products.remove(product);
        product.setShop(null);
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }
}

