package com.weatherapp.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "weather_data")
public class WeatherData {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "city")
    private String city;
    
    @Column(name = "temperature")
    private double temperature;
    
    @Column(name = "weather_code")
    private int weatherCode;
    
    @Column(name = "timestamp")
    private LocalDateTime timestamp;
    
    @Column(name = "latitude")
    private double latitude;
    
    @Column(name = "longitude")
    private double longitude;
    
    // Costruttori
    public WeatherData() {}
    
    public WeatherData(String city, double temperature, int weatherCode, 
                       LocalDateTime timestamp, double latitude, double longitude) {
        this.city = city;
        this.temperature = temperature;
        this.weatherCode = weatherCode;
        this.timestamp = timestamp;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    
    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }
    
    public int getWeatherCode() { return weatherCode; }
    public void setWeatherCode(int weatherCode) { this.weatherCode = weatherCode; }
    
    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }
    
    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }
    
    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
}