-- Migration: Thêm user_id vào meal_plan table
-- File: src/main/resources/db/migration/V9__Add_UserId_To_MealPlan.sql

-- Thêm cột user_id vào meal_plan
ALTER TABLE meal_plan 
ADD COLUMN user_id BIGINT;

-- Thêm foreign key constraint
ALTER TABLE meal_plan 
ADD CONSTRAINT fk_meal_plan_user 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Tạo index để tăng tốc query
CREATE INDEX idx_meal_plan_user_id ON meal_plan(user_id);

-- Tạo index composite cho user_id và pet_id (query phổ biến)
CREATE INDEX idx_meal_plan_user_pet ON meal_plan(user_id, pet_id);

-- Tạo index composite cho user_id và plan_date
CREATE INDEX idx_meal_plan_user_date ON meal_plan(user_id, plan_date);

-- Comment
COMMENT ON COLUMN meal_plan.user_id IS 'ID of user who owns this meal plan';
