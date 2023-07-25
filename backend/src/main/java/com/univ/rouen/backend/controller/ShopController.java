package com.univ.rouen.backend.controller;

import com.univ.rouen.backend.model.Shop;
import com.univ.rouen.backend.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/shops")
public class ShopController {
    private final ShopRepository shopRepository;

    @Autowired
    public ShopController(ShopRepository shopRepository) {
        this.shopRepository = shopRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllShops(
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Sort sort = Sort.by(sortBy);
        if ("desc".equalsIgnoreCase(sortOrder)) {
            sort = sort.descending();
        } else {
            sort = sort.ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Shop> shopPage = shopRepository.findAll(pageable);

        List<Shop> shops = shopPage.getContent();
        long totalElements = shopPage.getTotalElements();
        int totalPages = shopPage.getTotalPages();
        int currentPage = shopPage.getNumber();
        int pageSize = shopPage.getSize();

        Map<String, Object> response = new HashMap<>();
        response.put("shops", shops);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("currentPage", currentPage);
        pagination.put("pageSize", pageSize);
        pagination.put("totalPages", totalPages);
        pagination.put("totalElements", totalElements);

        response.put("pagination", pagination);

        return ResponseEntity.ok(response);
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

