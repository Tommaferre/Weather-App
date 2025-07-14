# ⛈️ WeatherApp Italia

Un'applicazione full-stack containerizzata che mostra il meteo in tempo reale delle principali città italiane con un tema temporale coinvolgente.

## 🌟 Caratteristiche

- **Frontend reattivo** con tema temporale e animazioni di fulmini
- **Backend Spring Boot** con database H2 integrato
- **API REST** per dati meteo attuali e storici
- **Grafici interattivi** con Chart.js per l'andamento delle temperature
- **Containerizzazione completa** con Docker multi-stage
- **Città supportate**: Roma, Milano, Napoli, Torino, Palermo, Genova, Bologna, Firenze, Venezia, Bari

## 🔧 Stack Tecnologico

### Backend

- **Spring Boot 3.2.0** - Framework principale
- **H2 Database** - Database in memoria
- **JPA/Hibernate** - ORM
- **Maven** - Build tool
- **Open-Meteo API** - Dati meteorologici gratuiti

### Frontend

- **HTML5** - Struttura
- **CSS3** - Stili e animazioni
- **JavaScript ES6** - Logica client-side
- **Chart.js** - Grafici interattivi

### DevOps

- **Docker** - Containerizzazione (multi-stage build)
- **Docker Compose** - Orchestrazione

## 🚀 Installazione e Avvio

### Prerequisiti

- Docker
- Docker Compose

### Avvio Rapido

**Clona il repository e avvia l'applicazione:**

```bash
docker-compose up --build
```

**Accedi all'applicazione:**

- Frontend: <http://localhost:8080>
- API: <http://localhost:8080/api/meteo?city=Milano>
- Console H2: <http://localhost:8080/h2-console>

### Build manuale dell'immagine Docker

Il progetto utilizza un **Dockerfile multi-stage** ottimizzato:

```Dockerfile
# Stage 1: Build
FROM maven:3.9-eclipse-temurin-17-alpine AS build
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:go-offline
COPY src ./src
RUN mvn clean package -DskipTests

# Stage 2: Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/weather-app-italia-1.0.0.jar app.jar
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
```

Per buildare manualmente:

```bash
docker build -t weather-app-italia .
docker run -p 8080:8080 weather-app-italia
```

### Troubleshooting Docker Desktop (Windows)

Se ricevi errori come:

```
ERROR: error during connect: Head "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/_ping": open //./pipe/dockerDesktopLinuxEngine: Impossibile trovare il file specificato.
```

- Assicurati che Docker Desktop sia avviato
- Riavvia Docker Desktop o il PC
- Verifica che Docker sia installato e aggiornato
- Controlla i permessi di amministratore

## 📡 API Endpoints

### Meteo Attuale

```
GET /api/meteo?city={nome_citta}
```

**Esempio:** `/api/meteo?city=Roma`

**Risposta:**

```json
{
  "city": "Roma",
  "temperature": 22.5,
  "weatherCode": 0,
  "timestamp": "2024-01-15T14:30:00"
}
```

### Dati Storici

```
GET /api/meteo/history?city={nome_citta}
```

**Esempio:** `/api/meteo/history?city=Milano`

### Città Supportate

```
GET /api/cities
```

**Risposta:**

```json
["Roma", "Milano", "Napoli", "Torino", "Palermo", "Genova", "Bologna", "Firenze", "Venezia", "Bari"]
```

## 🎨 Caratteristiche UI

### Tema Temporale

- **Sfondo gradiente** blu scuro che simula un cielo tempestoso
- **Animazioni di fulmini** che si attivano periodicamente
- **Effetti di glassmorphism** per un look moderno
- **Pulsanti interattivi** con animazioni hover e pulse

### Grafici Interattivi

- **Chart.js** per visualizzare l'andamento delle temperature
- **Dati degli ultimi 14 giorni** con temperature massime e minime
- **Colori vivaci** che contrastano con il tema scuro
- **Hover effects** per migliore interazione

### Responsive Design

- **Layout adattivo** per desktop, tablet e mobile
- **Grid system** per i pulsanti delle città
- **Tipografia scalabile** per tutti i dispositivi

## 🔧 Configurazione

### Variabili d'Ambiente

```properties
# Server
SERVER_PORT=8080

# Database H2
SPRING_DATASOURCE_URL=jdbc:h2:mem:weatherdb
SPRING_DATASOURCE_USERNAME=sa
SPRING_DATASOURCE_PASSWORD=password

# JPA
SPRING_JPA_HIBERNATE_DDL_AUTO=create-drop
SPRING_JPA_SHOW_SQL=true
```

### Personalizzazione

Per aggiungere nuove città, modifica la mappa `cityCoordinates` in `WeatherService.java`:

```java
put("NuovaCitta", new double[]{latitudine, longitudine});
```

## 📊 Monitoraggio

### Health Check

Il container include un health check automatico:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/api/cities"]
  interval: 30s
  timeout: 10s
  retries: 5
```

### Logs

```bash
docker-compose logs -f weather-app
```

## 🛠️ Sviluppo

### Esecuzione in Locale (senza Docker)

```bash
mvn spring-boot:run
```

### Build Manuale

```bash
mvn clean package
java -jar target/weather-app-italia-1.0.0.jar
```

### Testing

```bash
mvn test
```

## 🌐 API Open-Meteo

L'applicazione utilizza l'API gratuita di [Open-Meteo](https://open-meteo.com) per:

- Dati meteo attuali
- Previsioni storiche
- Codici meteo standardizzati

### Limiti API

- Nessuna autenticazione richiesta
- Rate limit generoso
