package com.responselens.backend.exception;

import com.responselens.backend.util.ApiResponse;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidation(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        for (FieldError error : ex.getBindingResult().getFieldErrors()) {
            errors.put(error.getField(), error.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(ApiResponse.<Map<String, String>>builder()
                .timestamp(LocalDateTime.now())
                .status(HttpStatus.BAD_REQUEST.value())
                .message("Validation failed")
                .data(errors)
                .build());
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiResponse<String>> handleNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(build(ex.getMessage(), HttpStatus.NOT_FOUND));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<String>> handleBadRequest(BadRequestException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(build(ex.getMessage(), HttpStatus.BAD_REQUEST));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<String>> handleAccessDenied(AccessDeniedException ex) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(build(ex.getMessage(), HttpStatus.FORBIDDEN));
    }

    @ExceptionHandler({AuthenticationException.class, JwtException.class})
    public ResponseEntity<ApiResponse<String>> handleUnauthorized(Exception ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(build("Unauthorized or Invalid Token: " + ex.getMessage(), HttpStatus.UNAUTHORIZED));
    }

    @ExceptionHandler(GeminiApiException.class)
    public ResponseEntity<ApiResponse<String>> handleGeminiApi(GeminiApiException ex) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(build("Gemini AI error: " + ex.getMessage(), HttpStatus.SERVICE_UNAVAILABLE));
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiResponse<String>> handleMessageNotReadable(HttpMessageNotReadableException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(build("Malformed JSON request: " + ex.getMostSpecificCause().getMessage(), HttpStatus.BAD_REQUEST));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<String>> handleGeneric(Exception ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.<String>builder()
                        .timestamp(LocalDateTime.now())
                        .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                        .message("Unexpected error at path: " + request.getRequestURI())
                        .data(ex.getMessage())
                        .build());
    }

    private ApiResponse<String> build(String message, HttpStatus status) {
        return ApiResponse.<String>builder()
                .timestamp(LocalDateTime.now())
                .status(status.value())
                .message(message)
                .data(null)
                .build();
    }
}
