# Bước 1: Biên dịch Spring Boot ngay tại thư mục hiện tại (đã là backend)
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Bước 2: Chạy file app
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY --from=build /app/target/*.jar ./app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]