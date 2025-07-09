# Usa OpenJDK 17 come base
FROM openjdk:17-jdk-slim

# Crea directory di lavoro
WORKDIR /app

# Copia i file Maven
COPY pom.xml .
COPY src ./src

# Installa Maven
RUN apt-get update && apt-get install -y maven

# Compila l'applicazione
RUN mvn clean package -DskipTests

# Espone la porta 8080
EXPOSE 8080

# Comando per avviare l'applicazione
CMD ["java", "-jar", "target/weather-app-italia-1.0.0.jar"]