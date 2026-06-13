# 🍖 Nutrition Module - Frontend Documentation

## 📋 Tổng Quan

Module quản lý dinh dưỡng cho thú cưng với đầy đủ tính năng cho cả User và Admin.

## 📁 Cấu Trúc Thư Mục

```
nutrition_hien/
├── components/              # React Components
│   ├── AddMealModal.jsx    # Modal thêm bữa ăn
│   ├── FoodItemCard.jsx    # Card hiển thị món ăn
│   ├── MealCard.jsx        # Card hiển thị meal plan
│   ├── NutritionCard.jsx   # Card metrics dinh dưỡng
│   ├── NutritionChart.jsx  # Biểu đồ tuần
│   └── NutritionSummary.jsx # Tổng kết dinh dưỡng
│
├── pages/                   # User Pages
│   ├── NutritionDashboard.jsx      # Dashboard chính
│   ├── MealPlanDetail.jsx          # Chi tiết meal plans
│   ├── DailySummaryPage.jsx        # Tổng kết ngày/tuần
│   ├── NutritionRecommendation.jsx # Khuyến nghị
│   ├── AdminDashboard.jsx          # Admin dashboard
│   ├── ManageRulesPage.jsx         # Quản lý rules
│   ├── ManageTemplatesPage.jsx     # Quản lý templates
│   └── ManageFormulasPage.jsx      # Quản lý formulas
│
├── services/
│   └── nutritionApi.js      # API Service (46 endpoints)
│
├── index.jsx                # Main exports
├── NutritionRoutes.jsx      # React Router config
├── .env.example             # Environment variables
└── README.md                # Documentation
```

## 🚀 Cài Đặt

### 1. Environment Variables

Tạo file `.env` từ `.env.example`:

```bash
VITE_API_URL=http://localhost:9090
VITE_DEV_MODE=true
VITE_DEBUG=true
VITE_ENABLE_ADMIN=true
```

### 2. Install Dependencies

```bash
npm install react-router-dom lucide-react axios
```

### 3. Import Module

Trong `App.jsx` hoặc main routing file:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NutritionRoutes from './features/nutrition_hien/NutritionRoutes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/nutrition/*" element={<NutritionRoutes />} />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

## 🌐 Routes

### User Routes
- `/nutrition` - Dashboard
- `/nutrition/meal-plan` - Danh sách meal plans
- `/nutrition/meal-plan/:id` - Chi tiết meal plan
- `/nutrition/summary` - Tổng kết ngày/tuần
- `/nutrition/recommendation` - Khuyến nghị dinh dưỡng

### Admin Routes
- `/nutrition/admin` - Admin Dashboard
- `/nutrition/admin/rules` - Quản lý Nutrition Rules
- `/nutrition/admin/templates` - Quản lý Meal Templates
- `/nutrition/admin/formulas` - Quản lý Nutrition Formulas

## 🔌 API Endpoints

### User API (23 endpoints)

#### Meal Plan (7)
- `POST /api/nutrition/meal-plans` - Tạo meal plan
- `GET /api/nutrition/meal-plans/{id}` - Lấy theo ID
- `GET /api/nutrition/meal-plans/pet/{petId}` - Tất cả của pet
- `GET /api/nutrition/meal-plans/pet/{petId}/date/{date}` - Theo ngày
- `GET /api/nutrition/meal-plans/pet/{petId}/range` - Theo khoảng
- `PUT /api/nutrition/meal-plans/{id}` - Cập nhật
- `DELETE /api/nutrition/meal-plans/{id}` - Xóa

#### Meal (5)
- `POST /api/nutrition/meals` - Thêm meal
- `GET /api/nutrition/meals/{id}` - Lấy theo ID
- `PUT /api/nutrition/meals/{id}` - Cập nhật
- `PATCH /api/nutrition/meals/{id}/complete` - Đánh dấu hoàn thành
- `DELETE /api/nutrition/meals/{id}` - Xóa

#### Food Item (3)
- `POST /api/nutrition/food-items` - Thêm food item
- `GET /api/nutrition/food-items/{id}` - Lấy theo ID
- `DELETE /api/nutrition/food-items/{id}` - Xóa

#### Summary (2)
- `GET /api/nutrition/summary/daily/pet/{petId}` - Tổng kết ngày
- `GET /api/nutrition/summary/weekly/pet/{petId}` - Tổng kết tuần

#### Recommendation (2)
- `POST /api/nutrition/recommendations/calculate` - Tính khuyến nghị
- `GET /api/nutrition/recommendations/pet/{petId}` - Lấy khuyến nghị

