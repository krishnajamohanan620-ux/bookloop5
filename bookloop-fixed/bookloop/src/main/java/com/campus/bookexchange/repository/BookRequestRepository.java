package com.campus.bookexchange.repository;

import com.campus.bookexchange.model.BookRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRequestRepository extends JpaRepository<BookRequest, Long> {
    List<BookRequest> findAllByOrderByIdDesc();
}
