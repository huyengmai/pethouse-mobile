# Bước 1: Dùng môi trường Maven với Java 21 để biên dịch Spring Boot
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN chmod +x ./backend/mvnw && cd backend && ./mvnw clean package -DskipTests

# Bước 2: Dùng môi trường Java 21 JRE siêu nhẹ để chạy file app công khai
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Sử dụng dấu sao * để tự động nhận diện chính xác tên file .jar được sinh ra
COPY --from=build /app/backend/target/*.jar app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]