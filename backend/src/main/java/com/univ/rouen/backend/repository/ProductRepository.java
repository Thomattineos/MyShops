package com.univ.rouen.backend.repository;

import com.univ.rouen.backend.model.Category;
import com.univ.rouen.backend.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Product> searchByName(String search, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) AND p.shop.id = :shopId")
    Page<Product> searchByNameAndShopId(@Param("search") String search, @Param("shopId") Long shopId, Pageable pageable);

    Product findByName(String name);

    List<Product> findByShopId(Long id);

    Page<Product> getProductsByShopId(Long id, Pageable pageable);

    @Query("SELECT p FROM Product p JOIN p.categories c WHERE c.id = :categoryId AND LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))")
    Page<Product> searchByNameAndCategoryId(@Param("search") String search, @Param("categoryId") Long categoryId, Pageable pageable);

    Page<Product> getProductsByCategories_Id(Long id, Pageable pageable);

    @Query("SELECT p FROM Product p JOIN p.categories c WHERE c.name IN :filters")
    Page<Product> filterByCategoryName(@Param("filters") List<String> filters, Pageable pageable);

}
