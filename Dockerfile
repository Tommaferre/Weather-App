# Stage 1: Build stage
FROM maven:3.9-eclipse-temurin-17-alpine AS build

# Imposta la directory di lavoro
WORKDIR /app

# Copia solo il file pom.xml per sfruttare la cache di Maven
COPY pom.xml .

# Scarica le dipendenze (verranno messe in cache se il pom.xml non cambia)
RUN mvn dependency:go-offline

# Copia il codice sorgente
COPY src ./src

# Compila l'applicazione e crea il JAR
RUN mvn clean package -DskipTests

# Stage 2: Runtime stage
FROM eclipse-temurin:17-jre-alpine

# Imposta la directory di lavoro
WORKDIR /app

# Copia solo il JAR compilato dallo stage di build
COPY --from=build /app/target/weather-app-italia-1.0.0.jar app.jar

# Espone la porta 8080
EXPOSE 8080

# Comando per avviare l'applicazione
CMD ["java", "-jar", "app.jar"]