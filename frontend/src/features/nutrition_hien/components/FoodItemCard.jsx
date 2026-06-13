export default function FoodItemCard({ foodItem, onDelete }) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-primary/30 transition-all">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h4 className="font-bold text-primary text-lg mb-1">
            {foodItem.foodName}
          </h4>
          <p className="text-sm text-gray-500">
            {foodItem.quantity} {foodItem.unit}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary mb-1">
            {foodItem.calories} 
            <span className="text-sm font-normal text-gray-500 ml-1">cal</span>
          </div>
          {onDelete && (
            <button
              onClick={() => onDelete(foodItem.id)}
              className="text-xs text-red-500 hover:text-red-700 font-semibold"
            >
              Xóa
            </button>
          )}
        </div>
      </div>

      {/* Nutrition Info */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-200">
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Protein</div>
          <div className="font-bold text-primary text-sm">
            {foodItem.protein || 0}g
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Fat</div>
          <div className="font-bold text-primary text-sm">
            {foodItem.fat || 0}g
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500 mb-1">Carbs</div>
          <div className="font-bold text-primary text-sm">
            {foodItem.carbs || 0}g
          </div>
        </div>
      </div>
    </div>
  );
}