package com.univ.rouen.backend.repository;

import com.univ.rouen.backend.model.Category;
import com.univ.rouen.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM Category c WHERE LOWER(c.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Category> searchByName(String search, Pageable pageable);

    Category findByName(String name);
}
