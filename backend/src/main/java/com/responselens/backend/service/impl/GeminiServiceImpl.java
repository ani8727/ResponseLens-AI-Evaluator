package com.responselens.backend.service.impl;

import com.responselens.backend.exception.GeminiApiException;
import com.responselens.backend.service.GeminiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
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

            ResponseEntity<Map> response = restTemplate.exchange(
                    geminiApiUrl + "?key=" + geminiApiKey,
                    HttpMethod.POST,
                    request,
                    Map.class
            );

            if (response.getStatusCode().isError()) {
                throw new GeminiApiException("Gemini API returned error: " + response.getStatusCode(), null);
            }

            return extractText(response.getBody());
        } catch (Exception ex) {
            if (ex instanceof GeminiApiException) throw (GeminiApiException) ex;
            throw new GeminiApiException("Failed to generate Gemini response: " + ex.getMessage(), ex);
        }
    }

    @SuppressWarnings("unchecked")
    private String extractText(Map<String, Object> response) {
        if (response == null) {
            return "No response received from Gemini API.";
        }

        if (response.containsKey("error")) {
            Map<String, Object> error = (Map<String, Object>) response.get("error");
            return "Gemini API Error: " + error.get("message");
        }

        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                return "Gemini returned no candidates.";
            }
            Map<String, Object> candidate = candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) candidate.get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            if (parts == null || parts.isEmpty()) {
                return "Gemini returned no content parts.";
            }
            return String.valueOf(parts.get(0).get("text"));
        } catch (Exception ex) {
            return "Response received but could not parse Gemini payload. Raw response: " + response;
        }
    }
}
