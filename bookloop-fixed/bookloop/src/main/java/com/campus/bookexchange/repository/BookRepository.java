package com.campus.bookexchange.repository;

import com.campus.bookexchange.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    // title and course are never null (empty string = "no filter"); semester may be null.
    @Query("SELECT b FROM Book b WHERE " +
           "LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%')) AND " +
           "(:course = '' OR LOWER(b.course) = LOWER(:course)) AND " +
           "(:semester IS NULL OR b.semester = :semester) " +
           "ORDER BY b.id DESC")
    List<Book> searchBooks(@Param("title") String title,
                           @Param("course") String course,
                           @Param("semester") Integer semester);
}
