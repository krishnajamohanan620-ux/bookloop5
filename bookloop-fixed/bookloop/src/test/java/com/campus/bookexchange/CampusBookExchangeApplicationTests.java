package com.campus.bookexchange;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.redirectedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CampusBookExchangeApplicationTests {

    @Autowired
    private MockMvc mvc;

    @Test
    void homeShowsSeedBooks() throws Exception {
        mvc.perform(get("/")).andExpect(status().isOk())
           .andExpect(content().string(org.hamcrest.Matchers.containsString("Operating System Concepts")));
    }

    @Test
    void searchFiltersByCourseAndSemester() throws Exception {
        mvc.perform(get("/").param("course", "ECE").param("semester", "2")).andExpect(status().isOk())
           .andExpect(content().string(org.hamcrest.Matchers.containsString("Engineering Mathematics")))
           .andExpect(content().string(org.hamcrest.Matchers.not(org.hamcrest.Matchers.containsString("Operating System Concepts"))));
    }

    @Test
    void sellFormRejectsInvalidListingType() throws Exception {
        mvc.perform(post("/sell").param("title", "X").param("author", "Y").param("course", "CSE")
                .param("semester", "1").param("college", "Z").param("price", "10")
                .param("bookCondition", "Good").param("listingType", "Hacked").param("sellerContact", "a@b.c"))
           .andExpect(status().isOk());
    }

    @Test
    void validSellRedirectsHome() throws Exception {
        mvc.perform(post("/sell").param("title", "Test Book").param("author", "Y").param("course", "CSE")
                .param("semester", "1").param("college", "Z").param("price", "10")
                .param("bookCondition", "Good").param("listingType", "Sale").param("sellerContact", "a@b.c"))
           .andExpect(redirectedUrl("/"));
    }

    @Test
    void requestsPageLoads() throws Exception {
        mvc.perform(get("/requests")).andExpect(status().isOk());
        mvc.perform(get("/need-book")).andExpect(status().isOk());
        mvc.perform(get("/cart")).andExpect(status().isOk());
        mvc.perform(get("/sell")).andExpect(status().isOk());
    }
}
