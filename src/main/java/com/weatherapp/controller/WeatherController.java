package com.weatherapp.controller;

import com.weatherapp.model.WeatherData;
import com.weatherapp.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class WeatherController {
    
    @Autowired
    private WeatherService weatherService;
    
    @GetMapping("/meteo")
    public ResponseEntity<Map<String, Object>> getCurrentWeather(@RequestParam String city) {
        try {
            Map<String, Object> weather = weatherService.getCurrentWeather(city);
            return ResponseEntity.ok(weather);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/meteo/history")
    public ResponseEntity<Map<String, Object>> getHistoricalWeather(@RequestParam String city) {
        try {
            Map<String, Object> history = weatherService.getHistoricalWeather(city);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
    
    @GetMapping("/meteo/stored-history")
    public ResponseEntity<List<WeatherData>> getStoredHistory(
            @RequestParam String city, 
            @RequestParam(defaultValue = "14") int days) {
        try {
            List<WeatherData> history = weatherService.getWeatherHistory(city, days);
            return ResponseEntity.ok(history);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @GetMapping("/cities")
    public ResponseEntity<List<String>> getSupportedCities() {
        return ResponseEntity.ok(weatherService.getSupportedCities());
    }
}