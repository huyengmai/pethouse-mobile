import React, { useState, useEffect } from 'react';
import { authHelpers } from '../../../api/authApi';
import { API_BASE_URL } from '../../../config/api';

const UserManagement = () => {
  // --- STATES ---
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [inputPage, setInputPage] = useState("1");
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // --- API CALLS ---
  const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = authHelpers.getAccessToken();
        if (!token) {
          setError("Vui lòng đăng nhập để tiếp tục");
          setIsLoading(false);
          return;
        }

        const params = new URLSearchParams({ page, size: 20 });
        if (search) params.append('keyword', search);

        const res = await fetch(`${API_BASE_URL}/admin/users?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (res.status === 401) {
          setError("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
          return;
        }
        if (res.status === 403) {
          setError("Bạn không có quyền truy cập trang này. Chỉ Admin mới được phép.");
          return;
        }
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Không thể tải dữ liệu");
        }

        const data = await res.json();
        setUsers(data.content || []);
        setTotalPages(data.totalPages || 0);
        setInputPage((page + 1).toString());
      } catch (err) {
        console.error("Lỗi tải danh sách:", err);
        if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
          setError("Không thể kết nối tới server. Vui lòng kiểm tra backend đang chạy.");
        } else {
          setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
        }
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);
  const handleSearchTrigger = () => {
      setPage(0);
      setSearch(searchTerm);
    };


  const handleSave = async (e) => {
      e.preventDefault();
      setIsProcessing(true);
      try {
        const token = authHelpers.getAccessToken();
        const res = await fetch(`${API_BASE_URL}/admin/users/${editingUser.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(editingUser)
        });
        if (res.ok) {
          setEditingUser(null);
          fetchUsers();
        }
      } finally {
        setIsProcessing(false);
      }
    };


