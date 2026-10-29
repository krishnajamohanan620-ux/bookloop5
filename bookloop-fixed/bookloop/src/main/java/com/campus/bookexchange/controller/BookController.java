package com.campus.bookexchange.controller;

import com.campus.bookexchange.model.Book;
import com.campus.bookexchange.service.BookService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Controller
public class BookController {
    private static final String CART = "cart";

    private final BookService bookService;

    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // Stop users from sending their own "id" (that would overwrite someone else's listing).
    @InitBinder("book")
    public void initBinder(WebDataBinder binder) {
        binder.setDisallowedFields("id");
    }

    @GetMapping("/")
    public String home(@RequestParam(required = false) String title,
                       @RequestParam(required = false) String course,
                       @RequestParam(required = false) Integer semester,
                       Model model) {
        model.addAttribute("books", bookService.search(title, course, semester));
        model.addAttribute("title", title == null ? "" : title);
        model.addAttribute("selectedCourse", course == null ? "" : course);
        model.addAttribute("selectedSemester", semester); // Integer or null
        return "index";
    }

    @GetMapping("/sell")
    public String showSellForm(Model model) {
        model.addAttribute("book", new Book());
        return "sell-book";
    }

    @PostMapping("/sell")
    public String sellBook(@Valid @ModelAttribute("book") Book book,
                           BindingResult result,
                           RedirectAttributes redirectAttributes) {
        boolean isExchange = "Exchange".equals(book.getListingType());
        if (!result.hasFieldErrors("price") && !result.hasFieldErrors("listingType")
                && book.getPrice() != null && !isExchange
                && book.getPrice().compareTo(BigDecimal.ZERO) <= 0) {
            result.rejectValue("price", "price.required", "Sale and rental listings need a price above 0.");
        }
        if (result.hasErrors()) {
            return "sell-book";
        }
        if (isExchange) {
            book.setPrice(BigDecimal.ZERO);
        }
        bookService.save(book);
        redirectAttributes.addFlashAttribute("successMessage", "Your book listing was published!");
        return "redirect:/";
    }

    @PostMapping("/cart/add/{id}")
    public String addToCart(@PathVariable Long id, HttpSession session,
                            RedirectAttributes redirectAttributes) {
        if (bookService.findById(id).isEmpty()) {
            redirectAttributes.addFlashAttribute("errorMessage", "That book could not be found.");
            return "redirect:/";
        }
        Set<Long> cart = getCart(session);
        cart.add(id);
        session.setAttribute(CART, cart);
        redirectAttributes.addFlashAttribute("successMessage", "Book added to your selected books.");
        return "redirect:/";
    }

    @GetMapping("/cart")
    public String showCart(HttpSession session, Model model) {
        List<Book> cartBooks = new ArrayList<>();
        for (Long id : getCart(session)) {
            bookService.findById(id).ifPresent(cartBooks::add);
        }
        model.addAttribute("cartBooks", cartBooks);
        return "cart";
    }

    @PostMapping("/cart/remove/{id}")
    public String removeFromCart(@PathVariable Long id, HttpSession session) {
        Set<Long> cart = getCart(session);
        cart.remove(id);
        session.setAttribute(CART, cart);
        return "redirect:/cart";
    }

    @SuppressWarnings("unchecked")
    private Set<Long> getCart(HttpSession session) {
        Object value = session.getAttribute(CART);
        return value instanceof Set ? (Set<Long>) value : new LinkedHashSet<>();
    }
}
