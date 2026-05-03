package com.responselens.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.core.env.Environment;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.annotation.PostConstruct;

@SpringBootApplication
public class BackendApplication {

	@Autowired
	private Environment env;

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@PostConstruct
	public void validateEnvironmentVariables() {
		String jwtSecret = env.getProperty("app.jwt.secret");
		String dbUrl = env.getProperty("spring.datasource.url");
		String geminiApiKey = env.getProperty("gemini.api.key");

		if (jwtSecret == null || jwtSecret.length() < 32) {
			throw new IllegalArgumentException("CRITICAL: JWT_SECRET (app.jwt.secret) is missing or too short. Must be at least 32 characters.");
		}
		if (dbUrl == null || dbUrl.isEmpty()) {
			throw new IllegalArgumentException("CRITICAL: DB_URL (spring.datasource.url) is missing.");
		}
		if (geminiApiKey == null || geminiApiKey.isEmpty()) {
			throw new IllegalArgumentException("CRITICAL: GEMINI_API_KEY (gemini.api.key) is missing.");
		}
		System.out.println("INFO: All critical environment variables are set.");
	}
}
