import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { diaryApi, fixImageUrl } from '../services/diaryApi';
import { format } from 'date-fns';
import DiarySearchBar from '../components/DiarySearchBar';
import { authHelpers } from '../../../api/authApi';

// --- PETMANIA STYLES CONFIG ---
const theme = {
    colors: {
        primary: '#1B3A4B',      // Xanh đậm
        secondary: '#FFD93D',    // Vàng
        white: '#ffffff',
        bgLight: '#F7FBFC',      // Nền sáng
        gray: '#6B7280',
        danger: '#E91E63',       // Hồng đậm
        dangerBg: '#FCE4EC',
        success: '#2D6A4F',      // Xanh lá đậm
        cardShadow: '0 20px 50px rgba(0,0,0,0.05)',
        hoverShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },
    fonts: {
        header: "'Fredoka', sans-serif",
        body: "'Nunito', sans-serif",
    }
};

const AlbumDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAuthenticated = authHelpers.isAuthenticated();
    
    // States chính
    const [album, setAlbum] = useState(null);
    const [diaries, setDiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [foundDiaries, setFoundDiaries] = useState([]);
    const [uploadingCover, setUploadingCover] = useState(false);

    // ✅ CHỨC NĂNG SỬA ALBUM: State quản lý chỉnh sửa
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ title: '', description: '' });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const loadDetail = async () => {
            if (!isAuthenticated) return;

            try {
                setLoading(true);
                const [albumRes, diariesRes] = await Promise.all([
                    diaryApi.getAlbumById(id),
                    diaryApi.getDiariesByAlbum(id)
                ]);
                
                setAlbum(albumRes.data);
                const diariesData = diariesRes.data || [];
                setDiaries(Array.isArray(diariesData) ? diariesData : []);
                
            } catch (error) {
                console.error("Error loading album:", error);
                alert("Không tìm thấy album hoặc có lỗi xảy ra");
                navigate('/diary');
            } finally {
                setLoading(false);
            }
        };
        loadDetail();
    }, [id, navigate, isAuthenticated]); 

    // ✅ Xử lý khi nhấn nút "Sửa Album"
    const handleStartEdit = () => {
        setEditForm({
            title: album.title,
            description: album.description || ''
        });
        setIsEditing(true);
    };

    // ✅ Xử lý Lưu thông tin album
    const handleUpdateAlbum = async () => {
        if (!editForm.title.trim()) {
            alert("Tiêu đề album không được để trống!");
            return;
        }

        try {
            setIsSaving(true);
            const res = await diaryApi.updateAlbum(id, editForm);
            setAlbum(res.data); // Cập nhật lại UI với dữ liệu mới
            setIsEditing(false); // Thoát chế độ sửa
            alert("Cập nhật album thành công!");
        } catch (error) {
            console.error("Error updating album:", error);
            alert("Lỗi khi cập nhật album: " + (error.response?.data?.message || error.message));
        } finally {
            setIsSaving(false);
        }
    };

    const handleLocalSearch = async ({ keyword, startDate, endDate }) => {
        if (!keyword && !startDate && !endDate) {
            setIsSearching(false);
            return;
        }

        try {
            setLoading(true); 
            const res = await diaryApi.searchDiaries({
                albumId: id,
                keyword,
                startDate,
                endDate
            });
            setFoundDiaries(res.data || []);
            setIsSearching(true);
        } catch (error) {
            console.error("Lỗi tìm kiếm nội bộ:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAlbum = async () => {
        if(window.confirm("Bạn có chắc muốn xóa album này? Mọi nhật ký bên trong sẽ bị xóa vĩnh viễn!")) {
            try {
                await diaryApi.deleteAlbum(id);
                alert("Xóa album thành công!");
                navigate('/diary');
            } catch (error) {
                console.error('Error deleting album:', error);
                alert("Lỗi khi xóa album: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const handleUploadCover = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
            alert("Vui lòng chọn file ảnh!");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            alert("Kích thước file không được vượt quá 5MB!");
            return;
        }
        try {
            setUploadingCover(true);
            const res = await diaryApi.uploadAlbumCover(id, file);
            setAlbum(res.data);
            alert("Cập nhật ảnh bìa thành công!");
        } catch (error) {
            console.error('Error uploading cover:', error);
            alert("Lỗi khi upload ảnh bìa: " + (error.response?.data?.message || error.message));
        } finally {
            setUploadingCover(false);
        }
    };

    const handleDeleteCover = async () => {
        if (!window.confirm("Xóa ảnh bìa album?")) return;
        try {
            setUploadingCover(true);
            const res = await diaryApi.deleteAlbumCover(id);
            setAlbum(res.data);
            alert("Đã xóa ảnh bìa!");
        } catch (error) {
            console.error('Error deleting cover:', error);
            alert("Lỗi khi xóa ảnh bìa: " + (error.response?.data?.message || error.message));
        } finally {
            setUploadingCover(false);
        }
    };

    if (loading && !album) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: theme.colors.primary, fontFamily: theme.fonts.header, fontSize: '1.5rem', backgroundColor: theme.colors.bgLight }}>
                <span style={{ marginRight: '10px' }}>🐕</span> Đang tải dữ liệu...
            </div>
        );
    }

    if (!album) return null; 

    const displayList = isSearching ? foundDiaries : diaries;

    return (
        <div style={{ fontFamily: theme.fonts.body, backgroundColor: theme.colors.bgLight, minHeight: '100vh', paddingBottom: '60px' }}>
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&display=swap');
                    
                    .pet-hover-card { transition: all 0.3s ease; }
                    .pet-hover-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); }
                    
                    .pet-btn-primary { 
                        background: ${theme.colors.secondary}; color: ${theme.colors.primary}; 
                        transition: all 0.3s; display: flex; align-items: center; gap: 8px;
                        text-decoration: none; border: none; padding: 10px 24px; 
                        border-radius: 12px; cursor: pointer; fontSize: 1rem; fontWeight: 700;
                    }
                    .pet-btn-primary:hover { 
                        transform: translateY(-2px); box-shadow: 0 5px 15px rgba(255, 217, 61, 0.4); 
                    }

                    .pet-btn-outline {
                        background: ${theme.colors.white}; color: ${theme.colors.primary}; border: 2px solid ${theme.colors.primary};
                        transition: all 0.3s; display: flex; align-items: center; gap: 8px;
                        padding: 10px 24px; border-radius: 12px; cursor: pointer; fontSize: 1rem; fontWeight: 700;
                    }
                    .pet-btn-outline:hover {
                        background: ${theme.colors.primary}; color: ${theme.colors.white};
                    }
                    
                    .pet-btn-danger {
                        background: ${theme.colors.white}; color: ${theme.colors.danger}; border: 2px solid ${theme.colors.danger};
                        transition: all 0.3s; display: flex; align-items: center; gap: 8px;
                        padding: 10px 24px; border-radius: 12px; cursor: pointer; fontSize: 1rem; fontWeight: 600;
                    }
                    .pet-btn-danger:hover {
                        background: ${theme.colors.danger}; color: ${theme.colors.white};
                    }

                    .pet-back-btn {
                        text-decoration: none; color: ${theme.colors.primary}; font-weight: 700; 
                        font-size: 1rem; display: flex; align-items: center; gap: 8px;
                        background: ${theme.colors.white}; padding: 8px 16px; border-radius: 12px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: all 0.2s;
                    }
                    .pet-back-btn:hover {
                        background: ${theme.colors.primary}; color: ${theme.colors.white};
                    }
                `}
            </style>

            <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '30px 20px' }}>

                {/* --- TOOLBAR / ACTION BAR --- */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
                    <Link to="/diary" className="pet-back-btn">
                        <span>⬅</span> Quay lại danh sách
                    </Link>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        {!isEditing && (
                            <button onClick={handleStartEdit} className="pet-btn-outline">
                                 Sửa Album
                            </button>
                        )}
                        <Link to={`/diary/new?albumId=${id}`} className="pet-btn-primary">
                            <span></span> Viết Nhật Ký
                        </Link>
                        <button onClick={handleDeleteAlbum} className="pet-btn-danger">
                            <span></span> Xóa
                        </button>
                    </div>
                </div>
                
                {/* --- ALBUM INFO BOX --- */}
                <div style={{ 
                    background: theme.colors.white, 
                    padding: '40px', 
                    borderRadius: '24px', 
                    boxShadow: theme.colors.cardShadow, 
                    marginBottom: '40px',
                    border: '1px solid #F3F4F6'
                }}>
                    <div style={{ display: 'flex', gap: '30px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                        
                        {/* Cover Image Section */}
                        <div style={{ flexShrink: 0, position: 'relative' }}>
                            <div style={{ 
                                width: '140px', height: '140px', 
                                borderRadius: '20px', 
                                overflow: 'hidden',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                                border: `4px solid ${theme.colors.bgLight}`,
                                position: 'relative'
                            }}>
                                {album.coverImageUrl ? (
                                    <img 
                                        src={fixImageUrl(album.coverImageUrl)} 
                                        alt={album.title}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: uploadingCover ? 0.5 : 1 }}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/140?text=PetMania'; }}
                                    />
                                ) : (
                                    <div style={{ 
                                        width: '100%', height: '100%', 
                                        background: theme.colors.secondary,
                                        display: 'flex', align_items: 'center', justifyContent: 'center',
                                        fontSize: '50px', color: theme.colors.primary,
                                        opacity: uploadingCover ? 0.5 : 1
                                    }}>
                                        🐾
                                    </div>
                                )}
                            </div>

                            {album.coverImageUrl && (
                                <button
                                    onClick={handleDeleteCover}
                                    disabled={uploadingCover}
                                    style={{
                                        position: 'absolute', top: -10, right: -10,
                                        background: theme.colors.white, color: theme.colors.danger, border: 'none',
                                        borderRadius: '50%', width: '32px', height: '32px',
                                        cursor: uploadingCover ? 'not-allowed' : 'pointer',
                                        fontSize: '18px', display: 'flex', align_items: 'center', justifyContent: 'center',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.15)', zIndex: 2
                                    }}
                                    title="Xóa ảnh bìa"
                                >
                                    ×
                                </button>
                            )}
                            
                            <label style={{
                                display: 'flex', align_items: 'center', justifyContent: 'center', gap: '5px',
                                marginTop: '12px', padding: '8px',
                                background: theme.colors.bgLight, color: theme.colors.primary,
                                borderRadius: '8px', cursor: uploadingCover ? 'not-allowed' : 'pointer',
                                fontSize: '0.8rem', fontWeight: '700', transition: '0.2s'
                            }}>
                                <span>{uploadingCover ? 'Đang tải...' : '🐾 Đổi ảnh bìa'}</span>
                                <input type="file" accept="image/*" onChange={handleUploadCover} disabled={uploadingCover} style={{ display: 'none' }} />
                            </label>
                        </div>
                        
                        {/* Album Details Text / Edit Form */}
                        <div style={{ flex: 1, minWidth: '300px' }}>
                            <div style={{ display: 'inline-block', padding: '6px 12px', background: '#E0F2F1', color: '#00695C', borderRadius: '50px', fontSize: '0.85rem', fontWeight: '700', marginBottom: '10px' }}>
                                Album Nhật Ký
                            </div>

                            {isEditing ? (
                                /* --- GIAO DIỆN CHỈNH SỬA --- */
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <input 
                                        style={{ 
                                            fontSize: '1.5rem', padding: '12px', borderRadius: '12px', 
                                            border: `2px solid ${theme.colors.secondary}`, 
                                            fontFamily: theme.fonts.header, width: '100%',
                                            outline: 'none', color: theme.colors.primary
                                        }}
                                        value={editForm.title}
                                        onChange={e => setEditForm({...editForm, title: e.target.value})}
                                        placeholder="Nhập tên album..."
                                        autoFocus
                                    />
                                    <textarea 
                                        style={{ 
                                            fontSize: '1.1rem', padding: '12px', borderRadius: '12px', 
                                            border: '2px solid #E5E7EB', minHeight: '100px', 
                                            fontFamily: theme.fonts.body, width: '100%',
                                            outline: 'none', color: theme.colors.gray, resize: 'vertical'
                                        }}
                                        value={editForm.description}
                                        onChange={e => setEditForm({...editForm, description: e.target.value})}
                                        placeholder="Thêm mô tả cho album kỷ niệm này..."
                                    />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button 
                                            onClick={handleUpdateAlbum} 
                                            className="pet-btn-primary" 
                                            disabled={isSaving}
                                            style={{ padding: '8px 25px' }}
                                        >
                                            {isSaving ? 'Đang lưu...' : '✅ Lưu Thay Đổi'}
                                        </button>
                                        <button 
                                            onClick={() => setIsEditing(false)} 
                                            className="pet-btn-outline"
                                            style={{ padding: '8px 25px' }}
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                /* --- GIAO DIỆN HIỂN THỊ --- */
                                <>
                                    <h1 style={{ fontFamily: theme.fonts.header, color: theme.colors.primary, fontSize: '2.4rem', marginBottom: '15px', marginTop: 0, lineHeight: 1.2 }}>
                                        {album.title}
                                    </h1>
                                    <p style={{ color: theme.colors.gray, margin: '0 0 20px 0', fontSize: '1.1rem', lineHeight: 1.6, maxWidth: '600px' }}>
                                        {album.description || 'Hãy thêm mô tả cho album để lưu giữ những kỷ niệm đẹp nhất về thú cưng của bạn.'}
                                    </p>
                                    <div style={{ display: 'flex', align_items: 'center', gap: '15px' }}>
                                        <div style={{ color: theme.colors.primary, fontSize: '0.9rem', fontWeight: '600' }}>
                                            📅 Ngày tạo: {album.createdAt ? format(new Date(album.createdAt), 'dd/MM/yyyy') : 'N/A'}
                                        </div>
                                        {album.updatedAt && (
                                            <div style={{ color: theme.colors.gray, fontSize: '0.9rem', fontStyle: 'italic' }}>
                                                (Cập nhật: {format(new Date(album.updatedAt), 'dd/MM/yyyy')})
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- SEARCH BAR --- */}
                <div style={{ marginBottom: '40px' }}>
                    <DiarySearchBar 
                        onSearch={handleLocalSearch} 
                        placeholder={`Tìm kiếm khoảnh khắc trong "${album.title}"...`}
                        showDateFilter={true}
                    />
                </div>

                <div style={{ display: 'flex', align_items: 'center', justifyContent: 'space-between', marginBottom: '25px' }}>
                    <h2 style={{ fontFamily: theme.fonts.header, color: theme.colors.primary, fontSize: '1.8rem', margin: 0 }}>
                        {isSearching ? (
                            <span> Tìm thấy <span style={{color: theme.colors.danger}}>{foundDiaries.length}</span> kết quả</span>
                        ) : (
                            <span> 🐾 Danh sách nhật ký</span>
                        )}
                    </h2>
                </div>

                {/* --- DIARY LIST --- */}
                {displayList.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px 20px', background: theme.colors.white, borderRadius: '24px', border: '2px dashed #E5E7EB' }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}></div>
                        <h3 style={{ fontFamily: theme.fonts.header, color: theme.colors.primary, fontSize: '1.5rem', marginBottom: '10px' }}>
                            {isSearching ? 'Không tìm thấy kết quả' : 'Album này chưa có nhật ký nào'}
                        </h3>
                        <p style={{ fontSize: '1.1rem', color: theme.colors.gray }}>
                            {isSearching ? 'Hãy thử từ khóa hoặc khoảng thời gian khác xem sao.' : 'Hãy bắt đầu viết những dòng nhật ký đầu tiên cho thú cưng của bạn!'}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                        {displayList.map(diary => (
                            <Link 
                                to={`/diary/${diary.entryId}`} 
                                key={diary.entryId} 
                                className="pet-hover-card"
                                style={{ 
                                    textDecoration: 'none', color: 'inherit', background: theme.colors.white, 
                                    borderRadius: '20px', overflow: 'hidden', 
                                    border: '1px solid #F3F4F6',
                                    display: 'flex', flexDirection: 'column',
                                    height: '100%'
                                }}
                            >
                                <div style={{ height: '200px', width: '100%', position: 'relative', overflow: 'hidden', backgroundColor: '#FFF3E0' }}>
                                    {diary.images && diary.images.length > 0 ? (
                                        <img 
                                            src={fixImageUrl(diary.images[0].imageUrl)} 
                                            alt={diary.title}
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=Pet+Moment'; }}
                                        />
                                    ) : (
                                        <div style={{ display: 'flex', height: '100%', align_items: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                                            🐾
                                        </div>
                                    )}
                                    <div style={{ 
                                        position: 'absolute', top: '15px', right: '15px', 
                                        background: 'rgba(255,255,255,0.9)', padding: '6px 12px', 
                                        borderRadius: '12px', fontSize: '0.85rem', fontWeight: '700', color: theme.colors.primary,
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                                    }}>
                                        {diary.entryDate ? format(new Date(diary.entryDate), 'dd/MM') : ''}
                                    </div>
                                </div>
                                <div style={{ padding: '25px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <h3 style={{ fontFamily: theme.fonts.header, fontSize: '1.25rem', marginBottom: '10px', color: theme.colors.primary, marginTop: 0, lineHeight: 1.4 }}>
                                        {diary.title}
                                    </h3>
                                    <p style={{ 
                                        fontSize: '0.95rem', color: theme.colors.gray, lineHeight: 1.6, 
                                        margin: '0 0 15px 0', flex: 1,
                                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' 
                                    }}>
                                        {diary.content}
                                    </p>
                                    <div style={{ display: 'flex', align_items: 'center', gap: '5px', fontSize: '0.85rem', color: '#9CA3AF', fontWeight: '600' }}>
                                        📅 {diary.entryDate ? format(new Date(diary.entryDate), 'yyyy') : ''}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AlbumDetail;