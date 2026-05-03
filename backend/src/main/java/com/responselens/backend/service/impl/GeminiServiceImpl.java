package com.responselens.backend.service.impl;

import com.responselens.backend.exception.GeminiApiException;
import com.responselens.backend.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException; // Import for 4xx errors
import org.springframework.web.client.HttpServerErrorException; // Import for 5xx errors
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiServiceImpl implements GeminiService {

    private final RestTemplate restTemplate;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    @Override
    public String generateResponse(String promptText) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, Object> body = Map.of(
                    "contents", List.of(Map.of("parts", List.of(Map.of("text", promptText))))
            );

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

            ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(
                    geminiApiUrl + "?key=" + geminiApiKey,
                    HttpMethod.POST,
                    request,
                    new ParameterizedTypeReference<Map<String, Object>>() {}
            );

            // Check for HTTP errors from Gemini API
            if (responseEntity.getStatusCode().isError()) {
                String errorMessage = "Gemini API returned an error status: " + responseEntity.getStatusCode();
                if (responseEntity.hasBody() && responseEntity.getBody() != null) {
                    errorMessage += " - " + responseEntity.getBody().toString(); // Include raw body for debugging
                }
                throw new GeminiApiException(errorMessage, null);
            }

            return extractText(responseEntity.getBody());
        } catch (HttpClientErrorException | HttpServerErrorException ex) {
            // Catch specific HTTP client/server errors from RestTemplate
            String errorMessage = "Gemini API communication error: " + ex.getStatusCode() + " - " + ex.getStatusText();
            if (ex.getResponseBodyAsString() != null && !ex.getResponseBodyAsString().isEmpty()) {
                errorMessage += " Body: " + ex.getResponseBodyAsString();
            }
            throw new GeminiApiException(errorMessage, ex);
        } catch (GeminiApiException ex) {
            // Re-throw if it's already a GeminiApiException
            throw ex;
        } catch (Exception ex) {
            // Catch any other unexpected exceptions
            throw new GeminiApiException("Failed to generate Gemini response due to an unexpected error: " + ex.getMessage(), ex);
        }
    }

    @SuppressWarnings("unchecked")
    private String extractText(Map<String, Object> response) {
        if (response == null) {
            return "No response received from Gemini API.";
        }

        // --- FIX START: Improved error message extraction from Gemini API response ---
        if (response.containsKey("error")) {
            Map<String, Object> error = (Map<String, Object>) response.get("error");
            String errorMessage = (String) error.get("message");
            return "Gemini API Error: " + (errorMessage != null ? errorMessage : "Unknown error.");
        }
        // --- FIX END ---

        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                return "Gemini returned no candidates.";
            }
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            if (content == null) { // Add null check for content
                return "Gemini returned empty content.";
            }
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts == null || parts.isEmpty()) { // Add null check for parts
                return "Gemini returned no content parts.";
            }
            return String.valueOf(parts.get(0).get("text"));
        } catch (Exception ex) {
            return "Response received but could not parse Gemini payload. Raw response: " + response.toString();
        }
    }
}
