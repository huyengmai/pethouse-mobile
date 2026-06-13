# Bước 1: Dùng Maven Java 21 để build app từ thư mục backend
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
# Chui vào thư mục backend và chạy lệnh đóng gói package
RUN cd backend && mvn clean package -DskipTests

# Bước 2: Dùng JRE Java 21 để chạy file jar
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
# Copy file .jar từ thư mục backend/target sang
COPY --from=build /app/backend/target/*.jar ./app.jar
EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]