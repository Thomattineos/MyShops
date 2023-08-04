package com.univ.rouen.backend.controller;

import com.univ.rouen.backend.model.Category;
import com.univ.rouen.backend.model.Product;
import com.univ.rouen.backend.model.Shop;
import com.univ.rouen.backend.repository.CategoryRepository;
import com.univ.rouen.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Autowired
    public CategoryController(CategoryRepository categoryRepository, ProductRepository productRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllCategories(
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
        Page<Category> categoryPage;

        if (!search.isEmpty()) {
            categoryPage = categoryRepository.searchByName(search, pageable);
        } else {
            categoryPage = categoryRepository.findAll(pageable);
        }

        List<Category> categories = categoryPage.getContent();
        long totalElements = categoryPage.getTotalElements();
        int totalPages = categoryPage.getTotalPages();
        int currentPage = categoryPage.getNumber();
        int pageSize = categoryPage.getSize();

        Map<String, Object> response = new HashMap<>();
        response.put("categories", categories);

        Map<String, Object> pagination = new HashMap<>();
        pagination.put("currentPage", currentPage);
        pagination.put("pageSize", pageSize);
        pagination.put("totalPages", totalPages);
        pagination.put("totalElements", totalElements);

        response.put("pagination", pagination);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public Category getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Category category) {
        if (category.getProducts() != null) {
            for (Product p : category.getProducts()) {
                System.out.println(p.getName());
            }
        }
        Category existingCategory = categoryRepository.findByName(category.getName());
        if (existingCategory != null) {
            return ResponseEntity.badRequest().body("Le nom de la catégorie existe déjà. Veuillez en choisir un autre.");
        }

        if (category.getProducts() != null) {
            List<Product> products = new ArrayList<>();
            for (Product product : category.getProducts()) {
                Long productId = product.getId();
                Product existingProduct = productRepository.findById(productId).orElse(null);
                if (existingProduct != null) {
                    products.add(existingProduct);
                } else {
                    return ResponseEntity.badRequest().body("Produit non trouvé avec l'ID spécifié : " + productId);
                }
            }
            category.setProducts(products);
        }

        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(savedCategory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @RequestBody Category updatedCategory) {
        Category existingCategory = categoryRepository.findById(id).orElse(null);
        if (existingCategory != null) {
            if (updatedCategory.getProducts() != null) {
                existingCategory.setProducts(updatedCategory.getProducts());
            } else {
                existingCategory.setProducts(null);
            }

            existingCategory.setName(updatedCategory.getName());

            return ResponseEntity.ok(categoryRepository.save(existingCategory));
        }

        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isPresent()) {
            Category deletedCategory = category.get();
            for (Product product : deletedCategory.getProducts()) {
                product.setCategories(null);
            }
            categoryRepository.deleteById(id);
        }
    }

    @GetMapping("/{id}/products")
    public ResponseEntity<Map<String, Object>> getProductsByCategoryId(@PathVariable Long id,
                                                                       @RequestParam(defaultValue = "id") String sortBy,
                                                                       @RequestParam(defaultValue = "asc") String sortOrder,
                                                                       @RequestParam(defaultValue = "0") int page,
                                                                       @RequestParam(defaultValue = "5") int size,
                                                                       @RequestParam(defaultValue = "") String search) {

        Optional<Category> optionalCategory = categoryRepository.findById(id);
        if (optionalCategory.isPresent()) {

            Sort sort = Sort.by(sortBy);
            if ("desc".equalsIgnoreCase(sortOrder)) {
                sort = sort.descending();
            } else {
                sort = sort.ascending();
            }

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Product> productPage;

            if (!search.isEmpty()) {
                productPage = productRepository.searchByNameAndCategoryId(search, id, pageable);
            } else {
                productPage = productRepository.getProductsByCategories_Id(id, pageable);
            }

            List<Product> products = productPage.getContent();
            long totalElements = productPage.getTotalElements();
            int totalPages = productPage.getTotalPages();
            int currentPage = productPage.getNumber();
            int pageSize = productPage.getSize();

            List<Product> productDTOs = new ArrayList<>(products);

            Map<String, Object> response = new HashMap<>();
            response.put("products", productDTOs);

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
