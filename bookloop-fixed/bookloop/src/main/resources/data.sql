INSERT INTO books (title, author, course, semester, college, price, book_condition, listing_type, seller_contact)
SELECT 'Java: The Complete Reference', 'Herbert Schildt', 'CSE', 3, 'Campus Demo College', 350.00, 'Good', 'Sale', 'demo-cse@example.com'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Java: The Complete Reference');
INSERT INTO books (title, author, course, semester, college, price, book_condition, listing_type, seller_contact)
SELECT 'Operating System Concepts', 'Silberschatz, Galvin and Gagne', 'CSE', 4, 'Campus Demo College', 420.00, 'Like New', 'Sale', 'demo-cse@example.com'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Operating System Concepts');
INSERT INTO books (title, author, course, semester, college, price, book_condition, listing_type, seller_contact)
SELECT 'Engineering Mathematics', 'B. S. Grewal', 'ECE', 2, 'Campus Demo College', 250.00, 'Fair', 'Rental', 'demo-ece@example.com'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Engineering Mathematics');
INSERT INTO books (title, author, course, semester, college, price, book_condition, listing_type, seller_contact)
SELECT 'Data Structures Using C', 'Reema Thareja', 'CSE', 3, 'Campus Demo College', 0.00, 'Good', 'Exchange', 'demo-cse@example.com'
FROM DUAL WHERE NOT EXISTS (SELECT 1 FROM books WHERE title = 'Data Structures Using C');
