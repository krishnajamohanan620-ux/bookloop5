# BookLoop – Campus Book Exchange

Spring Boot 3 + Thymeleaf + JPA. Students list books for sale/rent/exchange, shortlist books, and post book requests.

## Run locally (no database setup needed)
```
mvn spring-boot:run
```
Open http://localhost:8080 — uses in-memory H2 by default (data resets on restart).

## Use MySQL
```
DB_URL="jdbc:mysql://localhost:3306/campus_book_exchange?createDatabaseIfNotExist=true" \
DB_USER=root DB_PASSWORD=yourpassword mvn spring-boot:run
```

## Docker / Render
`docker build -t bookloop .` — the container reads `PORT`, and `DB_URL`/`DB_USER`/`DB_PASSWORD` if you set them.
