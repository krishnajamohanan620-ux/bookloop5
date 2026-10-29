package com.campus.bookexchange.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "book_requests")
public class BookRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Please enter the book title.")
    @Size(max = 150)
    private String title;

    @NotBlank(message = "Please enter your course.")
    @Size(max = 100)
    private String course;

    @NotNull(message = "Please select the semester.")
    @Min(value = 1, message = "Semester must be at least 1.")
    @Max(value = 8, message = "Semester must be 8 or less.")
    private Integer semester;

    @NotBlank(message = "Please enter your college.")
    @Size(max = 150)
    private String college;

    @NotBlank(message = "Please enter your contact details.")
    @Size(max = 120)
    private String contact;

    public BookRequest() {}

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }
    public String getContact() { return contact; }
    public void setContact(String contact) { this.contact = contact; }
}
