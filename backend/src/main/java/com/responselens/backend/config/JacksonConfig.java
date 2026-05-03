package com.responselens.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

@Configuration
public class JacksonConfig {

    @Bean
    @Primary // Ensures this ObjectMapper is the primary one used by Spring
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule()); // Register module for Java 8 Date/Time API
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS); // Serialize dates as ISO-8601 strings
        return mapper;
    }
}
