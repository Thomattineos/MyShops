package com.univ.rouen.backend.controller;

import com.univ.rouen.backend.model.Shop;
import com.univ.rouen.backend.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/shops")
public class ShopController {
    private final ShopRepository shopRepository;

    @Autowired
    public ShopController(ShopRepository shopRepository) {
        this.shopRepository = shopRepository;
    }

    @GetMapping
    public List<Shop> getAllShops() {
        return shopRepository.findAll();
    }

    @GetMapping("/{id}")
    public Shop getShopById(@PathVariable Long id) {
        return shopRepository.findById(id).orElse(null);
    }

    @PostMapping
    public Shop createShop(@RequestBody Shop shop) {
        return shopRepository.save(shop);
    }

    @PutMapping("/{id}")
    public Shop updateShop(@PathVariable Long id, @RequestBody Shop updatedShop) {
        Shop existingShop = shopRepository.findById(id).orElse(null);
        if (existingShop != null) {
            // Update the fields you want to change in existingShop
            existingShop.setName(updatedShop.getName());
            existingShop.setOpeningHours(updatedShop.getOpeningHours());
            existingShop.setClosingHours(updatedShop.getClosingHours());
            existingShop.setAvailable(updatedShop.isAvailable());

            return shopRepository.save(existingShop);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteShop(@PathVariable Long id) {
        shopRepository.deleteById(id);
    }
}

