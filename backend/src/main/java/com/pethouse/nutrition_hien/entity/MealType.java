// File: backend/src/main/java/com/pethouse/nutrition_hien/entity/MealType.java

package com.pethouse.nutrition_hien.entity;

public enum MealType {
    BREAKFAST("Bữa sáng"),
    LUNCH("Bữa trưa"),
    DINNER("Bữa tối"),
    SNACK("Bữa phụ");

    private final String displayName;

    MealType(String displayName) {
        this.displayName = displayName;
    }

    public String getDisplayName() {
        return displayName;
    }
}