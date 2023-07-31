package com.univ.rouen.backend.controller;

import com.univ.rouen.backend.model.Category;
import com.univ.rouen.backend.model.Product;
import com.univ.rouen.backend.model.Shop;
import com.univ.rouen.backend.repository.CategoryRepository;
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
@RequestMapping("/api/products")
public class ProductController {

    private final ProductRepository productRepository;
    private final ShopRepository shopRepository;
    private final CategoryRepository categoryRepository;

    @Autowired
    public ProductController(ProductRepository productRepository, ShopRepository shopRepository, CategoryRepository categoryRepository) {
        this.productRepository = productRepository;
        this.shopRepository = shopRepository;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllProducts(
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
        Page<Product> productPage ;

        if (!search.isEmpty()) {
            productPage = productRepository.searchByName(search, pageable);
        } else {
            productPage = productRepository.findAll(pageable);
        }

        List<Product> products = productPage.getContent();
        long totalElements = productPage.getTotalElements();
        int totalPages = productPage.getTotalPages();
        int currentPage = productPage.getNumber();
        int pageSize = productPage.getSize();

        Map<String, Object> response = new HashMap<>();
        response.put("products", products);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("currentPage", currentPage);
        pagination.put("pageSize", pageSize);
        pagination.put("totalPages", totalPages);
        pagination.put("totalElements", totalElements);

        response.put("pagination", pagination);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public Product getProductById(@PathVariable Long id) {
        return productRepository.findById(id).orElse(null);
    }

    @PostMapping()
    public ResponseEntity<?> createProduct(@RequestBody Product product) {
        if (product.getShop() != null) {
            Long shopId = product.getShop().getId();
            Shop shop = shopRepository.findById(shopId).orElse(null);

            if (shop != null) {
                product.setShop(shop);
            } else {
                return ResponseEntity.badRequest().body("Boutique non trouvée avec l'ID spécifié.");
            }
        }

        if (product.getCategories() != null) {
            List<Category> categories = new ArrayList<>();
            for (Category category : product.getCategories()) {
                Long categoryId = category.getId();
                Category existingCategory = categoryRepository.findById(categoryId).orElse(null);
                if (existingCategory != null) {
                    categories.add(existingCategory);
                } else {
                    return ResponseEntity.badRequest().body("Catégorie non trouvée avec l'ID spécifié : " + categoryId);
                }
            }
            product.setCategories(categories);
        }

        Product existingProduct = productRepository.findByName(product.getName());

        if (existingProduct != null) {
            return ResponseEntity.badRequest().body("Le nom du produit existe déjà. Veuillez en choisir un autre.");
        }

        Product savedProduct = productRepository.save(product);
        return ResponseEntity.ok(savedProduct);
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Product updatedProduct) {
        Product existingProduct = productRepository.findById(id).orElse(null);
        if (existingProduct != null) {
            if (updatedProduct.getShop() != null) {
                existingProduct.setShop(updatedProduct.getShop());
            }

            if (updatedProduct.getCategories() != null) {
                existingProduct.setCategories(updatedProduct.getCategories());
            }

            existingProduct.setName(updatedProduct.getName());
            existingProduct.setPrice(updatedProduct.getPrice());
            existingProduct.setDescription(updatedProduct.getDescription());

            return ResponseEntity.ok(productRepository.save(existingProduct));
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id) {
        Optional<Product> product = productRepository.findById(id);
        if (product.isPresent()) {
            Product deletedProduct = product.get();
            for (Category category : deletedProduct.getCategories()) {
                category.setProducts(null);
            }
            productRepository.deleteById(id);
        }
    }

    @GetMapping("/{id}/categories")
    public ResponseEntity<Map<String, Object>> getCategoriesByProductId(@PathVariable Long id,
                                                                        @RequestParam(defaultValue = "id") String sortBy,
                                                                        @RequestParam(defaultValue = "asc") String sortOrder,
                                                                        @RequestParam(defaultValue = "0") int page,
                                                                        @RequestParam(defaultValue = "5") int size,
                                                                        @RequestParam(defaultValue = "") String search) {

        Optional<Product> optionalProduct = productRepository.findById(id);
        if (optionalProduct.isPresent()) {

            Sort sort = Sort.by(sortBy);
            if ("desc".equalsIgnoreCase(sortOrder)) {
                sort = sort.descending();
            } else {
                sort = sort.ascending();
            }

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Category> categoryPage;

            if (!search.isEmpty()) {
                categoryPage = categoryRepository.searchByNameAndProducts_Id(search, id, pageable);
            } else {
                categoryPage = categoryRepository.getCategoriesByProducts_Id(id, pageable);
            }

            List<Category> categories = categoryPage.getContent();
            long totalElements = categoryPage.getTotalElements();
            int totalPages = categoryPage.getTotalPages();
            int currentPage = categoryPage.getNumber();
            int pageSize = categoryPage.getSize();

            List<Category> categoryDTOs = new ArrayList<>(categories);

            Map<String, Object> response = new HashMap<>();
            response.put("categories", categoryDTOs);

            Map<String, Object> pagination = new HashMap<>();
            pagination.put("currentPage", currentPage);
            pagination.put("pageSize", pageSize);
            pagination.put("totalPages", totalPages);
            pagination.put("totalElements", totalElements);

            response.put("pagination", pagination);

            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}
