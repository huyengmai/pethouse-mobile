import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { nutritionApi } from '../services/nutritionApi';
import MealPlanCard from '../components/MealCard';
import AddMealModal from '../components/AddMealModal';
import TemplateSelectionModal from '../components/TemplateSelectionModal';
import EditMealPlanModal from '../components/EditMealPlanModal';
import AddFoodItemModal from '../components/AddFoodItemModal';

/* =========================
   CREATE MEAL PLAN MODAL
========================= */
function CreateMealPlanModal({ isOpen, onClose, onSubmit, petId, pets = [] }) {
  const [formData, setFormData] = useState({
    petId: petId || '',
    planDate: new Date().toISOString().split('T')[0],
    notes: '',
    meals: []
  });

  const [submitting, setSubmitting] = useState(false);

  // Cập nhật petId khi prop thay đổi
  React.useEffect(() => {
    if (petId) {
      setFormData(prev => ({ ...prev, petId }));
    }
  }, [petId]);

  const handleSubmit = async () => {
    if (!formData.petId) {
      alert('Vui lòng chọn thú cưng!');
      return;
    }
    try {
      setSubmitting(true);
      await nutritionApi.createMealPlan(formData);
      alert('✅ Đã tạo meal plan thành công!');
      await onSubmit();
      onClose();
      setFormData({
        petId: petId || '',
        planDate: new Date().toISOString().split('T')[0],
        notes: '',
        meals: []
      });
    } catch (error) {
      console.error('Error creating meal plan:', error);
      alert('❌ Không thể tạo meal plan. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Tìm pet đang được chọn
  const selectedPet = pets.find(p => p.id === formData.petId);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h2 className="text-2xl font-bold text-primary mb-6">
          Tạo Meal Plan Mới
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Thú cưng
            </label>
            <select
              value={formData.petId}
              onChange={(e) =>
                setFormData({ ...formData, petId: Number(e.target.value) })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
            >
              <option value="">-- Chọn thú cưng --</option>
              {pets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  🐾 {pet.name} {pet.species ? `(${pet.species})` : ''}
                </option>
              ))}
            </select>
            {selectedPet && (
              <p className="text-sm text-gray-500 mt-1">
                Đã chọn: <span className="font-medium text-primary">{selectedPet.name}</span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ngày
            </label>
            <input
              type="date"
              value={formData.planDate}
              onChange={(e) =>
                setFormData({ ...formData, planDate: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Ghi chú (tùy chọn)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none"
              rows="3"
              placeholder="Thêm ghi chú cho meal plan..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-all disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  Đang tạo...
                </>
              ) : (
                'Tạo'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   MEAL PLAN DETAILS MODAL
========================= */
function MealPlanDetailsModal({ plan, isOpen, onClose, onAddMeal, onRefresh }) {
  const [showAddMealForm, setShowAddMealForm] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddFoodModal, setShowAddFoodModal] = useState(false);
  const [selectedMealForFood, setSelectedMealForFood] = useState(null);

  if (!isOpen || !plan) return null;

  const getMealTimeForType = (mealType) => {
    const times = {
      BREAKFAST: '07:00',
      LUNCH: '12:00',
      DINNER: '18:00'
    };
    return times[mealType] || '12:00';
  };

  const handleAddMealManually = async (mealData) => {
    try {
      await nutritionApi.addMeal(mealData);
      const updatedPlan = await nutritionApi.getMealPlanById(plan.id);
      onAddMeal(null, updatedPlan);
      alert('✅ Đã thêm bữa ăn!');
      setShowAddMealForm(false);
    } catch (err) {
      alert('❌ Không thể thêm bữa ăn');
      console.error(err);
    }
  };

  const handleApplyTemplate = async () => {
  try {
    // ✅ backend chỉ cần mealPlanId
    await nutritionApi.createMealsFromTemplate(plan.id);

    const updatedPlan = await nutritionApi.getMealPlanById(plan.id);
    onAddMeal(null, updatedPlan);

    alert('✅ Đã áp dụng template!');
    setShowTemplateModal(false);
  } catch (err) {
    alert('❌ Không thể áp dụng template');
    console.error(err);
  }
};


  const handleCompleteMeal = async (mealId) => {
    try {
      await nutritionApi.completeMeal(mealId);
      const updatedPlan = await nutritionApi.getMealPlanById(plan.id);
      onAddMeal(null, updatedPlan);
      alert('✅ Đã đánh dấu hoàn thành!');
    } catch (err) {
      alert('❌ Không thể cập nhật trạng thái');
      console.error(err);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    if (!confirm('Bạn có chắc muốn xóa bữa ăn này?')) return;
    
    try {
      await nutritionApi.deleteMeal(mealId);
      const updatedPlan = await nutritionApi.getMealPlanById(plan.id);
      onAddMeal(null, updatedPlan);
      alert('✅ Đã xóa bữa ăn!');
    } catch (err) {
      alert('❌ Không thể xóa bữa ăn');
      console.error(err);
    }
  };

  // ✅ HANDLER CHO EDIT MEAL PLAN
  const handleEditMealPlan = async (planId, updateData) => {
    try {
      await nutritionApi.updateMealPlan(planId, updateData);
      const updatedPlan = await nutritionApi.getMealPlanById(plan.id);
      onAddMeal(null, updatedPlan);
      alert('✅ Đã cập nhật meal plan!');
      setShowEditModal(false);
      
      // Refresh list nếu có callback
      if (onRefresh) {
        await onRefresh();
      }
    } catch (error) {
      console.error('Error updating meal plan:', error);
      alert('❌ Không thể cập nhật meal plan');
    }
  };

  // ✅ HANDLER CHO ADD FOOD TO MEAL
  const handleAddFoodToMeal = async (foodData) => {
    try {
      await nutritionApi.addFoodItem(foodData);
      const updatedPlan = await nutritionApi.getMealPlanById(plan.id);
      onAddMeal(null, updatedPlan);
      alert('✅ Đã thêm món ăn!');
    } catch (err) {
      alert('❌ Không thể thêm món ăn');
      throw err;
    }
  };

  // ✅ HANDLER CHO DELETE FOOD
  const handleDeleteFood = async (foodId) => {
    if (!confirm('Bạn có chắc muốn xóa món ăn này?')) return;

    try {
      await nutritionApi.deleteFoodItem(foodId);
      const updatedPlan = await nutritionApi.getMealPlanById(plan.id);
      onAddMeal(null, updatedPlan);
      alert('✅ Đã xóa món ăn!');
    } catch (err) {
      alert('❌ Không thể xóa món ăn');
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl p-8 max-w-4xl w-full my-8">
        {/* ✅ UPDATED HEADER WITH EDIT BUTTON */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-primary">
            Chi Tiết Meal Plan - {new Date(plan.planDate).toLocaleDateString('vi-VN')}
          </h2>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-yellow-400 text-gray-800 rounded-lg font-semibold hover:bg-yellow-500 transition-all"
            >
             Chỉnh sửa
            </button>
            <button onClick={onClose} className="text-2xl hover:text-gray-600">✕</button>
          </div>
        </div>

        {/* THÔNG TIN MEAL PLAN */}
        <div className="bg-gradient-to-r from-bg-blue to-bg-green rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm text-gray-600 mb-1">Tổng Calories</div>
              <div className="text-3xl font-bold text-primary">{plan.totalCalories || 0}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Số bữa ăn</div>
              <div className="text-3xl font-bold text-primary">{plan.totalMeals || 0}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Hoàn thành</div>
              <div className="text-3xl font-bold text-green-600">{plan.completedMeals || 0}</div>
            </div>
          </div>
          {plan.notes && (
            <div className="mt-4 p-3 bg-white/50 rounded-xl text-sm">
              <strong>Ghi chú:</strong> {plan.notes}
            </div>
          )}
        </div>

        {/* ADD MEAL OPTIONS */}
        {!showAddMealForm && (
          <div className="mb-6 space-y-3">
            <button
              onClick={() => setShowTemplateModal(true)}
              className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
             Chọn từ Template
            </button>

            <button
              onClick={() => setShowAddMealForm(true)}
              className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
             Tạo Bữa Ăn Thủ Công
            </button>
          </div>
        )}

        {/* DANH SÁCH CÁC BỮA ĂN */}
        {plan.meals && plan.meals.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-primary">Danh sách bữa ăn</h3>
            {plan.meals.map((meal) => (
              <div key={meal.id} className="bg-white border-2 border-gray-200 rounded-xl p-4">
                {/* ✅ UPDATED MEAL HEADER WITH ADD FOOD BUTTON */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-lg text-primary">
                      {meal.mealType === 'BREAKFAST' ? '🌅 Sáng' : 
                       meal.mealType === 'LUNCH' ? '☀️ Trưa' : '🌙 Tối'}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Thời gian: {meal.mealTime}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      meal.isCompleted 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {meal.isCompleted ? '✅ Hoàn thành' : '⏳ Chưa hoàn thành'}
                    </div>
                    
                    {/* ✅ ADD FOOD BUTTON */}
                    <button
                      onClick={() => {
                        setSelectedMealForFood(meal);
                        setShowAddFoodModal(true);
                      }}
                      className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs font-semibold hover:bg-green-600 transition-all"
                    >
                      + Thêm món
                    </button>
                    
                    {!meal.isCompleted && (
                      <button
                        onClick={() => handleCompleteMeal(meal.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs font-semibold hover:bg-blue-600 transition-all"
                      >
                        Đánh dấu xong
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleDeleteMeal(meal.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs font-semibold hover:bg-red-600 transition-all"
                    >
                      Xóa
                    </button>
                  </div>
                </div>

                {/* ✅ FOOD ITEMS WITH DELETE BUTTON */}
                {meal.foodItems && meal.foodItems.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                    {meal.foodItems.map((food) => (
                      <div key={food.id} className="bg-bg-blue rounded-lg p-3 relative">
                        <button
                          onClick={() => handleDeleteFood(food.id)}
                          className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-all flex items-center justify-center"
                          title="Xóa món ăn"
                        >
                          ×
                        </button>
                        <div className="font-semibold pr-8">{food.foodName}</div>
                        <div className="text-sm text-gray-600">
                          {food.quantity} {food.unit} • {food.calories} cal
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          P: {food.protein}g • F: {food.fat}g • C: {food.carbs}g
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {plan.meals && plan.meals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Chưa có bữa ăn nào. Hãy thêm bữa ăn!
          </div>
        )}

        {/* MODALS */}
        {showAddMealForm && (
          <AddMealModal
            isOpen={showAddMealForm}
            onClose={() => setShowAddMealForm(false)}
            onSubmit={handleAddMealManually}
            mealPlanId={plan.id}
          />
        )}

        <TemplateSelectionModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          onSelectTemplate={handleApplyTemplate}
          mealType={selectedMealType}
          petSpecies={plan.petSpecies || null}
        />

        {/* ✅ EDIT MEAL PLAN MODAL */}
        <EditMealPlanModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSubmit={handleEditMealPlan}
          mealPlan={plan}
        />

        {/* ✅ ADD FOOD MODAL */}
        <AddFoodItemModal
          isOpen={showAddFoodModal}
          onClose={() => {
            setShowAddFoodModal(false);
            setSelectedMealForFood(null);
          }}
          onSubmit={handleAddFoodToMeal}
          mealId={selectedMealForFood?.id}
        />
      </div>
    </div>
  );
}

/* =========================
   MAIN COMPONENT
========================= */
export default function MealPlanDetail() {
  const { id } = useParams();
  const [mealPlans, setMealPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // State cho pets
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);
  const [loadingPets, setLoadingPets] = useState(true);

  // Fetch pets khi component mount
  useEffect(() => {
    fetchMyPets();
  }, []);

  // Fetch meal plans khi selectedPetId thay đổi
  useEffect(() => {
    if (selectedPetId) {
      fetchMealPlans(selectedPetId);
    }
  }, [selectedPetId]);

  const fetchMyPets = async () => {
    try {
      setLoadingPets(true);
      const data = await nutritionApi.getMyPets();
      setPets(data || []);
      // Tự động chọn pet đầu tiên nếu có
      if (data && data.length > 0) {
        setSelectedPetId(data[0].id);
      }
    } catch (error) {
      console.error('Error fetching pets:', error);
    } finally {
      setLoadingPets(false);
    }
  };

  const fetchMealPlans = async (petId) => {
    if (!petId) return;
    try {
      setLoading(true);
      const data = await nutritionApi.getMealPlansByPet(petId);
      setMealPlans(data.data || data);
    } catch (error) {
      console.error('Error fetching meal plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (plan) => {
    try {
      const data = await nutritionApi.getMealPlanById(plan.id);
      setSelectedPlan(data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Error fetching meal plan details:', error);
      alert('Không thể tải chi tiết meal plan');
    }
  };

  const handleDeletePlan = async (planId) => {
    if (!confirm('Bạn có chắc muốn xóa meal plan này?')) return;

    try {
      await nutritionApi.deleteMealPlan(planId);
      alert('✅ Đã xóa meal plan!');
      await fetchMealPlans(selectedPetId);
    } catch (error) {
      console.error('Error deleting meal plan:', error);
      alert('❌ Không thể xóa meal plan');
    }
  };

  // Lấy tên pet đang chọn
  const selectedPet = pets.find(p => p.id === selectedPetId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-bg-blue to-white p-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              to="/nutrition"
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <ArrowLeft className="w-6 h-6 text-primary" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-primary">Danh Sách Meal Plans</h1>
              <p className="text-gray-600">
                {selectedPet ? `Quản lý kế hoạch bữa ăn cho ${selectedPet.name}` : 'Quản lý tất cả các kế hoạch bữa ăn'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Dropdown chọn Pet */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🐾</span>
              <select
                value={selectedPetId || ''}
                onChange={(e) => setSelectedPetId(Number(e.target.value))}
                className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:outline-none font-medium min-w-[180px]"
                disabled={loadingPets}
              >
                {loadingPets ? (
                  <option>Đang tải...</option>
                ) : pets.length === 0 ? (
                  <option>Chưa có pet nào</option>
                ) : (
                  pets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} {pet.species ? `(${pet.species})` : ''}
                    </option>
                  ))
                )}
              </select>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              disabled={!selectedPetId}
              className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ➕ Tạo Meal Plan
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        )}

        {!loading && mealPlans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mealPlans.map((plan) => (
              <MealPlanCard
                key={plan.id}
                plan={plan}
                onViewDetails={handleViewDetails}
                onDelete={handleDeletePlan}
              />
            ))}
          </div>
        )}

        {!loading && mealPlans.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-2xl font-bold text-primary mb-2">
              Chưa có meal plan nào
            </h3>
            <p className="text-gray-600 mb-6">
              Tạo meal plan đầu tiên để bắt đầu quản lý dinh dưỡng
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all"
            >
              ➕ Tạo Meal Plan Đầu Tiên
            </button>
          </div>
        )}

        <CreateMealPlanModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={() => fetchMealPlans(selectedPetId)}
          petId={selectedPetId}
          pets={pets}
        />

        <MealPlanDetailsModal
          plan={selectedPlan}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          onAddMeal={(x, updated) => updated && setSelectedPlan(updated)}
          onRefresh={() => fetchMealPlans(selectedPetId)}
        />
      </div>
    </div>
  );
}