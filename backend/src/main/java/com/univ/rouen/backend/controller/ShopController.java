package com.univ.rouen.backend.controller;

import com.univ.rouen.backend.model.Category;
import com.univ.rouen.backend.model.Product;
import com.univ.rouen.backend.model.Shop;
import com.univ.rouen.backend.repository.ProductRepository;
import com.univ.rouen.backend.repository.ShopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/shops")
public class ShopController {
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;

    @Autowired
    public ShopController(ShopRepository shopRepository, ProductRepository productRepository) {
        this.shopRepository = shopRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllShops(
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(defaultValue = "") String search
    ) {
        Sort sort = Sort.by(sortBy);
        if ("desc".equalsIgnoreCase(sortOrder)) {
            sort = sort.descending();
        } else {
            sort = sort.ascending();
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Shop> shopPage;

        if (!search.isEmpty()) {
            shopPage = shopRepository.searchByName(search, pageable);
        } else {
            shopPage = shopRepository.findAll(pageable);
        }

        List<Shop> shops = shopPage.getContent();
        long totalElements = shopPage.getTotalElements();
        int totalPages = shopPage.getTotalPages();
        int currentPage = shopPage.getNumber();
        int pageSize = shopPage.getSize();

        for (Shop shop : shops) {
            List<Product> products = productRepository.findByShopId(shop.getId());
            shop.setProducts(products);
        }

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
    public ResponseEntity<Shop> getShopById(@PathVariable Long id) {
        Optional<Shop> optionalShop = shopRepository.findById(id);
        if (optionalShop.isPresent()) {
            Shop shop = optionalShop.get();
            List<Product> products = productRepository.findByShopId(id);
            shop.setProducts(products);
            return ResponseEntity.ok(shop);
        } else {
            return ResponseEntity.notFound().build();
        }
    }


    @PostMapping
    public ResponseEntity<?> createShop(@RequestBody Shop shop) {
        Shop existingShop = shopRepository.findByName(shop.getName());
        if (existingShop != null) {
            return ResponseEntity.badRequest().body("Le nom de la boutique existe déjà. Veuillez en choisir un autre.");
        }

        String openingTimeStr = shop.getOpeningHours();
        String closingTimeStr = shop.getClosingHours();

        if (isValidTimeFormat(openingTimeStr) || isValidTimeFormat(closingTimeStr)) {
            return ResponseEntity.badRequest().body("Les horaires doivent respecter le format 'HH:MM'");
        }

        int openingTime = parseTime(openingTimeStr);
        int closingTime = parseTime(closingTimeStr);

        if (openingTime >= closingTime) {
            return ResponseEntity.badRequest().body("L'horaire d'ouverture doit être inférieur à l'horaire de fermeture");
        }

        Shop savedShop = shopRepository.save(shop);
        return ResponseEntity.ok(savedShop);
    }

    private boolean isValidTimeFormat(String timeStr) {
        String timeFormatPattern = "^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$";
        return !timeStr.matches(timeFormatPattern);
    }

    private int parseTime(String timeStr) {
        String[] timeParts = timeStr.split(":");
        int hours = Integer.parseInt(timeParts[0]);
        int minutes = Integer.parseInt(timeParts[1]);
        return hours * 60 + minutes;
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateShop(@PathVariable Long id, @RequestBody Shop updatedShop) {
        Shop existingShop = shopRepository.findById(id).orElse(null);
        if (existingShop != null) {

            existingShop.setName(updatedShop.getName());
            existingShop.setOpeningHours(updatedShop.getOpeningHours());
            existingShop.setClosingHours(updatedShop.getClosingHours());
            existingShop.setAvailable(updatedShop.isAvailable());

            for (Product product : updatedShop.getProducts()) {
                product.setShop(existingShop);
                productRepository.save(product);
            }

            return ResponseEntity.ok(shopRepository.save(existingShop));
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public void deleteShop(@PathVariable Long id) {
        Optional<Shop> shop = shopRepository.findById(id);
        if (shop.isPresent()) {
            Shop deletedShop = shop.get();
            for (Product product : deletedShop.getProducts()) {
                product.setShop(null);
            }
            shopRepository.deleteById(id);
        }
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<Map<String, Object>> getProductsByShopId(@PathVariable Long id,
                                                                   @RequestParam(defaultValue = "id") String sortBy,
                                                                   @RequestParam(defaultValue = "asc") String sortOrder,
                                                                   @RequestParam(defaultValue = "0") int page,
                                                                   @RequestParam(defaultValue = "5") int size,
                                                                   @RequestParam(defaultValue = "") String search) {

        Optional<Shop> optionalShop = shopRepository.findById(id);
        if (optionalShop.isPresent()) {

            Sort sort = Sort.by(sortBy);
            if ("desc".equalsIgnoreCase(sortOrder)) {
                sort = sort.descending();
            } else {
                sort = sort.ascending();
            }

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Product> productPage;

            if (!search.isEmpty()) {
                productPage = productRepository.searchByNameAndShopId(search, id, pageable);
            } else {
                productPage = productRepository.getProductsByShopId(id, pageable);
            }

            List<Product> products = productPage.getContent();
            long totalElements = productPage.getTotalElements();
            int totalPages = productPage.getTotalPages();
            int currentPage = productPage.getNumber();
            int pageSize = productPage.getSize();

            List<Product> productDTOs = new ArrayList<>(products);

            Set<Long> distinctCategories = new HashSet<>();
            for (Product product : products) {
                for (Category category : product.getCategories()) {
                    distinctCategories.add(category.getId());
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("products", productDTOs);

            Map<String, Object> pagination = new HashMap<>();
            pagination.put("currentPage", currentPage);
            pagination.put("pageSize", pageSize);
            pagination.put("totalPages", totalPages);
            pagination.put("totalElements", totalElements);

            response.put("pagination", pagination);

            // Add the numberOfCategories to the response
            response.put("numberOfCategories", distinctCategories.size());

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

