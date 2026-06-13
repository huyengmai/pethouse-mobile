import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { diaryApi, fixImageUrl } from '../services/diaryApi';
import { format } from 'date-fns';
import DiarySearchBar from '../components/DiarySearchBar';
import { authHelpers } from '../../../api/authApi';

// --- PETMANIA THEME ---
const theme = {
    colors: {
        primary: '#1B3A4B',
        secondary: '#FFD93D',
        bgLight: '#F7FBFC',
        white: '#ffffff',
        gray: '#6B7280',
        danger: '#E91E63',
        success: '#4CAF50',
        blue: '#2196F3',
        border: '#E5E7EB'
    },
    fonts: {
        header: "'Fredoka', sans-serif",
        body: "'Nunito', sans-serif"
    }
};

const DiaryGallery = () => {
    const navigate = useNavigate();
    const isAuthenticated = authHelpers.isAuthenticated();

    const [diaries, setDiaries] = useState([]);
    const [albums, setAlbums] = useState([]);
    const [loading, setLoading] = useState(true);

    const [isSearching, setIsSearching] = useState(false);
    const [foundDiaries, setFoundDiaries] = useState([]);

    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [moveMode, setMoveMode] = useState('existing');
    const [selectedAlbumId, setSelectedAlbumId] = useState('');
    const [newAlbumTitle, setNewAlbumTitle] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            fetchData();
        }
    }, [isAuthenticated]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const resDiaries = await diaryApi.getAllDiariesByUser();
            setDiaries(resDiaries.data);
            const resAlbums = await diaryApi.getAllAlbums();
            setAlbums(resAlbums.data);
        } catch (error) {
            console.error("Error fetching gallery:", error);
            alert("Lỗi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    const handleGlobalSearch = async ({ keyword, startDate, endDate }) => {
        if (!keyword && !startDate && !endDate) {
            setIsSearching(false);
            setFoundDiaries([]);
            return;
        }

        try {
            setLoading(true); 
            setIsSearching(true);
            const res = await diaryApi.searchDiaries({ keyword, startDate, endDate });
            setFoundDiaries(res.data || []);
        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
            alert("Đã xảy ra lỗi khi tìm kiếm");
        } finally {
            setLoading(false);
        }
    };

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedIds([]);
    };

    const handleSelectDiary = (id) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(itemId => itemId !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    const handleCardClick = (diaryId) => {
        if (isSelectionMode) {
            handleSelectDiary(diaryId);
        } else {
            navigate(`/diary/${diaryId}`);
        }
    };

    const openMoveModal = () => {
        if (selectedIds.length === 0) return;
        setShowModal(true);
        setNewAlbumTitle('');
        setSelectedAlbumId('');
    };

    const handleConfirmMove = async () => {
        setIsSubmitting(true);
        try {
            let targetId = selectedAlbumId;
            if (moveMode === 'new') {
                if (!newAlbumTitle.trim()) {
                    alert("Vui lòng nhập tên Album mới");
                    setIsSubmitting(false);
                    return;
                }
                const res = await diaryApi.createAlbum({ 
                    title: newAlbumTitle, 
                    description: "Tạo từ Thư viện nhật ký" 
                });
                targetId = res.data.albumId;
            } else {
                if (!targetId) {
                    alert("Vui lòng chọn Album đích");
                    setIsSubmitting(false);
                    return;
                }
            }
            await diaryApi.moveDiariesToAlbum(selectedIds, targetId);
            alert(`Đã chuyển ${selectedIds.length} nhật ký vào Album thành công!`);
            setShowModal(false);
            setIsSelectionMode(false);
            setSelectedIds([]);
            fetchData();
        } catch (error) {
            console.error("Move error:", error);
            alert("Có lỗi xảy ra khi chuyển nhật ký");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteSelected = async () => {
        if (selectedIds.length === 0) return;

        if (window.confirm(` CẢNH BÁO: Bạn có chắc chắn muốn XÓA VĨNH VIỄN ${selectedIds.length} nhật ký đã chọn không?\nHành động này không thể hoàn tác!`)) {
            setIsSubmitting(true); 
            try {
                await diaryApi.deleteMultipleDiaries(selectedIds);
                alert(`✅ Đã xóa ${selectedIds.length} nhật ký thành công.`);
                setSelectedIds([]);
                setIsSelectionMode(false);
                if (isSearching) {
                    setIsSearching(false); 
                    fetchData();
                } else {
                    fetchData();
                }
            } catch (error) {
                console.error("Delete error:", error);
                alert(" Có lỗi xảy ra khi xóa nhật ký. Vui lòng thử lại.");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    const getThumbnail = (diary) => {
        if (diary.images && diary.images.length > 0) {
            return fixImageUrl(diary.images[0].imageUrl);
        }
        return null;
    };

    const displayDiaries = isSearching ? foundDiaries : diaries;

    if (loading && !isSearching) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: theme.colors.primary, fontFamily: theme.fonts.header, fontSize: '1.5rem', background: theme.colors.bgLight }}>
            <span style={{ marginRight: '10px' }}></span> Đang tải thư viện...
        </div>
    );

    return (
        <div style={{ backgroundColor: theme.colors.bgLight, minHeight: '100vh', padding: '40px 20px', fontFamily: theme.fonts.body }}>
            {/* Inject Fonts & CSS Animations */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&display=swap');
                    
                    /* Card Container Animation */
                    .pet-card-gallery {
                        transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Hiệu ứng nảy nhẹ */
                        border: 2px solid transparent;
                    }
                    
                    /* Hover State for Card */
                    .pet-card-gallery:hover {
                        transform: translateY(-10px) scale(1.02);
                        box-shadow: 0 20px 40px rgba(0,0,0,0.12);
                        border-color: ${theme.colors.secondary}; /* Viền vàng khi hover */
                    }
                    
                    /* Image Zoom Animation */
                    .pet-card-img {
                        transition: transform 0.6s ease;
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                    }
                    
                    .pet-card-gallery:hover .pet-card-img {
                        transform: scale(1.12); /* Phóng to ảnh */
                    }

                    /* Button Styles */
                    .pet-btn-action {
                        padding: 10px 20px; border-radius: 12px; font-weight: 600; cursor: pointer; transition: 0.2s; border: none; font-family: ${theme.fonts.header};
                    }
                    .pet-btn-action:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                `}
            </style>

            <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
                
                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <Link to="/diary" style={{ 
                            textDecoration: 'none', width: '45px', height: '45px', borderRadius: '12px', 
                            background: theme.colors.white, color: theme.colors.primary, 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            fontSize: '1.2rem', fontWeight: 'bold', boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                            transition: '0.2s'
                        }} title="Quay lại danh sách Album">
                            ⬅
                        </Link>

                        <div>
                            <h2 style={{ margin: 0, color: theme.colors.primary, fontFamily: theme.fonts.header, fontSize: '2rem' }}>
                                {isSearching ? ' Kết quả tìm kiếm' : ' Thư viện Nhật ký'}
                            </h2>
                            <p style={{ margin: '5px 0 0', color: theme.colors.gray, fontSize: '1rem' }}>
                                {isSearching 
                                    ? `Tìm thấy ${displayDiaries.length} khoảnh khắc`
                                    : `Tổng hợp ${diaries.length} khoảnh khắc đáng yêu`
                                }
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                        {isSelectionMode ? (
                            <>
                                {/* Delete Button */}
                                <button 
                                    className="pet-btn-action"
                                    onClick={handleDeleteSelected}
                                    disabled={selectedIds.length === 0 || isSubmitting}
                                    style={{
                                        background: theme.colors.danger, color: theme.colors.white,
                                        opacity: (selectedIds.length === 0 || isSubmitting) ? 0.6 : 1,
                                        cursor: (selectedIds.length === 0 || isSubmitting) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                    {isSubmitting ? ' Đang xóa...' : `🗑️ Xóa (${selectedIds.length})`}
                                </button>

                                {/* Move Button */}
                                <button 
                                    className="pet-btn-action"
                                    onClick={openMoveModal}
                                    disabled={selectedIds.length === 0 || isSubmitting}
                                    style={{
                                        background: theme.colors.blue, color: theme.colors.white,
                                        opacity: (selectedIds.length === 0 || isSubmitting) ? 0.6 : 1,
                                        cursor: (selectedIds.length === 0 || isSubmitting) ? 'not-allowed' : 'pointer'
                                    }}
                                >
                                     Chuyển Album ({selectedIds.length})
                                </button>

                                {/* Cancel Button */}
                                <button 
                                    className="pet-btn-action"
                                    onClick={toggleSelectionMode}
                                    disabled={isSubmitting}
                                    style={{ background: theme.colors.white, color: theme.colors.gray, border: `1px solid ${theme.colors.border}` }}
                                >
                                    Hủy chọn
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Write New Button */}
                                <Link to="/diary/new" className="pet-btn-action" style={{ 
                                    textDecoration: 'none', background: theme.colors.secondary, color: theme.colors.primary, 
                                    display: 'flex', alignItems: 'center', gap: '8px'
                                }}>
                                    <span></span> Viết nhanh
                                </Link>

                                {/* Select Mode Button */}
                                <button 
                                    className="pet-btn-action"
                                    onClick={toggleSelectionMode}
                                    style={{ background: theme.colors.white, color: theme.colors.primary, border: `2px solid ${theme.colors.primary}` }}
                                >
                                     Chọn nhiều
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* SEARCH BAR */}
                <div style={{ marginBottom: '40px' }}>
                    <DiarySearchBar 
                        onSearch={handleGlobalSearch} 
                        placeholder="Tìm kiếm khoảnh khắc thú cưng..." 
                        showDateFilter={true} 
                    />
                </div>

                {/* GRID VIEW */}
                {displayDiaries.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '80px', background: theme.colors.white, borderRadius: '24px', border: '2px dashed #E5E7EB' }}>
                        <div style={{ fontSize: '60px', marginBottom: '20px' }}></div>
                        <p style={{ color: theme.colors.gray, fontSize: '1.2rem', fontFamily: theme.fonts.header }}>
                            {isSearching ? 'Không tìm thấy kết quả nào phù hợp.' : 'Bạn chưa có nhật ký nào. Hãy bắt đầu viết ngay nhé!'}
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                        {displayDiaries.map(diary => {
                            const thumb = getThumbnail(diary);
                            const isSelected = selectedIds.includes(diary.entryId);
                            return (
                                <div 
                                    key={diary.entryId} 
                                    onClick={() => handleCardClick(diary.entryId)} 
                                    className="pet-card-gallery"
                                    style={{ 
                                        background: theme.colors.white, borderRadius: '20px', overflow: 'hidden', 
                                        boxShadow: isSelected ? `0 0 0 4px ${theme.colors.secondary}, 0 10px 25px rgba(0,0,0,0.1)` : '0 5px 15px rgba(0,0,0,0.05)', 
                                        cursor: 'pointer', position: 'relative', 
                                        // Override border style if selected to keep it blue/primary
                                        borderColor: isSelected ? theme.colors.primary : 'transparent'
                                    }}
                                >
                                    {/* Selection Checkbox Visual */}
                                    {isSelectionMode && (
                                        <div style={{ 
                                            position: 'absolute', top: 15, right: 15, zIndex: 10, width: 28, height: 28, borderRadius: '50%', 
                                            background: isSelected ? theme.colors.secondary : 'rgba(255,255,255,0.9)', 
                                            border: `2px solid ${theme.colors.secondary}`, 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                            color: theme.colors.primary, fontWeight: 'bold', fontSize: '16px',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                                        }}>
                                            {isSelected && '✓'}
                                        </div>
                                    )}
                                    
                                    {/* Image / Thumbnail Container */}
                                    <div style={{ height: '220px', background: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                        {thumb ? (
                                            <img className="pet-card-img" src={thumb} alt="thumbnail" />
                                        ) : (
                                            <span style={{ fontSize: '3rem', opacity: 0.5, transition: '0.3s' }}>📝</span>
                                        )}
                                    </div>
                                    
                                    {/* Content */}
                                    <div style={{ padding: '20px' }}>
                                        <h3 style={{ margin: '0 0 10px', fontSize: '1.1rem', color: theme.colors.primary, fontFamily: theme.fonts.header, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {diary.title || 'Không có tiêu đề'}
                                        </h3>
                                        <div style={{ fontSize: '0.85rem', color: theme.colors.gray, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <span> {format(new Date(diary.entryDate), 'dd/MM/yyyy')}</span>
                                            {diary.albumTitle ? (
                                                <span style={{ background: '#E3F2FD', color: '#1565C0', padding: '4px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                                                     {diary.albumTitle}
                                                </span>
                                            ) : (
                                                <span style={{ color: theme.colors.gray, fontSize: '0.75rem', fontStyle: 'italic' }}>Chưa có Album</span>
                                            )}
                                        </div>
                                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748B', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                                            {diary.content || '...'}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* MODAL: CHUYỂN ALBUM */}
            {showModal && (
                <div style={{ 
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    background: 'rgba(27, 58, 75, 0.6)', backdropFilter: 'blur(4px)',
                    zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' 
                }}>
                    <div style={{ 
                        background: theme.colors.white, padding: '40px', borderRadius: '24px', 
                        width: '450px', maxWidth: '90%', boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                        animation: 'float 0.3s ease-out'
                    }}>
                        <h3 style={{ marginTop: 0, color: theme.colors.primary, fontFamily: theme.fonts.header, fontSize: '1.5rem', marginBottom: '10px' }}>
                             Chuyển vào Album
                        </h3>
                        <p style={{ color: theme.colors.gray, fontSize: '1rem', marginBottom: '25px' }}>
                            Đang chọn <span style={{ fontWeight: 'bold', color: theme.colors.primary }}>{selectedIds.length}</span> nhật ký để di chuyển.
                        </p>
                        
                        <div style={{ display: 'flex', gap: '20px', marginBottom: '25px' }}>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: theme.colors.primary }}>
                                <input type="radio" name="moveMode" value="existing" checked={moveMode === 'existing'} onChange={() => setMoveMode('existing')} /> 
                                Album có sẵn
                            </label>
                            <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', color: theme.colors.primary }}>
                                <input type="radio" name="moveMode" value="new" checked={moveMode === 'new'} onChange={() => setMoveMode('new')} /> 
                                Tạo Album mới
                            </label>
                        </div>
                        
                        <div style={{ marginBottom: '30px' }}>
                            {moveMode === 'existing' ? (
                                <select 
                                    value={selectedAlbumId} 
                                    onChange={(e) => setSelectedAlbumId(e.target.value)} 
                                    style={{ 
                                        width: '100%', padding: '12px', borderRadius: '12px', 
                                        border: `2px solid ${theme.colors.border}`, outline: 'none',
                                        fontSize: '1rem', fontFamily: theme.fonts.body
                                    }}
                                >
                                    <option value="">-- Chọn Album đích --</option>
                                    {albums.map(a => (<option key={a.albumId} value={a.albumId}>📖 {a.title}</option>))}
                                </select>
                            ) : (
                                <input 
                                    type="text" 
                                    placeholder="Nhập tên Album mới..." 
                                    value={newAlbumTitle} 
                                    onChange={(e) => setNewAlbumTitle(e.target.value)} 
                                    style={{ 
                                        width: '100%', padding: '12px', borderRadius: '12px', 
                                        border: `2px solid ${theme.colors.border}`, outline: 'none',
                                        fontSize: '1rem', fontFamily: theme.fonts.body
                                    }} 
                                />
                            )}
                        </div>
                        
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <button 
                                onClick={() => setShowModal(false)} 
                                className="pet-btn-action"
                                style={{ flex: 1, background: theme.colors.white, border: `2px solid ${theme.colors.border}`, color: theme.colors.gray }}
                            >
                                Hủy bỏ
                            </button>
                            <button 
                                onClick={handleConfirmMove} 
                                disabled={isSubmitting} 
                                className="pet-btn-action"
                                style={{ flex: 1, background: theme.colors.primary, color: theme.colors.white, opacity: isSubmitting ? 0.7 : 1 }}
                            >
                                {isSubmitting ? ' Đang xử lý...' : ' Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DiaryGallery;