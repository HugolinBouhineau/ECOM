package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Category;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Category entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    @Query("SELECT DISTINCT category from Category category WHERE category.id IN ?1")
    List<Category> getCategoriesByListId(List<Long> categoriesId);
}
