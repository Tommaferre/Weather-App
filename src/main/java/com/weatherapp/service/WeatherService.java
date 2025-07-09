package com.weatherapp.service;

import com.weatherapp.model.WeatherData;
import com.weatherapp.repository.WeatherRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class WeatherService {
    
    @Autowired
    private WeatherRepository weatherRepository;
    
    private final RestTemplate restTemplate = new RestTemplate();
    
    // Coordinate delle principali città italiane
    private final Map<String, double[]> cityCoordinates = new HashMap<String, double[]>() {{
        put("Roma", new double[]{41.9028, 12.4964});
        put("Milano", new double[]{45.4642, 9.1900});
        put("Napoli", new double[]{40.8518, 14.2681});
        put("Torino", new double[]{45.0703, 7.6869});
        put("Palermo", new double[]{38.1157, 13.3615});
        put("Genova", new double[]{44.4056, 8.9463});
        put("Bologna", new double[]{44.4949, 11.3426});
        put("Firenze", new double[]{43.7696, 11.2558});
        put("Venezia", new double[]{45.4408, 12.3155});
        put("Bari", new double[]{41.1171, 16.8719});
    }};
    
    public Map<String, Object> getCurrentWeather(String city) {
        try {
            double[] coords = cityCoordinates.get(city);
            if (coords == null) {
                throw new IllegalArgumentException("Città non supportata: " + city);
            }
            
            String url = String.format(
                "https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f&current_weather=true&timezone=Europe/Rome",
                coords[0], coords[1]
            );
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            if (response != null && response.containsKey("current_weather")) {
                @SuppressWarnings("unchecked")
                Map<String, Object> currentWeather = (Map<String, Object>) response.get("current_weather");
                
                // Salva nel database
                WeatherData weatherData = new WeatherData(
                    city,
                    ((Number) currentWeather.get("temperature")).doubleValue(),
                    ((Number) currentWeather.get("weathercode")).intValue(),
                    LocalDateTime.now(),
                    coords[0],
                    coords[1]
                );
                weatherRepository.save(weatherData);
                
                Map<String, Object> result = new HashMap<>();
                result.put("city", city);
                result.put("temperature", currentWeather.get("temperature"));
                result.put("weatherCode", currentWeather.get("weathercode"));
                result.put("timestamp", LocalDateTime.now());
                
                return result;
            }
            
            throw new RuntimeException("Impossibile ottenere i dati meteo");
            
        } catch (Exception e) {
            throw new RuntimeException("Errore nel recupero dati meteo: " + e.getMessage());
        }
    }
    
    public List<WeatherData> getWeatherHistory(String city, int days) {
        LocalDateTime startDate = LocalDateTime.now().minusDays(days);
        return weatherRepository.findByCityAndTimestampAfter(city, startDate);
    }
    
    public Map<String, Object> getHistoricalWeather(String city) {
        try {
            double[] coords = cityCoordinates.get(city);
            if (coords == null) {
                throw new IllegalArgumentException("Città non supportata: " + city);
            }
            
            String url = String.format(
                "https://api.open-meteo.com/v1/forecast?latitude=%.4f&longitude=%.4f&daily=temperature_2m_max,temperature_2m_min&timezone=Europe/Rome&past_days=14",
                coords[0], coords[1]
            );
            
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            
            Map<String, Object> result = new HashMap<>();
            result.put("city", city);
            result.put("data", response);
            
            return result;
            
        } catch (Exception e) {
            throw new RuntimeException("Errore nel recupero dati storici: " + e.getMessage());
        }
    }
    
    public List<String> getSupportedCities() {
        return List.copyOf(cityCoordinates.keySet());
    }
}