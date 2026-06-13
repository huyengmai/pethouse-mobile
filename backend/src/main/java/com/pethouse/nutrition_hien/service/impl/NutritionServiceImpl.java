package com.pethouse.nutrition_hien.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.pethouse.common.config.SecurityUtils;
import com.pethouse.common.exception.ForbiddenException;
import com.pethouse.common.exception.ResourceNotFoundException;
import com.pethouse.nutrition_hien.dto.mapper.FoodItemMapper;
import com.pethouse.nutrition_hien.dto.mapper.MealMapper;
import com.pethouse.nutrition_hien.dto.mapper.MealPlanMapper;
import com.pethouse.nutrition_hien.dto.mapper.NutritionRecommendationMapper;
import com.pethouse.nutrition_hien.dto.request.AddFoodItemRequest;
import com.pethouse.nutrition_hien.dto.request.AddMealRequest;
import com.pethouse.nutrition_hien.dto.request.CreateMealPlanRequest;
import com.pethouse.nutrition_hien.dto.request.GetRecommendationRequest;
import com.pethouse.nutrition_hien.dto.request.UpdateMealPlanRequest;
import com.pethouse.nutrition_hien.dto.request.UpdateMealRequest;
import com.pethouse.nutrition_hien.dto.response.DailyNutritionSummaryResponse;
import com.pethouse.nutrition_hien.dto.response.FoodItemResponse;
import com.pethouse.nutrition_hien.dto.response.MealPlanResponse;
import com.pethouse.nutrition_hien.dto.response.MealResponse;
import com.pethouse.nutrition_hien.dto.response.NutritionRecommendationResponse;
import com.pethouse.nutrition_hien.dto.response.WeeklySummaryResponse;
import com.pethouse.nutrition_hien.entity.FoodItem;
import com.pethouse.nutrition_hien.entity.Meal;
import com.pethouse.nutrition_hien.entity.MealType;
import com.pethouse.nutrition_hien.entity.MealPlan;
import com.pethouse.nutrition_hien.entity.NutritionRecommendation;
import com.pethouse.nutrition_hien.repository.FoodItemRepository;
import com.pethouse.nutrition_hien.repository.MealPlanRepository;
import com.pethouse.nutrition_hien.repository.MealRepository;
import com.pethouse.nutrition_hien.repository.NutritionRecommendationRepository;
import com.pethouse.nutrition_hien.service.NutritionService;
import com.pethouse.profile_hoa.dto.PetDTO;
import com.pethouse.profile_hoa.service.ProfileService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class NutritionServiceImpl implements NutritionService {
    
    private final MealPlanRepository mealPlanRepository;
    private final MealRepository mealRepository;
    private final FoodItemRepository foodItemRepository;
    private final NutritionRecommendationRepository recommendationRepository;
    
    private final MealPlanMapper mealPlanMapper;
    private final MealMapper mealMapper;
    private final FoodItemMapper foodItemMapper;
    private final NutritionRecommendationMapper recommendationMapper;
    
    private final SecurityUtils securityUtils;
    private final ProfileService profileService;
    
    // ========== MEAL PLAN ==========
    
    /**
     * Tạo meal plan - USER chỉ tạo cho pet của mình
     */
    @Override
    public MealPlanResponse createMealPlan(CreateMealPlanRequest request) {
        Long currentUserId = securityUtils.getCurrentUserId();
        
        // Kiểm tra pet có thuộc về user này không
        checkPetOwnership(request.getPetId(), currentUserId);
        
        // Kiểm tra xem đã có meal plan cho ngày này chưa
        if (mealPlanRepository.existsByPetIdAndPlanDate(request.getPetId(), request.getPlanDate())) {
            throw new RuntimeException("Meal plan already exists for this date");
        }
        
        MealPlan mealPlan = new MealPlan();
        mealPlan.setPetId(request.getPetId());
        mealPlan.setUserId(currentUserId);
        mealPlan.setPlanDate(request.getPlanDate());
        mealPlan.setNotes(request.getNotes());
        mealPlan.setTotalCalories(BigDecimal.ZERO);
        
        MealPlan saved = mealPlanRepository.save(mealPlan);
        log.info("User {} created meal plan for pet {}", currentUserId, request.getPetId());
        
        return mealPlanMapper.toResponse(saved);
    }
    
    /**
     * Lấy meal plan theo ID
     * USER chỉ xem được meal plan của pet mình
     * ADMIN xem được tất cả
     */
    @Override
    @Transactional(readOnly = true)
    public MealPlanResponse getMealPlanById(Long id) {
        MealPlan mealPlan = mealPlanRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Meal plan not found with id: " + id));
        
        // Kiểm tra quyền truy cập
        checkMealPlanAccess(mealPlan);
        
        return mealPlanMapper.toResponse(mealPlan);
    }
    
    @Override
    @Transactional
    public MealPlanResponse getMealPlanByPetAndDate(Long petId, LocalDate date) {

        Long currentUserId = securityUtils.getCurrentUserId();
        checkPetOwnership(petId, currentUserId);

        MealPlan mealPlan = mealPlanRepository
                .findByUserIdAndPetIdAndPlanDate(currentUserId, petId, date)
                .orElseGet(() -> {

                    // 1️⃣ Tạo meal plan mới
                    MealPlan newPlan = new MealPlan();
                    newPlan.setPetId(petId);
                    newPlan.setUserId(currentUserId);
                    newPlan.setPlanDate(date);
                    newPlan.setNotes("Auto generated meal plan");
                    newPlan.setTotalCalories(BigDecimal.ZERO);

                    MealPlan savedPlan = mealPlanRepository.save(newPlan);

                    // 2️⃣ Tạo meals mặc định
                    createDefaultMeals(savedPlan);

                    log.info("Auto-created meal plan for pet {} on {}", petId, date);
                    return savedPlan;
                });

        return mealPlanMapper.toResponse(mealPlan);
    }

    
    /**
     * Lấy tất cả meal plans của một pet
     * USER chỉ xem được meal plan của pet mình
     */
    @Override
    @Transactional(readOnly = true)
    public List<MealPlanResponse> getAllMealPlansByPet(Long petId) {
        Long currentUserId = securityUtils.getCurrentUserId();
        
        // Kiểm tra quyền truy cập pet
        checkPetOwnership(petId, currentUserId);
        
        List<MealPlan> mealPlans = mealPlanRepository.findByPetIdOrderByPlanDateDesc(petId);
        return mealPlans.stream()
            .map(mealPlanMapper::toResponseWithoutMeals)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<MealPlanResponse> getMealPlansByDateRange(Long petId, LocalDate startDate, LocalDate endDate) {
        Long currentUserId = securityUtils.getCurrentUserId();
        
        // Kiểm tra quyền truy cập pet
        checkPetOwnership(petId, currentUserId);
        
        List<MealPlan> mealPlans = mealPlanRepository.findByPetIdAndDateRange(petId, startDate, endDate);
        return mealPlans.stream()
            .map(mealPlanMapper::toResponse)
            .collect(Collectors.toList());
    }
    
    /**
     * Cập nhật meal plan
     * USER chỉ update meal plan của pet mình
     * ADMIN có thể update tất cả
     */
    @Override
    public MealPlanResponse updateMealPlan(Long id, UpdateMealPlanRequest request) {
        MealPlan mealPlan = mealPlanRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Meal plan not found with id: " + id));
        
        // Kiểm tra quyền truy cập
        checkMealPlanAccess(mealPlan);
        
        if (request.getPlanDate() != null) {
            mealPlan.setPlanDate(request.getPlanDate());
        }
        if (request.getNotes() != null) {
            mealPlan.setNotes(request.getNotes());
        }
        
        MealPlan updated = mealPlanRepository.save(mealPlan);
        log.info("Meal plan {} updated", id);
        return mealPlanMapper.toResponse(updated);
    }
    
    /**
     * Xóa meal plan
     * USER chỉ xóa meal plan của pet mình
     * ADMIN có thể xóa tất cả
     */
    @Override
    public void deleteMealPlan(Long id) {
        MealPlan mealPlan = mealPlanRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Meal plan not found with id: " + id));
        
        // Kiểm tra quyền truy cập
        checkMealPlanAccess(mealPlan);
        
        mealPlanRepository.deleteById(id);
        log.info("Meal plan {} deleted", id);
    }
    
    // ========== MEAL ==========
    
    /**
     * Thêm meal vào meal plan
     * USER chỉ thêm vào meal plan của pet mình
     */
    @Override
    public MealResponse addMeal(AddMealRequest request) {
        MealPlan mealPlan = mealPlanRepository.findById(request.getMealPlanId())
            .orElseThrow(() -> new ResourceNotFoundException("Meal plan not found"));
        
        // Kiểm tra quyền truy cập meal plan
        checkMealPlanAccess(mealPlan);
        
        Meal meal = new Meal();
        meal.setMealPlan(mealPlan);
        meal.setMealType(request.getMealType());
        meal.setMealTime(request.getMealTime());
        meal.setIsCompleted(request.getIsCompleted());
        
        Meal saved = mealRepository.save(meal);
        log.info("Meal added to meal plan {}", request.getMealPlanId());
        
        return mealMapper.toResponse(saved);
    }
    
    @Override
    @Transactional(readOnly = true)
    public MealResponse getMealById(Long id) {
        Meal meal = mealRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Meal not found with id: " + id));
        
        // Kiểm tra quyền truy cập meal plan
        checkMealPlanAccess(meal.getMealPlan());
        
        return mealMapper.toResponse(meal);
    }
    
    @Override
    public MealResponse updateMeal(Long id, UpdateMealRequest request) {
        Meal meal = mealRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Meal not found with id: " + id));
        
        // Kiểm tra quyền truy cập
        checkMealPlanAccess(meal.getMealPlan());
        
        if (request.getMealType() != null) {
            meal.setMealType(request.getMealType());
        }
        if (request.getMealTime() != null) {
            meal.setMealTime(request.getMealTime());
        }
        if (request.getIsCompleted() != null) {
            meal.setIsCompleted(request.getIsCompleted());
        }
        
        Meal updated = mealRepository.save(meal);
        log.info("Meal {} updated", id);
        
        return mealMapper.toResponse(updated);
    }
    
    @Override
    public MealResponse markMealAsCompleted(Long mealId) {
        Meal meal = mealRepository.findById(mealId)
            .orElseThrow(() -> new ResourceNotFoundException("Meal not found with id: " + mealId));
        
        // Kiểm tra quyền truy cập
        checkMealPlanAccess(meal.getMealPlan());
        
        meal.setIsCompleted(true);
        Meal updated = mealRepository.save(meal);
        log.info("Meal {} marked as completed", mealId);
        
        return mealMapper.toResponse(updated);
    }
    
    @Override
    public void deleteMeal(Long id) {
        Meal meal = mealRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Meal not found with id: " + id));
        
        // Kiểm tra quyền truy cập
        checkMealPlanAccess(meal.getMealPlan());
        
        MealPlan mealPlan = meal.getMealPlan();
        mealRepository.deleteById(id);
        
        // Recalculate meal plan total calories
        recalculateMealPlanCalories(mealPlan.getId());
        log.info("Meal {} deleted", id);
    }

    /**
     * Tạo meals từ template mặc định cho meal plan
     * Tạo 3 bữa: BREAKFAST, LUNCH, DINNER
     */
    @Override
    public List<MealResponse> createMealsFromTemplate(Long mealPlanId) {
        MealPlan mealPlan = mealPlanRepository.findById(mealPlanId)
            .orElseThrow(() -> new ResourceNotFoundException("Meal plan not found with id: " + mealPlanId));

        // Kiểm tra quyền truy cập
        checkMealPlanAccess(mealPlan);

        // Xóa các meals cũ nếu có
        mealRepository.deleteByMealPlanId(mealPlanId);

        // Tạo meals mới từ template
        List<Meal> meals = List.of(
            createMeal(mealPlan, MealType.BREAKFAST, LocalTime.of(7, 0)),
            createMeal(mealPlan, MealType.LUNCH, LocalTime.of(12, 0)),
            createMeal(mealPlan, MealType.DINNER, LocalTime.of(18, 0))
        );

        List<Meal> savedMeals = mealRepository.saveAll(meals);
        log.info("Created {} meals from template for meal plan {}", savedMeals.size(), mealPlanId);

        return savedMeals.stream()
            .map(mealMapper::toResponse)
            .collect(Collectors.toList());
    }

    private void createDefaultMeals(MealPlan mealPlan) {

        List<Meal> meals = List.of(
            createMeal(mealPlan, MealType.BREAKFAST, LocalTime.of(7, 0)),
            createMeal(mealPlan, MealType.LUNCH, LocalTime.of(12, 0)),
            createMeal(mealPlan, MealType.DINNER, LocalTime.of(18, 0))
        );

        mealRepository.saveAll(meals);
    }

    private Meal createMeal(MealPlan mealPlan, MealType type, LocalTime time) {
        Meal meal = new Meal();
        meal.setMealPlan(mealPlan);
        meal.setMealType(type);
        meal.setMealTime(time);
        meal.setIsCompleted(false);
        return meal;
    }


    
    // ========== FOOD ITEM ==========
    
    @Override
    public FoodItemResponse addFoodItem(AddFoodItemRequest request) {
        Meal meal = mealRepository.findById(request.getMealId())
            .orElseThrow(() -> new ResourceNotFoundException("Meal not found"));
        
        // Kiểm tra quyền truy cập
        checkMealPlanAccess(meal.getMealPlan());
        
        FoodItem foodItem = new FoodItem();
        foodItem.setMeal(meal);
        foodItem.setFoodName(request.getFoodName());
        foodItem.setQuantity(request.getQuantity());
        foodItem.setUnit(request.getUnit());
        foodItem.setCalories(request.getCalories());
        foodItem.setProtein(request.getProtein());
        foodItem.setFat(request.getFat());
        foodItem.setCarbs(request.getCarbs());
        
        FoodItem saved = foodItemRepository.save(foodItem);
        
        // Recalculate meal nutrition totals
        recalculateMealNutrition(meal.getId());
        log.info("Food item added to meal {}", request.getMealId());
        
        return foodItemMapper.toResponse(saved);
    }
    
    @Override
    @Transactional(readOnly = true)
    public FoodItemResponse getFoodItemById(Long id) {
        FoodItem foodItem = foodItemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));
        
        // Kiểm tra quyền truy cập
        checkMealPlanAccess(foodItem.getMeal().getMealPlan());
        
        return foodItemMapper.toResponse(foodItem);
    }
    
    @Override
    public void deleteFoodItem(Long id) {
        FoodItem foodItem = foodItemRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Food item not found with id: " + id));
        
        // Kiểm tra quyền truy cập
        checkMealPlanAccess(foodItem.getMeal().getMealPlan());
        
        Long mealId = foodItem.getMeal().getId();
        foodItemRepository.deleteById(id);
        
        // Recalculate meal nutrition totals
        recalculateMealNutrition(mealId);
        log.info("Food item {} deleted", id);
    }
    
    // ========== HELPER METHODS ==========
    
    private void recalculateMealNutrition(Long mealId) {
        Meal meal = mealRepository.findById(mealId)
            .orElseThrow(() -> new ResourceNotFoundException("Meal not found"));
        
        meal.calculateNutritionTotals();
        mealRepository.save(meal);
        
        // Recalculate meal plan total calories
        recalculateMealPlanCalories(meal.getMealPlan().getId());
    }
    
    private void recalculateMealPlanCalories(Long mealPlanId) {
        MealPlan mealPlan = mealPlanRepository.findById(mealPlanId)
            .orElseThrow(() -> new ResourceNotFoundException("Meal plan not found"));
        
        mealPlan.calculateTotalCalories();
        mealPlanRepository.save(mealPlan);
    }
    
    /**
     * Kiểm tra quyền truy cập meal plan
     * USER chỉ truy cập meal plan của pet mình
     * ADMIN truy cập tất cả
     */
    private void checkMealPlanAccess(MealPlan mealPlan) {
        if (!securityUtils.isOwnerOrAdmin(mealPlan.getUserId())) {
            throw new ForbiddenException("You don't have permission to access this meal plan");
        }
    }
    
    /**
     * Kiểm tra pet có thuộc về user không
     * Gọi ProfileService để lấy danh sách pets của user
     */
    private void checkPetOwnership(Long petId, Long userId) {
        List<PetDTO> userPets = profileService.getMyPets(userId);
        
        boolean isPetOwner = userPets.stream()
            .anyMatch(pet -> pet.getId().equals(petId));
        
        if (!isPetOwner) {
            throw new ForbiddenException("You don't have permission to access this pet");
        }
    }
    
    /**
     * Lấy thông tin pet từ ProfileService
     */
    private PetDTO getPetInfo(Long petId, Long userId) {
        List<PetDTO> userPets = profileService.getMyPets(userId);
        
        return userPets.stream()
            .filter(pet -> pet.getId().equals(petId))
            .findFirst()
            .orElseThrow(() -> new ResourceNotFoundException("Pet not found or you don't have access"));
    }
    
    // ========== NUTRITION SUMMARY ==========
    
    @Override
