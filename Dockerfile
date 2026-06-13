# Bước 1: Dùng môi trường Maven với Java 21 để biên dịch Spring Boot
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .

# Thay vì dùng ./mvnw, ta dùng thẳng lệnh "mvn" của hệ thống Docker để đóng gói
RUN mvn clean package -DskipTests

# Bước 2: Dùng môi trường Java 21 JRE siêu nhẹ để chạy file app công khai
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Tự động quét tìm file .jar bất kể cấu trúc thư mục gốc ra sao
COPY --from=build /app/**/target/*.jar ./app.jar

EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]