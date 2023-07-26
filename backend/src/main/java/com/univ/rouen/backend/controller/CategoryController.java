package com.univ.rouen.backend.controller;

import com.univ.rouen.backend.model.Category;
import com.univ.rouen.backend.model.Product;
import com.univ.rouen.backend.model.Shop;
import com.univ.rouen.backend.repository.CategoryRepository;
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
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryRepository categoryRepository;

    @Autowired
    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
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
        Category existingCategory = categoryRepository.findByName(category.getName());
        if (existingCategory != null) {
            return ResponseEntity.badRequest().body("Le nom de la catégorie existe déjà. Veuillez en choisir un autre.");
        }

        Category savedCategory = categoryRepository.save(category);
        return ResponseEntity.ok(savedCategory);
    }
    @PutMapping("/{id}")
    public Category updateCategory(@PathVariable Long id, @RequestBody Category updatedCategory) {
        Category existingCategory = categoryRepository.findById(id).orElse(null);
        if (existingCategory != null) {
            existingCategory.setName(updatedCategory.getName());

            return categoryRepository.save(existingCategory);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
    }
}
