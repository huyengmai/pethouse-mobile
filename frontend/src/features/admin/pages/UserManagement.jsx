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

      const params = new URLSearchParams({ page, size: 10 }); // Giảm số lượng item mỗi trang trên mobile xuống 10 cho mượt
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
    <div style={{ padding: '16px', fontFamily: 'Arial, sans-serif', backgroundColor: '#F8FAFC', minHeight: '100vh', boxSizing: 'border-box' }}>

      {/* --- MOBILE SEARCH BAR --- */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <input
          placeholder="Tìm tên, email, thú cưng..."
          style={searchStyle}
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearchTrigger()}
        />
        <div onClick={handleSearchTrigger} style={searchIconWrapperStyle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div style={errorStyle}>
          <span style={{ fontSize: '14px', flex: 1, marginRight: '10px' }}>{error}</span>
          <button onClick={fetchUsers} style={retryBtnStyle}>Thử lại</button>
        </div>
      )}

      {/* --- LOADING --- */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spinner />
          <p style={{ color: '#64748B', marginTop: '10px', fontSize: '14px' }}>Đang tải...</p>
        </div>
      )}

      {/* --- EMPTY STATE --- */}
      {!isLoading && !error && users.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748B', fontSize: '14px' }}>
          Không có người dùng nào
        </div>
      )}

      {/* --- LIST USER (Mobile Optimized 1 Column) --- */}
      {!isLoading && !error && users.length > 0 && (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '80px' }}>
        {users.map(u => (
          <div key={u.id} style={cardStyle}>

            {/* TOGGLE MINIMAL */}
            <div
                onClick={() => handleToggleStatus(u.id)}
                style={{
                    ...toggleContainerStyle,
                    backgroundColor: u.isActive ? '#6DBB6F' : '#CBD5E0'
                }}
            >
              <div style={{
                  ...toggleCircleStyle,
                  transform: u.isActive ? 'translateX(18px)' : 'translateX(0px)'
              }}></div>
            </div>

            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={avatarStyle}>{u.username ? u.username[0].toUpperCase() : '?'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ margin: '0 0 4px 0', color: u.isActive ? '#1E293B' : '#64748B', fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {u.fullName || 'N/A'} {!u.isActive && <span style={{fontSize: '10px', color: '#EF4444', fontWeight: 'bold'}}>(LOCKED)</span>}
                </h3>
                <p style={detailStyle}>📧 {u.email}</p>
                <p style={detailStyle}>🆔 @{u.username}</p>
              </div>
            </div>

            <div style={btnAreaStyle}>
              <button onClick={() => setEditingUser(u)} style={editBtnStyle}>SỬA</button>
              <button onClick={() => setDeletingUser(u)} style={delBtnStyle}>XÓA</button>
            </div>
          </div>
        ))}
      </div>
      )}

      {/* --- BOTTOM NAVIGATION / PAGINATION --- */}
      {!isLoading && !error && totalPages > 0 && (
        <div style={bottomNavWrapperStyle}>
          <div style={navGroupStyle}>
            <button onClick={() => setPage(p => Math.max(0, p - 1))} style={navBtnStyle}>{"<"}</button>
            <div style={pageBoxStyle}>
              <input
                value={inputPage}
                onChange={e => setInputPage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && setPage(Math.min(totalPages-1, Math.max(0, parseInt(e.target.value)-1)))}
                style={pageInputStyle}
              />
              <span style={{ fontSize: '14px', color: '#64748B' }}>/ {totalPages || 1}</span>
            </div>
            <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} style={navBtnStyle}>{">"}</button>
          </div>
        </div>
      )}

      {/* --- MODALS --- */}
      {editingUser && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ textAlign: 'center', marginBottom: '20px', margin: 0, fontSize: '18px' }}>Chỉnh sửa</h3>
            <form onSubmit={handleSave}>
              <div style={formGroupStyle}><label style={{ fontSize: '13px', color: '#64748B' }}>Họ tên</label>
                <input disabled={isProcessing} value={editingUser.fullName || ''} onChange={e => setEditingUser({...editingUser, fullName: e.target.value})} style={inputStyle} />
              </div>
              <div style={formGroupStyle}><label style={{ fontSize: '13px', color: '#64748B' }}>Email</label>
                <input disabled={isProcessing} value={editingUser.email || ''} onChange={e => setEditingUser({...editingUser, email: e.target.value})} style={inputStyle} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="button" disabled={isProcessing} onClick={() => setEditingUser(null)} style={cancelBtnStyle}>HỦY</button>
                <button type="submit" disabled={isProcessing} style={saveBtnStyle}>{isProcessing ? <Spinner /> : "LƯU"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deletingUser && (
        <div style={modalOverlayStyle}>
          <div style={{ ...modalContentStyle, textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '18px' }}>Xác nhận xóa</h3>
            <p style={{ fontSize: '14px', color: '#475569', margin: '0 0 20px 0' }}>Bạn có muốn xóa người dùng <strong>{deletingUser.username}</strong>?</p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button disabled={isProcessing} onClick={() => setDeletingUser(null)} style={cancelBtnStyle}>HỦY</button>
              <button disabled={isProcessing} onClick={confirmDelete} style={{ ...saveBtnStyle, background: '#EF4444' }}>
                {isProcessing ? <Spinner /> : "XÓA"}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

// --- STYLES (MOBILE OPTIMIZED) ---
const searchStyle = { padding: '10px 40px 10px 16px', borderRadius: '12px', border: '1px solid #E2E8F0', width: '100%', outline: 'none', fontSize: '14px', backgroundColor: 'white', boxSizing: 'border-box' };
const searchIconWrapperStyle = { position: 'absolute', right: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };

const cardStyle = { background: 'white', padding: '16px', borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', border: '1px solid #E2E8F0', position: 'relative' };
const avatarStyle = { width: '48px', height: '48px', borderRadius: '12px', background: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold', flexShrink: 0 };
const detailStyle = { margin: '2px 0', color: '#64748B', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const btnAreaStyle = { display: 'flex', gap: '10px', marginTop: '14px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' };

const errorStyle = { background: '#FEE2E2', color: '#DC2626', padding: '12px 16px', borderRadius: '12px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const retryBtnStyle = { background: '#DC2626', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '12px' };

// CO CỤM TOGGLE PHÙ HỢP HƠN TRÊN MOBILE
const toggleContainerStyle = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    width: '42px',
    height: '24px',
    borderRadius: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    transition: 'background-color 0.3s ease',
    padding: '0 2px',
    boxSizing: 'border-box'
};

const toggleCircleStyle = {
    width: '18px',
    height: '18px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
};

// ĐƯA PHÂN TRANG XUỐNG DƯỚI ĐỂ DỄ BẤM BẰNG 1 TAY
const bottomNavWrapperStyle = { position: 'fixed', bottom: 0, left: 0, right: 0, display: 'flex', justifyContent: 'center', padding: '12px', backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(8px)', borderTop: '1px solid #E2E8F0', zIndex: 900 };
const navGroupStyle = { display: 'flex', alignItems: 'center', gap: '16px', background: 'white', padding: '8px 20px', borderRadius: '50px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' };
const pageBoxStyle = { display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700' };
const pageInputStyle = { width: '36px', textAlign: 'center', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '2px', outline: 'none', fontSize: '14px' };
const navBtnStyle = { border: 'none', background: '#F1F5F9', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' };

const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, backdropFilter: 'blur(4px)', padding: '16px' };
const modalContentStyle = { backgroundColor: 'white', padding: '24px', borderRadius: '20px', width: '100%', maxWidth: '340px', boxSizing: 'border-box' };
const formGroupStyle = { marginBottom: '12px', display: 'flex', flexDirection: 'column', gap: '6px' };
const inputStyle = { padding: '10px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '14px' };
const editBtnStyle = { flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: '#3B82F6', color: 'white', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' };
const delBtnStyle = { flex: 1, padding: '10px', border: 'none', borderRadius: '8px', background: '#FEE2E2', color: '#EF4444', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' };
const saveBtnStyle = { flex: 1, padding: '12px', border: 'none', borderRadius: '10px', background: '#10B981', color: 'white', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', fontSize: '14px' };
const cancelBtnStyle = { flex: 1, padding: '12px', border: 'none', borderRadius: '10px', background: '#F1F5F9', color: '#64748B', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' };
const spinnerStyle = { width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%', animation: 'spin 0.8s linear infinite' };

export default UserManagement;