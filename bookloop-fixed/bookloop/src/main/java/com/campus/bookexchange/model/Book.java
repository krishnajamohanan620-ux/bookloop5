package com.campus.bookexchange.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

@Entity
@Table(name = "books")
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Please enter the book title.")
    @Size(max = 150)
    private String title;

    @NotBlank(message = "Please enter the author.")
    @Size(max = 120)
    private String author;

    @NotBlank(message = "Please enter the course.")
    @Size(max = 100)
    private String course;

    @NotNull(message = "Please select the semester.")
    @Min(value = 1, message = "Semester must be at least 1.")
    @Max(value = 8, message = "Semester must be 8 or less.")
    private Integer semester;

    @NotBlank(message = "Please enter your college.")
    @Size(max = 150)
    private String college;

    @NotNull(message = "Please enter a price. Use 0 for an exchange listing.")
    @DecimalMin(value = "0.0", message = "Price cannot be negative.")
    @DecimalMax(value = "100000.0", message = "Price is too high.")
    @Column(precision = 10, scale = 2)
    private BigDecimal price;

    @NotBlank(message = "Please select the book condition.")
    @Pattern(regexp = "Like New|Good|Fair", message = "Invalid book condition.")
    private String bookCondition;

    @NotBlank(message = "Please select a listing type.")
    @Pattern(regexp = "Sale|Rental|Exchange", message = "Invalid listing type.")
    private String listingType;

    @NotBlank(message = "Please enter seller contact details.")
    @Size(max = 120)
    private String sellerContact;

    public Book() {}

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }
    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }
    public String getCollege() { return college; }
    public void setCollege(String college) { this.college = college; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public String getBookCondition() { return bookCondition; }
    public void setBookCondition(String bookCondition) { this.bookCondition = bookCondition; }
    public String getListingType() { return listingType; }
    public void setListingType(String listingType) { this.listingType = listingType; }
    public String getSellerContact() { return sellerContact; }
    public void setSellerContact(String sellerContact) { this.sellerContact = sellerContact; }
}