const confirmDelete = async () => {
      setIsProcessing(true);
      try {
        const token = authHelpers.getAccessToken();
        const res = await fetch(`${API_BASE_URL}/admin/users/${deletingUser.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          setDeletingUser(null);
          fetchUsers();
        }
      } finally {
        setIsProcessing(false);
      }
    };

  const handleToggleStatus = async (userId) => {
      try {
        const token = authHelpers.getAccessToken();
        const res = await fetch(`${API_BASE_URL}/admin/users/${userId}/toggle-status`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) fetchUsers();
      } catch (err) {
        console.error("Lỗi toggle:", err);
      }
    };
  const Spinner = () => <div style={spinnerStyle}></div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      
      {/* --- HEADER --- */}
      <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', marginBottom: '40px' }}>
        <div style={navGroupStyle}>
          <button onClick={() => setPage(p => Math.max(0, p - 1))} style={navBtnStyle}>{"<"}</button>
          <div style={pageBoxStyle}>
            <input 
              value={inputPage} 
              onChange={e => setInputPage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && setPage(Math.min(totalPages-1, Math.max(0, parseInt(e.target.value)-1)))}
              style={pageInputStyle} 
            />
            <span>/ {totalPages || 1}</span>
          </div>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} style={navBtnStyle}>{">"}</button>
        </div>
        
        <div style={{ position: 'absolute', right: 0, display: 'flex', alignItems: 'center' }}>
          <input 
            placeholder="Tìm tên, email, thú cưng..." 
            style={searchStyle}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearchTrigger()}
          />
          <div onClick={handleSearchTrigger} style={searchIconWrapperStyle}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div style={errorStyle}>
          {error}
          <button onClick={fetchUsers} style={retryBtnStyle}>Thử lại</button>
        </div>
      )}

      {/* --- LOADING --- */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spinner />
          <p style={{ color: '#64748B', marginTop: '10px' }}>Đang tải...</p>
        </div>
      )}

      {/* --- EMPTY STATE --- */}
      {!isLoading && !error && users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
          Không có người dùng nào
        </div>
      )}

      {/* --- GRID USER --- */}
      {!isLoading && !error && users.length > 0 && (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
        {users.map(u => (
          <div key={u.id} style={cardStyle}>
            
            {/* TOGGLE MINIMAL (Chỉ màu và Animation) */}
            <div 
                onClick={() => handleToggleStatus(u.id)} 
                style={{ 
                    ...toggleContainerStyle, 
                    backgroundColor: u.isActive ? '#6DBB6F' : '#CBD5E0' 
                }}
            >
              <div style={{ 
                  ...toggleCircleStyle, 
                  transform: u.isActive ? 'translateX(22px)' : 'translateX(0px)' 
              }}></div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
              <div style={avatarStyle}>{u.username ? u.username[0].toUpperCase() : '?'}</div>
              <div>
                <h3 style={{ margin: '0 0 5px 0', color: u.isActive ? '#1E293B' : '#64748B' }}>
                  {u.fullName || 'N/A'} {!u.isActive && <span style={{fontSize: '11px', color: '#EF4444'}}>(LOCKED)</span>}
                </h3>
                <p style={detailStyle}>📧 {u.email}</p>
                <p style={detailStyle}>🆔 @{u.username}</p>
              </div>
            </div>

            <div style={btnAreaStyle}>
              <button onClick={() => setEditingUser(u)} style={editBtnStyle}>CHỈNH SỬA</button>
              <button onClick={() => setDeletingUser(u)} style={delBtnStyle}>XÓA</button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* --- MODALS --- */}
      {editingUser && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2 style={{ textAlign: 'center', marginBottom: '25px' }}>Chỉnh sửa</h2>
            <form onSubmit={handleSave}>
              <div style={formGroupStyle}><label>Họ tên</label>
                <input disabled={isProcessing} value={editingUser.fullName || ''} onChange={e => setEditingUser({...editingUser, fullName: e.target.value})} style={inputStyle} />
              </div>
              <div style={formGroupStyle}><label>Email</label>
                <input disabled={isProcessing} value={editingUser.email || ''} onChange={e => setEditingUser({...editingUser, email: e.target.value})} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                <button type="button" disabled={isProcessing} onClick={() => setEditingUser(null)} style={cancelBtnStyle}>HỦY</button>
                <button type="submit" disabled={isProcessing} style={saveBtnStyle}>{isProcessing ? <Spinner /> : "LƯU"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingUser && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, width: '400px', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 15px 0' }}>Xác nhận xóa</h3>
            <p>Bạn có muốn xóa người dùng <strong>{deletingUser.username}</strong> và các dữ liệu liên quan?</p>
            <div style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
              <button disabled={isProcessing} onClick={() => setDeletingUser(null)} style={cancelBtnStyle}>HỦY</button>
              <button disabled={isProcessing} onClick={confirmDelete} style={{ ...saveBtnStyle, background: '#EF4444' }}>
                {isProcessing ? <Spinner /> : "XÁC NHẬN"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// --- STYLES ---
const navGroupStyle = { display: 'flex', alignItems: 'center', gap: '15px', background: 'white', padding: '10px 25px', borderRadius: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' };
const pageBoxStyle = { display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800' };
const pageInputStyle = { width: '45px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '8px', padding: '4px', outline: 'none' };
const navBtnStyle = { border: 'none', background: '#f0f2f5', width: '35px', height: '35px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold' };
const searchStyle = { padding: '12px 45px 12px 25px', borderRadius: '50px', border: '1px solid #ddd', width: '280px', outline: 'none' };
const searchIconWrapperStyle = { position: 'absolute', right: '15px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const cardStyle = { background: 'white', padding: '25px', borderRadius: '25px', boxShadow: '0 8px 20px rgba(0,0,0,0.03)', border: '1px solid #f0f0f0', position: 'relative' };
const avatarStyle = { width: '65px', height: '65px', borderRadius: '20px', background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 'bold' };
const detailStyle = { margin: '4px 0', color: '#64748B', fontSize: '14px' };
const btnAreaStyle = { display: 'flex', gap: '12px', marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #F1F5F9' };
const errorStyle = { background: '#FEE2E2', color: '#DC2626', padding: '20px', borderRadius: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const retryBtnStyle = { background: '#DC2626', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };

// STYLE TOGGLE MINIMAL
const toggleContainerStyle = { 
    position: 'absolute', 
    top: '20px', 
    right: '20px', 
    width: '48px', // Giảm chiều rộng cho gọn vì không có chữ
    height: '26px', 
    borderRadius: '20px', 
    cursor: 'pointer', 
    display: 'flex', 
    alignItems: 'center', 
    transition: 'background-color 0.3s ease',
    padding: '0 2px',
    boxSizing: 'border-box'
};

const toggleCircleStyle = { 
    width: '22px', 
    height: '22px', 
    backgroundColor: 'white', 
    borderRadius: '50%', 
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
};

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' };
const modalContentStyle = { backgroundColor: 'white', padding: '40px', borderRadius: '30px', width: '450px' };
const formGroupStyle = { marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '8px' };
const inputStyle = { padding: '12px', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' };
const editBtnStyle = { flex: 1, padding: '12px', border: 'none', borderRadius: '12px', background: '#3B82F6', color: 'white', fontWeight: 'bold', cursor: 'pointer' };
const delBtnStyle = { flex: 1, padding: '12px', border: 'none', borderRadius: '12px', background: '#FEE2E2', color: '#EF4444', fontWeight: 'bold', cursor: 'pointer' };
const saveBtnStyle = { flex: 1, padding: '15px', border: 'none', borderRadius: '15px', background: '#10B981', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center' };
const cancelBtnStyle = { flex: 1, padding: '15px', border: 'none', borderRadius: '15px', background: '#F1F5F9', color: '#64748B', fontWeight: 'bold', cursor: 'pointer' };
const spinnerStyle = { width: '20px', height: '20px', border: '3px solid rgba(255,255,255,0.3)', borderTop: '3px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' };

export default UserManagement;