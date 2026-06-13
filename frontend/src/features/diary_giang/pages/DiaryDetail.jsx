import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { diaryApi, fixImageUrl } from '../services/diaryApi';
import { format } from 'date-fns';
import { authHelpers } from '../../../api/authApi'; 

// --- PETMANIA THEME CONFIG ---
const theme = {
    colors: {
        primary: '#1B3A4B',      // Xanh đậm
        secondary: '#FFD93D',    // Vàng
        bgLight: '#F7FBFC',      // Nền sáng
        white: '#ffffff',
        gray: '#6B7280',
        danger: '#E91E63',       // Hồng đậm
        dangerBg: '#FCE4EC',
        lineColor: '#E3F2FD'     // Màu dòng kẻ nhật ký
    },
    fonts: {
        header: "'Fredoka', sans-serif",
        body: "'Nunito', sans-serif",
        handwriting: "'Patrick Hand', cursive" // Giữ font viết tay cho nội dung
    }
};

const DiaryDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAuthenticated = authHelpers.isAuthenticated();
    const [diary, setDiary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDiary = async () => {
            if (!isAuthenticated) return;

            try {
                setLoading(true);
                const res = await diaryApi.getDiaryById(id);
                setDiary(res.data);
            } catch (error) {
                console.error("Error loading diary:", error);
                alert("Không tìm thấy nhật ký");
                navigate('/diary');
            } finally {
                setLoading(false);
            }
        };
        loadDiary();
    }, [id, navigate, isAuthenticated]);

    // Handlers (GIỮ NGUYÊN LOGIC)
    const handleDelete = async () => {
        if(window.confirm("Xóa nhật ký này?")) {
            try {
                await diaryApi.deleteDiary(id);
                alert("Xóa nhật ký thành công!");
                
                if (diary.albumId) {
                    navigate(`/diary/album/${diary.albumId}`);
                } else {
                    navigate('/diary/gallery');
                }
                
            } catch (error) {
                console.error('Lỗi khi xóa nhật ký:', error);
                alert("Lỗi khi xóa: " + (error.response?.data?.message || error.message));
            }
        }
    };

    const scrollGalleryLeft = () => {
        const gallery = document.getElementById('diary-gallery');
        if (gallery) {
            gallery.scrollBy({ left: -300, behavior: 'smooth' });
        }
    };

    const scrollGalleryRight = () => {
        const gallery = document.getElementById('diary-gallery');
        if (gallery) {
            gallery.scrollBy({ left: 300, behavior: 'smooth' });
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: theme.colors.primary, fontFamily: theme.fonts.header, fontSize: '1.5rem', background: theme.colors.bgLight }}>
                <span style={{ marginRight: '10px' }}>⏳</span> Đang tải trang sách...
            </div>
        );
    }

    if (!diary) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: theme.colors.danger, fontFamily: theme.fonts.header, fontSize: '1.5rem', background: theme.colors.bgLight }}>
                🚫 Không tìm thấy nhật ký
            </div>
        );
    }

    // Styles objects
    const bookStyle = {
        maxWidth: '800px', 
        margin: '30px auto', 
        background: 'white', 
        padding: '40px 50px',
        borderRadius: '24px', 
        boxShadow: '0 10px 40px rgba(0,0,0,0.08)', 
        minHeight: '80vh', 
        position: 'relative',
        // Thay gáy sách cam cũ bằng border top màu vàng PetMania
        borderTop: `8px solid ${theme.colors.secondary}` 
    };

    const galleryContainerStyle = {
        position: 'relative',
        marginBottom: '30px',
        marginTop: '20px'
    };

    const galleryStyle = {
        display: 'flex',
        gap: '15px',
        overflowX: 'auto',
        paddingBottom: '10px',
        scrollbarWidth: 'none', // Ẩn scrollbar mặc định để đẹp hơn
        scrollBehavior: 'smooth',
        msOverflowStyle: 'none'
    };

    const scrollButtonStyle = {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        background: theme.colors.white,
        color: theme.colors.primary,
        border: 'none',
        borderRadius: '50%',
        width: '45px',
        height: '45px',
        cursor: 'pointer',
        fontSize: '24px',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        boxShadow: '0 4px 10px rgba(0,0,0,0.15)',
        transition: 'all 0.3s'
    };

    return (
        <div style={{ backgroundColor: theme.colors.bgLight, minHeight: '100vh', paddingBottom: '40px', fontFamily: theme.fonts.body }}>
            {/* Inject Fonts & CSS */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&family=Patrick+Hand&display=swap');
                    
                    .pet-btn-back {
                        background: ${theme.colors.white}; color: ${theme.colors.primary};
                        border: 1px solid #E5E7EB; padding: 10px 20px; borderRadius: 12px;
                        cursor: pointer; font-family: ${theme.fonts.header}; font-weight: 600;
                        transition: all 0.3s;
                    }
                    .pet-btn-back:hover { background: ${theme.colors.primary}; color: ${theme.colors.white}; }

                    .pet-btn-edit {
                        background: ${theme.colors.secondary}; color: ${theme.colors.primary};
                        border: none; padding: 10px 24px; borderRadius: 12px;
                        cursor: pointer; text-decoration: none; font-family: ${theme.fonts.header}; font-weight: 600;
                        display: inline-flex; align-items: center; gap: 5px;
                        transition: all 0.3s;
                    }
                    .pet-btn-edit:hover { transform: translateY(-2px); box-shadow: 0 4px 10px rgba(255, 217, 61, 0.4); }

                    .pet-btn-delete {
                        background: ${theme.colors.dangerBg}; color: ${theme.colors.danger};
                        border: none; padding: 10px 24px; borderRadius: 12px;
                        cursor: pointer; font-family: ${theme.fonts.header}; font-weight: 600;
                        display: inline-flex; align-items: center; gap: 5px;
                        transition: all 0.3s;
                    }
                    .pet-btn-delete:hover { background: ${theme.colors.danger}; color: ${theme.colors.white}; }

                    #diary-gallery::-webkit-scrollbar { display: none; }
                `}
            </style>

            {/* HEADER */}
            <header style={{ 
                background: theme.colors.white, 
                padding: '15px 0', 
                position: 'sticky',
                top: 0,
                zIndex: 100,
                boxShadow: '0 2px 15px rgba(0,0,0,0.03)' 
            }}>
                <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button 
                        onClick={() => navigate(-1)}
                        className="pet-btn-back"
                    >
                        ⬅ Quay lại
                    </button>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <Link 
                            to={`/diary/edit/${diary.entryId}`}
                            className="pet-btn-edit"
                        >
                            <span></span> Sửa nhật ký
                        </Link>
                        <button 
                            onClick={handleDelete}
                            className="pet-btn-delete"
                        >
                            <span></span> Xóa
                        </button>
                    </div>
                </div>
            </header>

            {/* MAIN BOOK CONTENT */}
            <div style={bookStyle}>
                {/* Meta Header inside book */}
                <div style={{ 
                    borderBottom: '2px dashed #E5E7EB',
                    paddingBottom: '20px',
                    marginBottom: '20px',
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontFamily: theme.fonts.header,
                    color: theme.colors.gray
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.2rem' }}></span>
                        <span style={{ fontWeight: '600', color: theme.colors.primary }}>
                            {format(new Date(diary.entryDate), 'dd/MM/yyyy')}
                        </span>
                    </div>
                    <div style={{ 
                        background: theme.colors.bgLight, 
                        padding: '6px 15px', 
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '600',
                        color: theme.colors.primary
                    }}>
                         {diary.albumTitle || 'Chưa phân loại'}
                    </div>
                </div>
                
                <h1 style={{ 
                    fontFamily: theme.fonts.header,
                    color: theme.colors.primary, 
                    margin: '0 0 25px',
                    fontSize: '2.4rem',
                    lineHeight: '1.2'
                }}>
                    {diary.title}
                </h1>

                {/* GALLERY SECTION */}
                {diary.images && diary.images.length > 0 && (
                    <div style={galleryContainerStyle}>
                        {/* Nút Previous */}
                        {diary.images.length > 2 && (
                            <button
                                onClick={scrollGalleryLeft}
                                style={{ ...scrollButtonStyle, left: '-20px' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = theme.colors.primary;
                                    e.currentTarget.style.color = theme.colors.white;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = theme.colors.white;
                                    e.currentTarget.style.color = theme.colors.primary;
                                }}
                            >
                                ‹
                            </button>
                        )}

                        {/* Gallery List */}
                        <div id="diary-gallery" style={galleryStyle}>
                            {diary.images.map(img => (
                                <img 
                                    key={img.imageId} 
                                    src={fixImageUrl(img.imageUrl)} 
                                    alt="Diary memory"
                                    style={{ 
                                        height: '280px', 
                                        borderRadius: '16px', 
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                        flexShrink: 0,
                                        objectFit: 'cover'
                                    }} 
                                />
                            ))}
                        </div>

                        {/* Nút Next */}
                        {diary.images.length > 1 && (
                            <button
                                onClick={scrollGalleryRight}
                                style={{ ...scrollButtonStyle, right: '-20px' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = theme.colors.primary;
                                    e.currentTarget.style.color = theme.colors.white;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = theme.colors.white;
                                    e.currentTarget.style.color = theme.colors.primary;
                                }}
                            >
                                ›
                            </button>
                        )}
                    </div>
                )}

                {/* Content - Hand writing style with modern lines */}
                <div style={{ 
                    fontFamily: theme.fonts.handwriting, 
                    fontSize: '1.5rem', 
                    lineHeight: '2.2rem',
                    color: '#2C3E50',
                    // Tạo dòng kẻ mờ màu xanh nhạt
                    backgroundImage: `linear-gradient(${theme.colors.lineColor} 1px, transparent 1px)`, 
                    backgroundSize: '100% 2.2rem', 
                    padding: '10px 5px', 
                    marginTop: '20px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    minHeight: '200px'
                }}>
                    {diary.content || 'Hãy viết gì đó cho ngày hôm nay...'}
                </div>

                {/* Footer info */}
                <div style={{
                    marginTop: '50px',
                    paddingTop: '20px',
                    borderTop: '1px solid #eee',
                    color: theme.colors.gray,
                    fontSize: '0.85rem',
                    textAlign: 'center',
                    fontFamily: theme.fonts.body,
                    fontStyle: 'italic'
                }}>
                    Được ghi lại vào lúc {format(new Date(diary.createdAt || diary.entryDate), 'HH:mm - dd/MM/yyyy')}
                </div>
            </div>
        </div>
    );
};

export default DiaryDetail;