### Admin API (23 endpoints)

#### Nutrition Rules (6)
- `POST /api/admin/nutrition/rules` - Tạo rule
- `GET /api/admin/nutrition/rules` - Tất cả rules
- `GET /api/admin/nutrition/rules/{id}` - Lấy theo ID
- `GET /api/admin/nutrition/rules/species/{species}` - Theo species
- `PUT /api/admin/nutrition/rules/{id}` - Cập nhật
- `DELETE /api/admin/nutrition/rules/{id}` - Xóa

#### Meal Templates (6)
- `POST /api/admin/nutrition/templates` - Tạo template
- `GET /api/admin/nutrition/templates` - Tất cả templates
- `GET /api/admin/nutrition/templates/{id}` - Lấy theo ID
- `GET /api/admin/nutrition/templates/species/{species}` - Theo species
- `PUT /api/admin/nutrition/templates/{id}` - Cập nhật
- `DELETE /api/admin/nutrition/templates/{id}` - Xóa

#### Formulas (6)
- `POST /api/admin/nutrition/formulas` - Tạo formula
- `GET /api/admin/nutrition/formulas` - Tất cả formulas
- `GET /api/admin/nutrition/formulas/{id}` - Lấy theo ID
- `PUT /api/admin/nutrition/formulas/{id}` - Cập nhật
- `DELETE /api/admin/nutrition/formulas/{id}` - Xóa

## 💻 Sử Dụng API Service

```javascript
import { nutritionApi, adminNutritionApi } from './services/nutritionApi';

// User API
const mealPlans = await nutritionApi.getMealPlansByPet(petId);
const summary = await nutritionApi.getDailySummary(petId, date);
const recommendation = await nutritionApi.calculateRecommendation(data);

// Admin API
const rules = await adminNutritionApi.getAllRules();
const templates = await adminNutritionApi.getAllTemplates();
const formulas = await adminNutritionApi.getAllFormulas();
```

## 🎨 Components Usage

### NutritionCard
```jsx
import { NutritionCard } from './components/NutritionCard';

<NutritionCard
  title="Calories"
  value={1500}
  unit="cal"
  icon="🔥"
  bgColor="bg-bg-orange"
/>
```

### DetailedNutritionCard
```jsx
import { DetailedNutritionCard } from './components/NutritionCard';

<DetailedNutritionCard
  title="Protein"
  actual={45}
  recommended={50}
  unit="g"
  icon="💪"
  color="bg-bg-green"
/>
```

### NutritionSummary
```jsx
import { NutritionSummary } from './components/NutritionSummary';

<NutritionSummary summary={dailySummary} type="daily" />
<NutritionSummary summary={weeklySummary} type="weekly" />
```

## 🔧 Customization

### Tailwind Colors
Module sử dụng các custom colors trong `tailwind.config.js`:

```javascript
colors: {
  primary: '#3B82F6',
  'primary-light': '#60A5FA',
  'bg-blue': '#EFF6FF',
  'bg-green': '#F0FDF4',
  'bg-orange': '#FFF7ED',
  'bg-yellow': '#FEFCE8',
  'bg-purple': '#FAF5FF',
  'bg-pink': '#FDF2F8',
  'bg-teal': '#F0FDFA',
  'yellow': '#FEF3C7',
  'yellow-light': '#FFFBEB'
}
```

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Error**
   - Kiểm tra `VITE_API_URL` trong `.env`
   - Đảm bảo backend đang chạy

2. **Import Error**
   - Kiểm tra path imports
   - Đảm bảo tất cả dependencies đã install

3. **Encoding Issues**
   - Đảm bảo files được save với UTF-8 encoding
   - Kiểm tra Vietnamese text hiển thị đúng

## 📝 Development Notes

- **Pet ID**: Hiện tại hardcode là `1`, cần thay bằng user context
- **Mock Data**: Pets data đang dùng mock, cần thay bằng API thực
- **Authentication**: Admin routes chưa có authentication guard
- **Error Handling**: Cần thêm global error boundary

## 🚧 TODO

- [ ] Thêm authentication cho admin routes
- [ ] Implement user context cho petId
- [ ] Thêm unit tests
- [ ] Optimize re-renders
- [ ] Add loading skeletons
- [ ] Implement error boundaries
- [ ] Add analytics tracking

## 📞 Support

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console logs
2. Kiểm tra network tab
3. Xem lại documentation
4. Contact dev team

---

**Version**: 1.0.0  
**Last Updated**: December 2024  
**Author**: Nutrition Module Team