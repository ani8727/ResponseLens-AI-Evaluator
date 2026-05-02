package com.responselens.backend.dto.prompt;

import com.responselens.backend.model.enums.PromptCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PromptCreateRequest {
    @NotBlank
    private String promptText;

    @NotNull
    private PromptCategory category;
}
