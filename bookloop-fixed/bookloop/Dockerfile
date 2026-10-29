FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -q -B dependency:go-offline
COPY src ./src
RUN mvn -q -B -DskipTests clean package

FROM eclipse-temurin:17-jre
WORKDIR /app
RUN useradd --system --no-create-home appuser
COPY --from=build /app/target/campus-book-exchange-0.0.1-SNAPSHOT.jar app.jar
USER appuser
EXPOSE 8080
CMD ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
