import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { authHelpers } from '../../../api/authApi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Calendar, Activity, FileText, Syringe, ImageIcon, X, Loader2, Eye, Trash2, History, LogIn } from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios';
import { healthService } from '../services/healthService';
import { profileService } from '../../petsprofile_hoa/services/profileService';

const CLOUD_NAME = "dyje3qmb5"; 
const UPLOAD_PRESET = "pethouse_upload";

const WeightHistoryModal = ({ weights, onClose, onDelete }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl animate-in zoom-in duration-200 flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2"><History size={18}/> Lịch sử cân nặng</h3>
          <button onClick={onClose}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
        </div>
        <div className="p-4 overflow-y-auto flex-1 space-y-2">
          {weights.length === 0 && <p className="text-center text-slate-400 italic">Chưa có dữ liệu.</p>}
          {weights.map((w) => (
            <div key={w.id} className="flex justify-between items-center p-3 bg-white border rounded-lg hover:bg-slate-50">
              <div>
                <span className="font-bold text-rose-500 text-lg">{w.weight} kg</span>
                <p className="text-xs text-slate-500">{w.dateFormatted}</p>
              </div>
              <button onClick={() => onDelete(w.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Xóa">
                <Trash2 size={18}/>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const RecordDetailModal = ({ record, onClose, onDelete }) => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttachments = async () => {
      try {
        const res = await healthService.getAttachments(record.id);
        setAttachments(res.data);
      } catch (err) { 
        console.error("Error fetching attachments:", err);
      } finally { 
        setLoading(false); 
      }
    };
    if (record) fetchAttachments();
  }, [record]);

  if (!record) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex justify-between items-start sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-xl font-bold text-slate-800">{record.title}</h3>
            <p className="text-slate-500 text-sm flex items-center gap-2 mt-1">
              <Calendar size={14}/> {format(new Date(record.visitDate), 'dd/MM/yyyy')}
              <span className="px-2 py-0.5 bg-green-100 text-green-600 rounded-full text-xs font-bold">{record.status || 'Hoàn thành'}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full"><X size={20}/></button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-semibold text-slate-700 mb-2">Chẩn đoán</h4>
              <p className="text-slate-600 text-sm whitespace-pre-line">{record.diagnosis || "Chưa có thông tin"}</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <h4 className="font-semibold text-slate-700 mb-2">Điều trị / Thuốc</h4>
              <p className="text-slate-600 text-sm whitespace-pre-line">{record.treatment || "Chưa có thông tin"}</p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2"><ImageIcon size={18} className="text-rose-500"/> Hình ảnh đính kèm</h4>
            {loading ? <Loader2 className="animate-spin text-rose-500"/> : attachments.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {attachments.map((att) => (
                  <a key={att.id} href={att.fileUrl} target="_blank" rel="noreferrer" className="aspect-square rounded-xl overflow-hidden border border-slate-200 cursor-pointer block hover:opacity-90">
                    <img src={att.fileUrl} alt="medical" className="w-full h-full object-cover"/>
                  </a>
                ))}
              </div>
            ) : <p className="text-slate-400 text-sm italic">Không có hình ảnh.</p>}
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl flex justify-between">
          <button onClick={() => onDelete(record.id)} className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors flex items-center gap-2">
            <Trash2 size={18}/> Xóa hồ sơ này
          </button>
          <button onClick={onClose} className="px-5 py-2 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 font-medium transition-colors">Đóng</button>
        </div>
      </div>
    </div>
  );
};

const WeightChartSection = ({ petId }) => {
  const [weights, setWeights] = useState([]);
  const [newWeight, setNewWeight] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const fetchWeights = useCallback(async () => {
    try {
      const res = await healthService.getWeights(petId);
      const data = res.data.map(item => ({
        ...item, 
        dateFormatted: item.measuredAt ? format(new Date(item.measuredAt), 'dd/MM') : 'N/A'
      }));
      setWeights(data);
    } catch (err) {
      console.error(err);
    }
  }, [petId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchWeights();
  }, [fetchWeights]);

  const handleAddWeight = async () => {
    if (!newWeight) return;
    try {
      await healthService.addWeight(petId, { 
        weight: parseFloat(newWeight), 
        measuredAt: new Date().toISOString().split('T')[0] 
      });
      setNewWeight('');
      fetchWeights();
    } catch {
      alert('Lỗi thêm cân nặng');
    }
  };

  const handleDeleteWeight = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa lần cân này?")) return;
    try {
      await healthService.deleteWeight(id);
      fetchWeights();
    } catch {
      alert("Lỗi khi xóa");
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full flex flex-col relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <Activity className="text-rose-500" size={24} /> Biểu đồ cân nặng
        </h3>
        <button 
          onClick={() => setShowHistory(true)} 
          className="text-slate-400 hover:text-rose-500 transition-colors" 
          title="Xem lịch sử & Xóa"
        >
          <History size={20}/>
        </button>
      </div>
      
      <div className="flex gap-2 mb-4">
        <input 
          type="number" 
          placeholder="Nhập số kg..." 
          value={newWeight} 
          onChange={(e) => setNewWeight(e.target.value)} 
          className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-rose-200 outline-none" 
        />
        <button 
          onClick={handleAddWeight} 
          className="bg-rose-500 hover:bg-rose-600 text-white px-4 rounded-lg transition-colors"
        >
          <Plus size={20} />
        </button>
      </div>

      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={weights}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="dateFormatted" stroke="#94a3b8" tick={{fontSize: 12}} />
            <YAxis stroke="#94a3b8" tick={{fontSize: 12}} domain={['auto', 'auto']} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Line 
              type="monotone" 
              dataKey="weight" 
              stroke="#f43f5e" 
              strokeWidth={3} 
              dot={{ r: 4, fill: '#f43f5e', strokeWidth: 2, stroke: '#fff' }} 
              activeDot={{ r: 6 }} 
              isAnimationActive={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {showHistory && (
        <WeightHistoryModal 
          weights={weights} 
          onClose={() => setShowHistory(false)} 
          onDelete={handleDeleteWeight} 
        />
      )}
    </div>
  );
};

const HealthRecordsSection = ({ petId }) => {
  const [records, setRecords] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editingRecordId, setEditingRecordId] = useState(null);
  const [formData, setFormData] = useState({ 
    title: '', 
    diagnosis: '', 
    treatment: '', 
    visitDate: new Date().toISOString().split('T')[0] 
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const fetchRecords = useCallback(async () => {
    try {
      const res = await healthService.getRecords(petId);
      setRecords(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [petId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleFileChange = (e) => {
    setSelectedFiles(prev => [...prev, ...Array.from(e.target.files)]);
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Vui lòng nhập tiêu đề khám');
      return;
    }
    
    setLoading(true);
    try {
      let recordId = editingRecordId;
      let recordResponse = null;
      if (editingRecordId) {
        recordResponse = await healthService.updateRecord(editingRecordId, formData);
      } else {
        recordResponse = await healthService.addRecord(petId, formData);
        recordId = recordResponse.data?.id || recordResponse.data;
      }

      if (!recordId) {
        throw new Error('Không lấy được ID của record. Response: ' + JSON.stringify(recordResponse.data));
      }

      let uploadedCount = 0;
      let failedCount = 0;
      
      if (selectedFiles.length > 0) {
        for (const file of selectedFiles) {
          try {
            const cloudinaryData = new FormData();
            cloudinaryData.append("file", file);
            cloudinaryData.append("upload_preset", UPLOAD_PRESET);
            
            const cloudinaryRes = await axios.post(
              `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
              cloudinaryData
            );
            const fileUrl = cloudinaryRes.data.secure_url;
            uploadedCount++;

            try {
              await healthService.addAttachment(recordId, {
                fileUrl,
                fileName: file.name,
                contentType: file.type,
              });
            } catch (attachErr) {
              console.error("Error saving attachment info:", attachErr);
              failedCount++;
            }
          } catch (uploadErr) {
            console.error("Error uploading file to Cloudinary:", uploadErr);
            failedCount++;
          }
        }
      }

      setShowForm(false);
      setFormData({ 
        title: '', 
        diagnosis: '', 
        treatment: '', 
        visitDate: new Date().toISOString().split('T')[0] 
      });
      setSelectedFiles([]);
      setEditingRecordId(null);
      fetchRecords();
      
      if (selectedFiles.length === 0) {
        alert("Lưu hồ sơ thành công!");
      } else if (failedCount === 0) {
        alert(`Lưu hồ sơ thành công! Đã upload ${uploadedCount} ảnh.`);
      } else {
        alert(`Lưu hồ sơ thành công! Nhưng ${failedCount}/${selectedFiles.length} ảnh upload thất bại.`);
      }
    } catch (err) {
      alert('Lỗi lưu hồ sơ. Vui lòng thử lại. ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startEditRecord = (rec) => {
    setFormData({
      title: rec.title || '',
      diagnosis: rec.diagnosis || '',
      treatment: rec.treatment || '',
      visitDate: rec.visitDate || new Date().toISOString().split('T')[0]
    });
    setSelectedFiles([]);
    setEditingRecordId(rec.id);
    setShowForm(true);
    setSelectedRecord(null);
  };

  const handleDeleteRecord = async (id) => {
    if (!window.confirm("CẢNH BÁO: Bạn có chắc chắn muốn xóa hồ sơ khám này không?")) return;
    try {
      await healthService.deleteRecord(id);
      setSelectedRecord(null);
      fetchRecords();
    } catch {
      alert("Lỗi khi xóa hồ sơ");
    }
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-rose-500" size={24} /> Sổ khám bệnh
          </h3>
          <button 
            onClick={() => {
              if (showForm) {
                setEditingRecordId(null);
                setSelectedFiles([]);
                setFormData({ title: '', diagnosis: '', treatment: '', visitDate: new Date().toISOString().split('T')[0] });
              }
              setShowForm(!showForm);
            }} 
            className="flex items-center gap-2 text-rose-600 font-medium hover:bg-rose-50 px-4 py-2 rounded-lg transition-colors"
          >
            {showForm ? 'Hủy bỏ' : (editingRecordId ? 'Hủy sửa' : '+ Thêm hồ sơ')}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 bg-slate-50 p-6 rounded-xl border border-rose-100 animate-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tiêu đề</label>
                <input 
                  type="text" 
                  required 
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-rose-200 outline-none" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  placeholder="VD: Khám định kỳ..." 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Ngày khám</label>
                <input 
                  type="date" 
                  required 
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-rose-200 outline-none" 
                  value={formData.visitDate} 
                  onChange={e => setFormData({...formData, visitDate: e.target.value})} 
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Chẩn đoán</label>
              <textarea 
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-rose-200 outline-none" 
                rows="2" 
                value={formData.diagnosis} 
                onChange={e => setFormData({...formData, diagnosis: e.target.value})}
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-1">Điều trị / Thuốc</label>
              <textarea 
                className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-rose-200 outline-none" 
                rows="2" 
                value={formData.treatment} 
                onChange={e => setFormData({...formData, treatment: e.target.value})}
                placeholder="Tên thuốc, liều dùng, hướng dẫn..."
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">Hình ảnh</label>
              <div className="flex flex-wrap gap-4">
                <label className="w-20 h-20 flex flex-col items-center justify-center border-2 border-dashed border-rose-300 rounded-lg cursor-pointer hover:bg-rose-50 transition-colors">
                  <ImageIcon className="text-rose-400" size={20} />
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                </label>
                {selectedFiles.map((file, index) => (
                  <div key={index} className="relative w-20 h-20 group">
                    <img 
                      src={URL.createObjectURL(file)} 
                      alt="preview" 
                      className="w-full h-full object-cover rounded-lg border" 
                    />
                    <button 
                      type="button" 
                      onClick={() => removeFile(index)} 
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-0.5 rounded-full opacity-0 group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-rose-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-600 flex items-center gap-2 disabled:bg-rose-300"
            >
              {loading ? 'Đang lưu...' : editingRecordId ? 'Cập nhật hồ sơ' : 'Lưu hồ sơ'}
            </button>
          </form>
        )}

        <div className="space-y-4 relative border-l-2 border-slate-100 ml-3 pl-8 py-2">
          {records.length === 0 && <p className="text-slate-400 italic">Chưa có lịch sử khám.</p>}
          {records.map((rec) => (
            <div key={rec.id} className="relative group">
              <div className="absolute -left-[41px] top-0 bg-white border-4 border-rose-100 rounded-full p-1">
                <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
              </div>
              
              <div 
                onClick={() => setSelectedRecord(rec)} 
                className="bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md hover:border-rose-200 transition-all cursor-pointer relative pr-10"
              >
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    startEditRecord(rec); 
                  }} 
                  className="absolute top-4 right-10 text-slate-300 hover:text-amber-500 transition-colors p-1"
                  title="Chỉnh sửa hồ sơ"
                >
                  ✎
                </button>
                <button 
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    handleDeleteRecord(rec.id); 
                  }} 
                  className="absolute top-4 right-4 text-slate-300 hover:text-red-500 transition-colors p-1"
                  title="Xóa hồ sơ"
                >
                  <Trash2 size={18} />
                </button>

                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-lg text-slate-800">{rec.title}</h4>
                </div>
                <p className="text-sm text-slate-500 flex items-center gap-1 mb-2">
                  <Calendar size={14} /> {format(new Date(rec.visitDate), 'dd/MM/yyyy')}
                </p>
                <div className="flex items-center gap-2 text-rose-500 text-sm font-medium">
                  <Eye size={16}/> Xem chi tiết
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedRecord && (
        <RecordDetailModal 
          record={selectedRecord} 
          onClose={() => setSelectedRecord(null)} 
          onDelete={handleDeleteRecord} 
        />
      )}
    </>
  );
};

const VaccineScheduleSection = () => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-full">
      <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
        <Syringe className="text-rose-500" size={24} /> Lịch trình
      </h3>
      <div className="mt-4 text-slate-400 text-sm">Tính năng đang phát triển...</div>
    </div>
  );
};

const HealthPage = () => {
  const { id } = useParams();
  const petId = id; 
  const navigate = useNavigate();
  const isAuthenticated = authHelpers.isAuthenticated();
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(false);
  const [petError, setPetError] = useState(null);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <LogIn size={40} className="text-rose-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-3">Vui lòng đăng nhập</h2>
          <p className="text-slate-500 mb-6">
            Bạn cần đăng nhập để theo dõi sức khỏe thú cưng của mình.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 bg-rose-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-rose-600 transition-all shadow-lg w-full"
          >
            <LogIn size={20} /> ĐĂNG NHẬP NGAY
          </Link>
          <p className="text-slate-400 text-sm mt-4">
            Chưa có tài khoản? <Link to="/register" className="text-rose-500 font-semibold hover:underline">Đăng ký</Link>
          </p>
        </div>
      </div>
    );
  }

  // Nếu chưa có petId trên URL, tải danh sách pet để chọn/redirect
  useEffect(() => {
    if (petId) return;
    const fetchPets = async () => {
      setLoadingPets(true);
      try {
        const res = await profileService.getMyPets();
        const list = Array.isArray(res) ? res : (res?.data || []);
        setPets(list);
        if (list.length === 1) {
          navigate(`/health/${list[0].id}`, { replace: true });
        }
      } catch (err) {
        console.error(err);
        setPetError('Không tải được danh sách thú cưng');
      } finally {
        setLoadingPets(false);
      }
    };
    fetchPets();
  }, [petId, navigate]);

  if (!petId) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 px-4">
        <div className="max-w-3xl mx-auto text-center space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h1 className="text-2xl font-bold text-slate-900">Chọn thú cưng để xem sổ sức khỏe</h1>
          {loadingPets && <p className="text-slate-500">Đang tải danh sách thú cưng...</p>}
          {petError && <p className="text-red-500">{petError}</p>}
          {!loadingPets && pets.length === 0 && <p className="text-slate-500">Bạn chưa có thú cưng nào.</p>}
          <div className="grid sm:grid-cols-2 gap-4">
            {pets.map((pet) => (
              <button
                key={pet.id}
                onClick={() => navigate(`/health/${pet.id}`)}
                className="p-4 rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow transition text-left bg-white"
              >
                <div className="font-semibold text-slate-800">{pet.name}</div>
                <div className="text-sm text-slate-500 capitalize">{pet.species || 'Pet'}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Sức khỏe thú cưng</h1>
          <p className="text-slate-500">Theo dõi cân nặng, lịch sử khám bệnh và hồ sơ y tế.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-6">
            <WeightChartSection petId={petId} />
            <VaccineScheduleSection />
          </div>
          <div className="lg:col-span-2">
            <HealthRecordsSection petId={petId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthPage;