@Transactional(readOnly = true)
public DailyNutritionSummaryResponse getDailySummary(
        Long userId,
        Long petId,
        LocalDate date
) {

    // 1. Bảo mật: kiểm tra pet có thuộc user không
    checkPetOwnership(petId, userId);

    // 2. Lấy meal plan đúng user + pet + ngày
    MealPlan mealPlan = mealPlanRepository
            .findByUserIdAndPetIdAndPlanDate(userId, petId, date)
            .orElse(null);

    // 3. Lấy recommendation (đã gắn với meal_plan)
    NutritionRecommendation recommendation = null;
    if (mealPlan != null) {
        recommendation = mealPlan.getRecommendation();
    }

    BigDecimal recommendedCalories = BigDecimal.ZERO;
    BigDecimal recommendedProtein  = BigDecimal.ZERO;
    BigDecimal recommendedFat      = BigDecimal.ZERO;
    BigDecimal recommendedCarbs    = BigDecimal.ZERO;

    if (recommendation != null) {
        recommendedCalories = recommendation.getRecommendedCalories();
        recommendedProtein  = recommendation.getRecommendedProtein();
        recommendedFat      = recommendation.getRecommendedFat();
        recommendedCarbs    = recommendation.getRecommendedCarbs();
    }

    // 4. Nếu chưa có meal plan
    if (mealPlan == null) {
        return DailyNutritionSummaryResponse.builder()
                .date(date)
                .petId(petId)
                .actualCalories(BigDecimal.ZERO)
                .actualProtein(BigDecimal.ZERO)
                .actualFat(BigDecimal.ZERO)
                .actualCarbs(BigDecimal.ZERO)
                .recommendedCalories(recommendedCalories)
                .caloriesPercentage(BigDecimal.ZERO)
                .totalMeals(0)
                .completedMeals(0)
                .status("NO_PLAN")
                .message("Chưa có meal plan cho ngày này")
                .build();
    }

    // 5. Tính thực tế ăn
    BigDecimal actualCalories = BigDecimal.ZERO;
    BigDecimal actualProtein  = BigDecimal.ZERO;
    BigDecimal actualFat      = BigDecimal.ZERO;
    BigDecimal actualCarbs    = BigDecimal.ZERO;

    int totalMeals = mealPlan.getMeals().size();
    int completedMeals = 0;

    for (Meal meal : mealPlan.getMeals()) {
        actualCalories = actualCalories.add(meal.getTotalCalories());
        actualProtein  = actualProtein.add(meal.getTotalProtein());
        actualFat      = actualFat.add(meal.getTotalFat());
        actualCarbs    = actualCarbs.add(meal.getTotalCarbs());

        if (Boolean.TRUE.equals(meal.getIsCompleted())) {
            completedMeals++;
        }
    }

    // 6. So sánh
    BigDecimal caloriesPercentage = BigDecimal.ZERO;
    if (recommendedCalories.compareTo(BigDecimal.ZERO) > 0) {
        caloriesPercentage = actualCalories
                .divide(recommendedCalories, 2, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));
    }

    String status = evaluateStatus(caloriesPercentage);
    String message = generateMessage(status, caloriesPercentage);

    return DailyNutritionSummaryResponse.builder()
            .date(date)
            .petId(petId)
            .actualCalories(actualCalories)
            .actualProtein(actualProtein)
            .actualFat(actualFat)
            .actualCarbs(actualCarbs)
            .recommendedCalories(recommendedCalories)
            .caloriesPercentage(caloriesPercentage)
            .totalMeals(totalMeals)
            .completedMeals(completedMeals)
            .status(status)
            .message(message)
            .build();
    }

    private BigDecimal getActivityFactor(String activityLevel) {
    return switch (activityLevel) {
        case "SEDENTARY"   -> BigDecimal.valueOf(1.2);
        case "LIGHT"       -> BigDecimal.valueOf(1.4);
        case "MODERATE"    -> BigDecimal.valueOf(1.6);
        case "ACTIVE"      -> BigDecimal.valueOf(1.8);
        case "VERY_ACTIVE" -> BigDecimal.valueOf(2.0);
        default -> BigDecimal.valueOf(1.4);
    };
    }

    
    @Override
    @Transactional(readOnly = true)
    public WeeklySummaryResponse getWeeklySummary(Long petId, LocalDate weekStart) {
        Long currentUserId = securityUtils.getCurrentUserId();
        
        // Kiểm tra quyền truy cập pet
        checkPetOwnership(petId, currentUserId);
        
        LocalDate weekEnd = weekStart.plusDays(6);
        
        List<MealPlan> weeklyPlans = mealPlanRepository.findWeeklyPlans(petId, weekStart, weekEnd);
        
        // Tính tổng và trung bình
        BigDecimal totalCalories = BigDecimal.ZERO;
        BigDecimal totalProtein = BigDecimal.ZERO;
        BigDecimal totalFat = BigDecimal.ZERO;
        BigDecimal totalCarbs = BigDecimal.ZERO;
        
        int totalMeals = 0;
        int completedMeals = 0;
        
        List<DailyNutritionSummaryResponse> dailySummaries = weeklyPlans.stream()
        .map(plan -> getDailySummary(currentUserId, petId, plan.getPlanDate()))
        .collect(Collectors.toList());
        
        for (DailyNutritionSummaryResponse daily : dailySummaries) {
            totalCalories = totalCalories.add(daily.getActualCalories());
            totalProtein = totalProtein.add(daily.getActualProtein());
            totalFat = totalFat.add(daily.getActualFat());
            totalCarbs = totalCarbs.add(daily.getActualCarbs());
            totalMeals += daily.getTotalMeals();
            completedMeals += daily.getCompletedMeals();
        }
        
        int daysWithData = dailySummaries.size();
        BigDecimal avgCalories = daysWithData > 0 ? 
            totalCalories.divide(new BigDecimal(daysWithData), 2, RoundingMode.HALF_UP) : BigDecimal.ZERO;
        
        return WeeklySummaryResponse.builder()
            .petId(petId)
            .weekStart(weekStart)
            .weekEnd(weekEnd)
            .avgDailyCalories(avgCalories)
            .totalWeeklyCalories(totalCalories)
            .totalWeeklyProtein(totalProtein)
            .totalWeeklyFat(totalFat)
            .totalWeeklyCarbs(totalCarbs)
            .totalMealsInWeek(totalMeals)
            .completedMealsInWeek(completedMeals)
            .daysWithData(daysWithData)
            .dailySummaries(dailySummaries)
            .weeklyStatus("GOOD")
            .weeklyMessage("Weekly nutrition is balanced")
            .build();
    }
    
    // ========== RECOMMENDATION ==========
    
    @Override
    @Transactional(readOnly = true)
    public NutritionRecommendationResponse getRecommendation(GetRecommendationRequest request) {
        NutritionRecommendation recommendation = recommendationRepository
            .findBestRecommendationForPet(
                request.getSpecies(),
                request.getBreed(),
                request.getAgeMonth(),
                request.getWeight(),
                request.getActivityLevel()
            )
            .orElseThrow(() -> new ResourceNotFoundException("No recommendation found for this pet"));
        
        return recommendationMapper.toResponse(recommendation);
    }
    
    @Override
    @Transactional(readOnly = true)
    public NutritionRecommendationResponse getRecommendationForPet(Long petId) {
        Long currentUserId = securityUtils.getCurrentUserId();

        // Kiểm tra quyền truy cập pet
        checkPetOwnership(petId, currentUserId);

        // Lấy thông tin pet từ ProfileService
        PetDTO pet = getPetInfo(petId, currentUserId);

        // Tính tuổi (tháng) từ birthDate
        Integer ageMonth = calculateAgeInMonths(pet.getBirthDate());

        // Convert weight từ Double sang BigDecimal
        BigDecimal weight = pet.getWeight() != null
            ? BigDecimal.valueOf(pet.getWeight())
            : BigDecimal.valueOf(5); // Default 5kg nếu không có weight

        // Tạo request để tìm recommendation
        GetRecommendationRequest request = new GetRecommendationRequest();
        request.setSpecies(pet.getSpecies());
        request.setBreed(pet.getBreed());
        request.setAgeMonth(ageMonth);
        request.setWeight(weight);
        request.setActivityLevel("MODERATE");

        // Thử tìm recommendation từ DB trước
        try {
            return getRecommendation(request);
        } catch (ResourceNotFoundException e) {
            // Nếu không tìm thấy trong DB, tính toán recommendation
            log.info("No recommendation found in DB for pet {}, calculating...", petId);
            return calculateRecommendation(request);
        }
    }

    @Override
    public NutritionRecommendationResponse calculateRecommendation(
        GetRecommendationRequest request
    ) {
        BigDecimal weight = request.getWeight();
        if (weight == null || weight.compareTo(BigDecimal.ZERO) <= 0) {
            weight = BigDecimal.valueOf(5); // Default 5kg
        }

        String species = request.getSpecies();
        Integer ageMonth = request.getAgeMonth();
        String activityLevel = request.getActivityLevel();

        // Tính RER (Resting Energy Requirement) = 70 * weight^0.75
        double weightDouble = weight.doubleValue();
        double rer = 70 * Math.pow(weightDouble, 0.75);

        // Tính hệ số activity
        double activityFactor = 1.4; // Mặc định MODERATE
        if ("LOW".equalsIgnoreCase(activityLevel)) {
            activityFactor = 1.2;
        } else if ("HIGH".equalsIgnoreCase(activityLevel)) {
            activityFactor = 1.8;
        }

        // Tính hệ số tuổi
        double ageFactor = 1.0;
        if (ageMonth != null) {
            if (ageMonth < 4) {
                ageFactor = 3.0; // Chó/mèo con rất nhỏ
            } else if (ageMonth < 12) {
                ageFactor = 2.0; // Chó/mèo con
            } else if (ageMonth > 84) {
                ageFactor = 0.8; // Thú cưng già (> 7 tuổi)
            }
        }

        // Tính calories hàng ngày
        double dailyCalories = rer * activityFactor * ageFactor;

        // Phân bổ dinh dưỡng theo tỷ lệ chuẩn
        // Chó: Protein 25-30%, Fat 15-20%, Carbs 45-55%
        // Mèo: Protein 30-35%, Fat 20-25%, Carbs 35-45%
        double proteinPercent, fatPercent, carbsPercent;
        if ("Mèo".equalsIgnoreCase(species) || "CAT".equalsIgnoreCase(species)) {
            proteinPercent = 0.32;
            fatPercent = 0.22;
            carbsPercent = 0.40;
        } else {
            proteinPercent = 0.28;
            fatPercent = 0.18;
            carbsPercent = 0.50;
        }

        // Tính gram từ calories (Protein/Carbs: 4 cal/g, Fat: 9 cal/g)
        BigDecimal calories = BigDecimal.valueOf(dailyCalories).setScale(0, RoundingMode.HALF_UP);
        BigDecimal protein = BigDecimal.valueOf(dailyCalories * proteinPercent / 4).setScale(1, RoundingMode.HALF_UP);
        BigDecimal fat = BigDecimal.valueOf(dailyCalories * fatPercent / 9).setScale(1, RoundingMode.HALF_UP);
        BigDecimal carbs = BigDecimal.valueOf(dailyCalories * carbsPercent / 4).setScale(1, RoundingMode.HALF_UP);

        String notes = String.format(
            "Khuyến nghị cho %s %.1fkg, %s tháng tuổi. Mức độ hoạt động: %s. Công thức: RER × %.1f × %.1f",
            species != null ? species : "thú cưng",
            weightDouble,
            ageMonth != null ? ageMonth : "không rõ",
            activityLevel != null ? activityLevel : "MODERATE",
            activityFactor,
            ageFactor
        );

        return NutritionRecommendationResponse.builder()
                .recommendedCalories(calories)
                .recommendedProtein(protein)
                .recommendedFat(fat)
                .recommendedCarbs(carbs)
                .notes(notes)
                .build();
    }


    @Override
    public NutritionRecommendationResponse getRecommendationByPet(Long petId) {
        // Gọi method đã có logic đầy đủ
        return getRecommendationForPet(petId);
    }
    
    // ========== UTILITY METHODS ==========
    
    private DailyNutritionSummaryResponse createEmptySummary(Long petId, LocalDate date) {
        return DailyNutritionSummaryResponse.builder()
            .date(date)
            .petId(petId)
            .actualCalories(BigDecimal.ZERO)
            .totalMeals(0)
            .completedMeals(0)
            .status("NO_DATA")
            .message("No meal plan found for this date")
            .build();
    }
    
    private BigDecimal calculatePercentage(BigDecimal actual, BigDecimal recommended) {
        if (recommended.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return actual.divide(recommended, 4, RoundingMode.HALF_UP)
            .multiply(new BigDecimal("100"));
    }
    
    private String evaluateStatus(BigDecimal percentage) {
        if (percentage.compareTo(new BigDecimal("90")) >= 0 && 
            percentage.compareTo(new BigDecimal("110")) <= 0) {
            return "GOOD";
        } else if (percentage.compareTo(new BigDecimal("90")) < 0) {
            return "LOW";
        } else {
            return "HIGH";
        }
    }
    
    private String generateMessage(String status, BigDecimal percentage) {
        switch (status) {
            case "GOOD":
                return "Nutrition is on target (" + percentage.setScale(1, RoundingMode.HALF_UP) + "%)";
            case "LOW":
                return "Below target (" + percentage.setScale(1, RoundingMode.HALF_UP) + "%) - consider adding more food";
            case "HIGH":
                return "Above target (" + percentage.setScale(1, RoundingMode.HALF_UP) + "%) - consider reducing portions";
            default:
                return "No data available";
        }
    }
    
    private Integer calculateAgeInMonths(LocalDate birthDate) {
        if (birthDate == null) {
            return 0;
        }
        LocalDate now = LocalDate.now();
        long months = java.time.temporal.ChronoUnit.MONTHS.between(birthDate, now);
        return (int) months;
    }
}