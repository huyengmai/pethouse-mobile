import { Edit3, Trash2, Calendar, Weight, Tag } from 'lucide-react';

const PetCard = ({ pet, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all group relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-50 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110" />

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold text-[--primary] mb-1">{pet.name}</h3>
            <span className="px-3 py-1 bg-blue-50 text-[--primary] text-xs font-bold rounded-full uppercase tracking-wider border border-blue-100 flex items-center gap-1 w-fit">
              <Tag size={12} /> {pet.species}
            </span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(pet)}
              className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
            >
              <Edit3 size={18} />
            </button>
            <button 
              onClick={() => onDelete(pet.id)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600 gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
              <Calendar size={16} className="text-gray-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 leading-none">Ngày sinh</p>
              <p className="font-semibold">{pet.birthDate || 'Chưa cập nhật'}</p>
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600 gap-3">
            <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center">
              <Weight size={16} className="text-gray-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-gray-400 leading-none">Cân nặng</p>
              <p className="font-semibold">{pet.weight} kg</p>
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-dashed border-gray-100">
          <p className="text-sm font-medium text-gray-500">
            Giống: <span className="text-[--primary] font-bold">{pet.breed || 'N/A'}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PetCard;