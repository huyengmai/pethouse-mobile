# Bước 1: Dùng môi trường Maven để biên dịch Spring Boot
   FROM maven:3.9.6-eclipse-temurin-17 AS build
   WORKDIR /app
   COPY . .
   RUN chmod +x ./backend/mvnw && cd backend && ./mvnw clean package -DskipTests

   # Bước 2: Dùng môi trường Java 17 siêu nhẹ để chạy file app
   FROM eclipse-temurin:17-jre-jammy
   WORKDIR /app
   COPY --from=build /app/backend/target/pethouse-0.0.1-SNAPSHOT.jar app.jar
   EXPOSE 9090
   ENTRYPOINT ["java", "-jar", "app.jar"]