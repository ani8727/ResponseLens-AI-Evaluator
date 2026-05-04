package com.responselens.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PromptCreateRequest {
    private String promptText;
    private String category;
}