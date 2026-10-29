package com.campus.bookexchange.controller;

import com.campus.bookexchange.model.BookRequest;
import com.campus.bookexchange.service.BookRequestService;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class BookRequestController {
    private final BookRequestService requestService;

    public BookRequestController(BookRequestService requestService) {
        this.requestService = requestService;
    }

    @GetMapping("/need-book")
    public String showRequestForm(Model model) {
        model.addAttribute("bookRequest", new BookRequest());
        return "need-book";
    }

    @PostMapping("/need-book")
    public String submitRequest(@Valid @ModelAttribute("bookRequest") BookRequest bookRequest,
                                BindingResult result,
                                RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "need-book";
        }
        requestService.save(bookRequest);
        redirectAttributes.addFlashAttribute("successMessage",
                "Your book request was saved. Sellers can now see it on the Requests page.");
        return "redirect:/need-book";
    }

    @GetMapping("/requests")
    public String listRequests(Model model) {
        model.addAttribute("requests", requestService.findAll());
        return "requests";
    }
}
