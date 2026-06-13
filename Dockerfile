# Bước 1: Dùng môi trường Maven với Java 21 để biên dịch Spring Boot
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .

# CHÚ Ý: Di chuyển vào đúng thư mục backend (nơi có file pom.xml) trước khi chạy lệnh đóng gói
RUN cd backend && mvn clean package -DskipTests

# Bước 2: Dùng môi trường Java 21 JRE siêu nhẹ để chạy file app công khai
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Quét tìm file .jar bất kể cấu trúc thư mục con và copy ra thư mục gốc để chạy
COPY --from=build /app/backend/target/*.jar ./app.jar

EXPOSE 9090
ENTRYPOINT ["java", "-jar", "app.jar"]