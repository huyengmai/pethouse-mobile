import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { diaryApi, fixImageUrl } from '../services/diaryApi';
import { format } from 'date-fns';
import DiarySearchBar from '../components/DiarySearchBar';
import { authHelpers } from '../../../api/authApi';

const theme = {
    colors: {
        primary: '#1B3A4B',      // Xanh đậm
        primaryLight: '#2D5A6B',
        secondary: '#FFD93D',    // Vàng
        bgLight: '#F7FBFC',      // Nền sáng
        white: '#ffffff',
        gray: '#6B7280',
        grayLight: '#9CA3AF',
        accentGreen: '#4CAF50',
        shadow: '0 10px 30px rgba(0,0,0,0.08)',
        cardBorder: '#E5E7EB'
    },
    fonts: {
        header: "'Fredoka', sans-serif",
        body: "'Nunito', sans-serif",
    }
};

const AlbumList = () => {
    const isAuthenticated = authHelpers.isAuthenticated();
    const [albums, setAlbums] = useState([]);
    const [recentDiaries, setRecentDiaries] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // --- STATE TÌM KIẾM (GIỮ NGUYÊN) ---
    const [isSearching, setIsSearching] = useState(false);
    const [foundAlbums, setFoundAlbums] = useState([]);
    const [foundDiaries, setFoundDiaries] = useState([]);

    // --- STATE MODAL (GIỮ NGUYÊN) ---
    const [showModal, setShowModal] = useState(false);
    const [newAlbum, setNewAlbum] = useState({ title: '', description: '', coverImageUrl: '' });

    // ==================== PAGINATION STATE (GIỮ NGUYÊN) ====================
    const [albumCurrentPage, setAlbumCurrentPage] = useState(1);
    const [diaryCurrentPage, setDiaryCurrentPage] = useState(1);
    const ALBUMS_PER_PAGE = 6;
    const DIARIES_PER_PAGE = 6;

    useEffect(() => {
        if (isAuthenticated) {
            loadData();
        }
    }, [isAuthenticated]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [albumsRes, allDiariesRes] = await Promise.all([
                diaryApi.getAllAlbums(),
                diaryApi.getAllDiariesByUser()
            ]);
            
            const albumsData = albumsRes.data || [];
            const allDiaries = allDiariesRes.data || [];

            setAlbums(Array.isArray(albumsData) ? albumsData : []);
            
            const recentDiaries = Array.isArray(allDiaries) 
                ? allDiaries
                    .sort((a, b) => new Date(b.entryDate) - new Date(a.entryDate))
                    .slice(0, 10)
                : [];
            
            setRecentDiaries(recentDiaries);
            
        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleGlobalSearch = async ({ keyword, startDate, endDate }) => {
        if (!keyword && !startDate && !endDate) {
            setIsSearching(false);
            setAlbumCurrentPage(1);
            setDiaryCurrentPage(1);
            return;
        }

        try {
            setLoading(true);
            setIsSearching(true);

            const [albumsRes, diariesRes] = await Promise.all([
                diaryApi.searchAlbums({keyword, startDate, endDate}),
                diaryApi.searchDiaries({ keyword, startDate, endDate }) 
            ]);

            setFoundAlbums(albumsRes.data || []);
            setFoundDiaries(diariesRes.data || []);
            
            setAlbumCurrentPage(1);
            setDiaryCurrentPage(1);

        } catch (error) {
            console.error("Lỗi tìm kiếm:", error);
            alert("Đã xảy ra lỗi khi tìm kiếm");
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAlbum = async (e) => {
        e.preventDefault();
        if (!newAlbum.title.trim()) {
            alert("Vui lòng nhập tiêu đề album");
            return;
        }
        try {
            await diaryApi.createAlbum(newAlbum);
            setShowModal(false);
            setNewAlbum({ title: '', description: '', coverImageUrl: '' });
            loadData();
            alert("Tạo album thành công!");
        } catch (error) {
            console.error("Lỗi khi tạo album:", error);
            alert("Lỗi khi tạo album: " + (error.response?.data?.message || error.message));
        }
    };

    if (!isAuthenticated) return <div style={{textAlign:'center', padding:'100px'}}>Vui lòng đăng nhập để tiếp tục!</div>;

    
    const displayAlbums = isSearching ? foundAlbums : albums;
    const displayDiaries = isSearching ? foundDiaries : recentDiaries;

    const albumTotalPages = Math.ceil(displayAlbums.length / ALBUMS_PER_PAGE);
    const albumStartIndex = (albumCurrentPage - 1) * ALBUMS_PER_PAGE;
    const albumEndIndex = albumStartIndex + ALBUMS_PER_PAGE;
    const currentAlbums = displayAlbums.slice(albumStartIndex, albumEndIndex);

    const diaryTotalPages = Math.ceil(displayDiaries.length / DIARIES_PER_PAGE);
    const diaryStartIndex = (diaryCurrentPage - 1) * DIARIES_PER_PAGE;
    const diaryEndIndex = diaryStartIndex + DIARIES_PER_PAGE;
    const currentDiaries = displayDiaries.slice(diaryStartIndex, diaryEndIndex);

    const scrollDiariesLeft = () => {
        const slider = document.getElementById('diaries-slider');
        if (slider) slider.scrollBy({ left: -320, behavior: 'smooth' });
    };

    const scrollDiariesRight = () => {
        const slider = document.getElementById('diaries-slider');
        if (slider) slider.scrollBy({ left: 320, behavior: 'smooth' });
    };

    // --- STYLED PAGINATION ---
    const Pagination = ({ currentPage, totalPages, onPageChange }) => {
        if (totalPages <= 1) return null;
        const pageNumbers = [];
        const maxButtons = 5;
        let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
        let endPage = Math.min(totalPages, startPage + maxButtons - 1);

        if (endPage - startPage < maxButtons - 1) {
            startPage = Math.max(1, endPage - maxButtons + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        const btnStyle = { 
            width: '40px', height: '40px', borderRadius: '10px', border: 'none', 
            background: theme.colors.white, color: theme.colors.primary, 
            cursor: 'pointer', fontWeight: '600', fontFamily: theme.fonts.body,
            boxShadow: '0 2px 5px rgba(0,0,0,0.05)', transition: 'all 0.2s'
        };

        const activeBtnStyle = { ...btnStyle, background: theme.colors.primary, color: theme.colors.white };

        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginTop: '40px' }}>
                <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} style={{...btnStyle, opacity: currentPage === 1 ? 0.5 : 1}}>←</button>
                {startPage > 1 && <button onClick={() => onPageChange(1)} style={btnStyle}>1</button>}
                {startPage > 2 && <span style={{ color: theme.colors.grayLight }}>...</span>}
                
                {pageNumbers.map(number => (
                    <button key={number} onClick={() => onPageChange(number)} style={currentPage === number ? activeBtnStyle : btnStyle}>
                        {number}
                    </button>
                ))}
                
                {endPage < totalPages && <span style={{ color: theme.colors.grayLight }}>...</span>}
                {endPage < totalPages && <button onClick={() => onPageChange(totalPages)} style={btnStyle}>{totalPages}</button>}
                <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} style={{...btnStyle, opacity: currentPage === totalPages ? 0.5 : 1}}>→</button>
            </div>
        );
    };

    if (loading && !isSearching) { 
        return (
            <div style={{ 
                display: 'flex', justifyContent: 'center', alignItems: 'center', 
                height: '100vh', color: theme.colors.primary, fontFamily: theme.fonts.header, 
                fontSize: '1.5rem', gap: '10px', 
                backgroundColor: theme.colors.bgLight // FIX MÀU NỀN LOADING
            }}>
                <div className="spinner">🐾</div> Đang tải dữ liệu...
            </div>
        );
    }

    return (
        <div style={{ fontFamily: theme.fonts.body, backgroundColor: theme.colors.bgLight, minHeight: '100vh', paddingBottom: '40px' }}>
            {/* Inject Fonts & Animations */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&display=swap');
                    
                    .pet-card { transition: all 0.3s ease; border: 2px solid transparent; }
                    .pet-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.1); border-color: ${theme.colors.bgLight}; }
                    
                    .pet-btn-primary { 
                        background: ${theme.colors.primary}; color: ${theme.colors.white}; 
                        transition: all 0.3s; box-shadow: 0 4px 10px rgba(27, 58, 75, 0.2);
                        display: flex; alignItems: center; gap: 8px;
                    }
                    .pet-btn-primary:hover { background: ${theme.colors.primaryLight}; transform: translateY(-2px); }

                    .pet-btn-secondary {
                        background: ${theme.colors.secondary}; color: ${theme.colors.primary};
                        transition: all 0.3s; box-shadow: 0 4px 10px rgba(255, 217, 61, 0.3);
                        display: flex; alignItems: center; gap: 8px;
                    }
                    .pet-btn-secondary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255, 217, 61, 0.4); }

                    .pet-btn-outline {
                        background: ${theme.colors.white}; color: ${theme.colors.primary}; border: 2px solid ${theme.colors.primary};
                        transition: all 0.3s; display: flex; alignItems: center; gap: 8px;
                    }
                    .pet-btn-outline:hover { background: ${theme.colors.primary}; color: ${theme.colors.white}; }

                    .scroll-hide::-webkit-scrollbar { display: none; }
                    .scroll-hide { -ms-overflow-style: none; scrollbar-width: none; }
                `}
            </style>


            <div className="container" style={{ maxWidth: '1280px', margin: '0 auto', padding: '30px 20px' }}>
                
                <div style={{ 
                    display: 'flex', 
                    justifyContent: 'flex-end', 
                    gap: '15px', 
                    marginBottom: '20px',
                    flexWrap: 'wrap'
                }}>
                    <Link to="/diary/gallery" className="pet-btn-outline" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '600', fontSize: '15px' }}>
                        <span></span> Thư viện nhật ký
                    </Link>

                    <Link to="/diary/new" className="pet-btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: '600', fontSize: '15px' }}>
                        <span></span> Viết nhật ký
                    </Link>

                    <button onClick={() => setShowModal(true)} className="pet-btn-secondary" style={{ border: 'none', padding: '10px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '15px' }}>
                        <span></span> Tạo Album
                    </button>
                </div>

                {/* --- SEARCH --- */}
                <div style={{ marginBottom: '50px' }}>
                    <DiarySearchBar 
                        onSearch={handleGlobalSearch} 
                        placeholder="Tìm kiếm ..." 
                        showDateFilter={true} 
                    />
                </div>

                {/* --- ALBUMS SECTION --- */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', paddingBottom: '15px', borderBottom: `2px solid ${isSearching ? '#E5E7EB' : 'transparent'}` }}>
                    <h2 style={{ fontFamily: theme.fonts.header, color: theme.colors.primary, fontSize: '2rem', margin: 0 }}>
                        {isSearching ? `Kết quả Album (${displayAlbums.length})` : ' Bộ sưu tập Album'}
                    </h2>
                    {!isSearching}
                </div>
                
                {displayAlbums.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px', background: theme.colors.white, borderRadius: '24px', border: '2px dashed #E5E7EB' }}>
                        <div style={{ fontSize: '48px', marginBottom: '15px', opacity: 0.5 }}></div>
                        <p style={{ color: theme.colors.gray, fontStyle: 'italic', fontSize: '1.1rem' }}>Chưa tìm thấy album nào.</p>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
                            {currentAlbums.map(album => (
                                <Link 
                                    to={`/diary/album/${album.albumId}`} 
                                    key={album.albumId} 
                                    className="pet-card"
                                    style={{ 
                                        background: theme.colors.white, borderRadius: '24px', overflow: 'hidden', 
                                        textDecoration: 'none', color: 'inherit', display: 'block',
                                        position: 'relative'
                                    }}
                                >
                                    {/* Top colored border effect */}
                                    <div style={{ height: '6px', background: theme.colors.secondary, width: '100%' }}></div>
                                    
                                    <div style={{ height: '200px', position: 'relative', overflow: 'hidden' }}>
                                        {album.coverImageUrl ? (
                                            <img 
                                                src={fixImageUrl(album.coverImageUrl)} 
                                                alt={album.title} 
                                                style={{width:'100%', height:'100%', objectFit:'cover'}}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = `<div style="display:flex;width:100%;height:100%;align-items:center;justify-content:center;font-size:50px;color:${theme.colors.white};background:${theme.colors.primary}">🐾</div>`;
                                                }}
                                            />
                                        ) : (
                                            <div style={{display:'flex', width:'100%', height:'100%', alignItems:'center', justifyContent:'center', fontSize:'50px', background:'#FFF8E1'}}>🐶</div>
                                        )}
                                    </div>
                                    
                                    <div style={{ padding: '25px' }}>
                                        <h3 style={{ fontFamily: theme.fonts.header, marginBottom: '10px', fontSize: '1.4rem', marginTop: 0, color: theme.colors.primary }}>{album.title}</h3>
                                        <p style={{ color: theme.colors.gray, fontSize: '0.95rem', marginBottom: 0, lineHeight: 1.6 }}>{album.description || 'Chưa có mô tả'}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <Pagination 
                            currentPage={albumCurrentPage}
                            totalPages={albumTotalPages}
                            onPageChange={setAlbumCurrentPage}
                        />
                    </>
                )}

                {/* --- DIARIES SECTION --- */}
                <div style={{ marginTop: '80px', marginBottom: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <h2 style={{ fontFamily: theme.fonts.header, color: theme.colors.primary, fontSize: '2rem', margin: 0 }}>
                            {isSearching ? `Kết quả Nhật ký (${displayDiaries.length})` : 'Khoảnh khắc mới nhất'}
                        </h2>
                        <p style={{ color: theme.colors.gray, marginTop: '8px' }}>Những kỷ niệm đáng nhớ vừa được cập nhật</p>
                    </div>
                </div>

                {displayDiaries.length === 0 ? (
                     <div style={{ textAlign: 'center', padding: '60px', background: theme.colors.white, borderRadius: '24px', border: '2px dashed #E5E7EB' }}>
                        <p style={{ color: theme.colors.gray, fontSize: '1.1rem' }}>Chưa có nhật ký nào.</p>
                     </div>
                ) : (
                    <>
                        {isSearching ? (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '30px' }}>
                                    {currentDiaries.map(diary => (
                                        <Link 
                                            to={`/diary/${diary.entryId}`} 
                                            key={diary.entryId} 
                                            className="pet-card"
                                            style={{ background: theme.colors.white, borderRadius: '20px', overflow: 'hidden', textDecoration: 'none', color: 'inherit', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}
                                        >
                                            <div style={{height: '180px', background: '#FFF3E0', position: 'relative'}}>
                                                {diary.images && diary.images.length > 0 ? (
                                                    <img 
                                                        src={fixImageUrl(diary.images[0].imageUrl)} 
                                                        alt={diary.title}
                                                        style={{width:'100%', height:'100%', objectFit:'cover'}}
                                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=Pet+Moment'; }}
                                                    />
                                                ) : (
                                                    <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center', fontSize: '3rem'}}></div>
                                                )}
                                                <div style={{position:'absolute', top:'10px', right:'10px', background: theme.colors.white, padding:'4px 10px', borderRadius:'20px', fontSize:'12px', fontWeight:'700', color: theme.colors.primary}}>
                                                    {diary.entryDate ? format(new Date(diary.entryDate), 'dd/MM') : ''}
                                                </div>
                                            </div>
                                            <div style={{padding: '20px'}}>
                                                <h4 style={{fontFamily: theme.fonts.header, marginBottom: '8px', fontSize: '1.2rem', marginTop: 0, color: theme.colors.primary}}>{diary.title}</h4>
                                                <div style={{marginTop: '5px', fontSize: '0.85rem', color: theme.colors.grayLight, display: 'flex', alignItems: 'center', gap: '5px'}}>
                                                    <span></span>
                                                    {diary.albumTitle || 'Chưa phân loại'}
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                                <Pagination 
                                    currentPage={diaryCurrentPage}
                                    totalPages={diaryTotalPages}
                                    onPageChange={setDiaryCurrentPage}
                                />
                            </>
                        ) : (
                            <div style={{ position: 'relative', padding: '10px 0' }}>
                                {displayDiaries.length > 4 && (
                                    <button
                                        onClick={scrollDiariesLeft}
                                        style={{
                                            position: 'absolute', top: '50%', left: '-25px', transform: 'translateY(-50%)',
                                            background: theme.colors.white, color: theme.colors.primary, border: 'none', borderRadius: '50%',
                                            width: '50px', height: '50px', cursor: 'pointer', fontSize: '24px', zIndex: 10,
                                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >‹</button>
                                )}

                                <div id="diaries-slider" className="scroll-hide" style={{ display: 'flex', gap: '25px', overflowX: 'auto', padding: '10px 5px', scrollBehavior: 'smooth' }}>
                                    {displayDiaries.map(diary => (
                                        <Link 
                                            to={`/diary/${diary.entryId}`} 
                                            key={diary.entryId} 
                                            className="pet-card"
                                            style={{
                                                minWidth: '300px', flexShrink: 0,
                                                background: theme.colors.white, borderRadius: '20px', overflow: 'hidden',
                                                textDecoration: 'none', color: 'inherit', boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                                            }}
                                        >
                                            <div style={{height: '180px', background: '#E3F2FD'}}>
                                                {diary.images && diary.images.length > 0 ? (
                                                    <img 
                                                        src={fixImageUrl(diary.images[0].imageUrl)} 
                                                        alt={diary.title}
                                                        style={{width:'100%', height:'100%', objectFit:'cover'}}
                                                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/300?text=Pet+Moment'; }}
                                                    />
                                                ) : (
                                                    <div style={{display:'flex', height:'100%', alignItems:'center', justifyContent:'center', fontSize: '3rem'}}>🐶</div>
                                                )}
                                            </div>
                                            <div style={{padding: '20px'}}>
                                                <h4 style={{fontFamily: theme.fonts.header, marginBottom: '8px', fontSize: '1.2rem', marginTop: 0, color: theme.colors.primary}}>{diary.title}</h4>
                                                <small style={{color: theme.colors.gray}}>
                                                     {diary.entryDate ? format(new Date(diary.entryDate), 'dd/MM/yyyy') : ''}
                                                </small>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                {displayDiaries.length > 4 && (
                                    <button
                                        onClick={scrollDiariesRight}
                                        style={{
                                            position: 'absolute', top: '50%', right: '-25px', transform: 'translateY(-50%)',
                                            background: theme.colors.white, color: theme.colors.primary, border: 'none', borderRadius: '50%',
                                            width: '50px', height: '50px', cursor: 'pointer', fontSize: '24px', zIndex: 10,
                                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                        }}
                                    >›</button>
                                )}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* MODAL TẠO ALBUM - THIẾT KẾ MỚI */}
            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(27, 58, 75, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ background: theme.colors.white, borderRadius: '24px', padding: '40px', maxWidth: '550px', width: '90%', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', animation: 'float 0.3s ease-out', position: 'relative' }}>
                        
                        {/* NÚT ĐÓNG - DẤU X Ở GÓC TRÁI */}
                        <button 
                            type="button" 
                            onClick={() => setShowModal(false)}
                            style={{
                                position: 'absolute',
                                top: '20px',
                                left: '20px',
                                background: 'transparent',
                                border: 'none',
                                fontSize: '28px',
                                color: theme.colors.gray,
                                cursor: 'pointer',
                                width: '40px',
                                height: '40px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%',
                                transition: 'all 0.2s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = '#F3F4F6';
                                e.target.style.color = theme.colors.primary;
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'transparent';
                                e.target.style.color = theme.colors.gray;
                            }}
                        >
                            ×
                        </button>

                        <h2 style={{ fontFamily: theme.fonts.header, color: theme.colors.primary, marginBottom: '25px', marginTop: 0, textAlign: 'center', fontSize: '1.8rem' }}>
                            Tạo Album Mới
                        </h2>
                        
                        <form onSubmit={handleCreateAlbum}>
                            <div style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: theme.colors.primary }}>Tên Album *</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={newAlbum.title} 
                                    onChange={e => setNewAlbum({...newAlbum, title: e.target.value})} 
                                    style={{ 
                                        width: '100%', padding: '15px', borderRadius: '12px', 
                                        border: '2px solid #E5E7EB', fontSize: '16px', outline: 'none',
                                        fontFamily: theme.fonts.body, transition: '0.3s'
                                    }} 
                                    placeholder="Ví dụ: Kỷ niệm cùng Milu 2024" 
                                    onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                                />
                            </div>
                            
                            <div style={{ marginBottom: '30px' }}>
                                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '700', color: theme.colors.primary }}>Mô tả ngắn</label>
                                <textarea 
                                    value={newAlbum.description} 
                                    onChange={e => setNewAlbum({...newAlbum, description: e.target.value})} 
                                    style={{ 
                                        width: '100%', padding: '15px', borderRadius: '12px', 
                                        border: '2px solid #E5E7EB', minHeight: '120px', fontSize: '16px', outline: 'none',
                                        fontFamily: theme.fonts.body, transition: '0.3s', resize: 'vertical'
                                    }} 
                                    placeholder="Viết vài dòng về album này..." 
                                    onFocus={(e) => e.target.style.borderColor = theme.colors.primary}
                                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                                />
                            </div>
                            
                            {/* NÚT LƯU - ĐẶT Ở GIỮA */}
                            <div style={{ display: 'flex', justifyContent: 'center' }}>
                                <button 
                                    type="submit" 
                                    className="pet-btn-primary" 
                                    style={{ 
                                        padding: '15px 60px', 
                                        borderRadius: '12px', 
                                        border: 'none', 
                                        cursor: 'pointer', 
                                        fontWeight: '700', 
                                        fontSize: '16px',
                                        justifyContent: 'center'
                                    }}
                                >
                                    Lưu Album
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlbumList;