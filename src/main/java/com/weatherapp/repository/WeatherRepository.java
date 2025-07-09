package com.weatherapp.repository;

import com.weatherapp.model.WeatherData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface WeatherRepository extends JpaRepository<WeatherData, Long> {
    
    @Query("SELECT w FROM WeatherData w WHERE w.city = :city AND w.timestamp >= :startDate ORDER BY w.timestamp DESC")
    List<WeatherData> findByCityAndTimestampAfter(@Param("city") String city, 
                                                   @Param("startDate") LocalDateTime startDate);
    
    @Query("SELECT w FROM WeatherData w WHERE w.city = :city ORDER BY w.timestamp DESC")
    List<WeatherData> findByCityOrderByTimestampDesc(@Param("city") String city);
    
    WeatherData findFirstByCityOrderByTimestampDesc(String city);
}