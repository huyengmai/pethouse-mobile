import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { diaryApi } from '../services/diaryApi';
import { authHelpers } from '../../../api/authApi';
import { API_HOST } from '../../../config/api';

// --- PETMANIA THEME ---
const theme = {
    colors: {
        primary: '#1B3A4B',
        secondary: '#FFD93D',
        bgLight: '#F7FBFC',
        white: '#ffffff',
        gray: '#6B7280',
        inputBorder: '#E5E7EB',
        inputFocus: '#1B3A4B'
    },
    fonts: {
        header: "'Fredoka', sans-serif",
        body: "'Nunito', sans-serif"
    }
};

const DiaryForm = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { id } = useParams();
    const isAuthenticated = authHelpers.isAuthenticated();

    const urlAlbumId = searchParams.get('albumId');
    const BACKEND_URL = API_HOST;

    const [albums, setAlbums] = useState([]);
    const [formData, setFormData] = useState({
        title: '', 
        content: '', 
        entryDate: new Date().toISOString().split('T')[0],
        albumId: urlAlbumId || ''
    });

    const [existingImages, setExistingImages] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;

        diaryApi.getAllAlbums()
            .then(res => {
                setAlbums(res.data);
            })
            .catch(err => console.error("Error loading albums:", err));
    }, [isAuthenticated]);

    const getFullImageUrl = (imageUrl) => {
        if (!imageUrl) return '';
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
            return imageUrl;
        }
        const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
        return `${BACKEND_URL}${path}`;
    };

    useEffect(() => {
        if (id) {
            setLoading(true);
            diaryApi.getDiaryById(id)
                .then(res => {
                    setFormData({
                        title: res.data.title,
                        content: res.data.content,
                        entryDate: res.data.entryDate,
                        albumId: res.data.albumId || ''
                    });
                    const images = (res.data.images || []).map(img => ({
                        ...img,
                        imageUrl: getFullImageUrl(img.imageUrl)
                    }));
                    setExistingImages(images);
                })
                .catch(error => {
                    console.error('Error loading diary:', error);
                    alert("Không thể tải nhật ký");
                    navigate(-1);
                })
                .finally(() => setLoading(false));
        }
    }, [id, navigate]);

    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;
        
        setSelectedFiles(prev => [...prev, ...files]);
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviewUrls(prev => [...prev, ...newPreviews]);
    };

    const handleRemovePreview = (index) => {
        URL.revokeObjectURL(previewUrls[index]);
        setPreviewUrls(prev => prev.filter((_, i) => i !== index));
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            alert("Vui lòng nhập tiêu đề");
            return;
        }
        setLoading(true);
        try {
            let diaryId = id;
            const payload = {
                ...formData,
                albumId: formData.albumId ? formData.albumId : null
            };

            if (id) {
                await diaryApi.updateDiary(id, payload);
            } else {
                const res = await diaryApi.createDiary(payload);
                diaryId = res.data.entryId;
            }

            if (selectedFiles.length > 0) {
                for (const file of selectedFiles) {
                    try {
                        await diaryApi.uploadImage(diaryId, file);
                    } catch (imgError) {
                        console.error(`Lỗi upload ảnh ${file.name}:`, imgError);
                    }
                }
            }
            alert("Lưu nhật ký thành công!");
            if (payload.albumId) {
                navigate(`/diary/album/${payload.albumId}`);
            } else {
                navigate(`/diary/gallery`);
            }
        } catch (error) {
            console.error('Lỗi khi lưu nhật ký:', error);
            alert("Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteImage = async (imgId) => {
        if (window.confirm("Xóa ảnh này?")) {
            try {
                await diaryApi.deleteImage(imgId);
                setExistingImages(prev => prev.filter(img => img.imageId !== imgId));
                alert("Xóa ảnh thành công!");
            } catch (error) {
                console.error('Error deleting image:', error);
                alert("Lỗi khi xóa ảnh: " + (error.response?.data?.message || error.message));
            }
        }
    };

    if (loading && id) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '1.2rem', color: theme.colors.primary, fontFamily: theme.fonts.header }}>
                <span style={{ marginRight: '10px' }}></span> Đang tải...
            </div>
        );
    }

    // --- STYLES OBJECT ---
    const inputStyle = {
        width: '100%', 
        padding: '14px', 
        borderRadius: '12px', 
        border: `2px solid ${theme.colors.inputBorder}`, 
        fontSize: '1rem',
        fontFamily: theme.fonts.body,
        outline: 'none',
        transition: 'all 0.3s',
        backgroundColor: '#FAFAFA'
    };

    const labelStyle = {
        display: 'block', 
        marginBottom: '8px', 
        fontWeight: '700', 
        color: theme.colors.primary,
        fontFamily: theme.fonts.body
    };

    return (
        <div style={{ backgroundColor: theme.colors.bgLight, minHeight: '100vh', padding: '40px 20px', fontFamily: theme.fonts.body }}>
            {/* Inject Fonts & CSS */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&display=swap');
                    
                    .pet-input:focus { border-color: ${theme.colors.primary} !important; background-color: ${theme.colors.white} !important; }
                    
                    .pet-upload-area:hover { border-color: ${theme.colors.secondary} !important; background-color: #FFFDE7 !important; }
                    
                    .pet-btn-primary {
                        background: ${theme.colors.primary}; color: ${theme.colors.white};
                        border: none; padding: 14px; borderRadius: 12px;
                        cursor: pointer; font-family: ${theme.fonts.header}; font-weight: 600; fontSize: 1rem;
                        transition: all 0.3s;
                    }
                    .pet-btn-primary:hover { background: #2D5A6B; transform: translateY(-2px); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
                    
                    .pet-btn-cancel {
                        background: ${theme.colors.white}; color: ${theme.colors.gray};
                        border: 2px solid ${theme.colors.inputBorder}; padding: 14px; borderRadius: 12px;
                        cursor: pointer; font-family: ${theme.fonts.header}; font-weight: 600; fontSize: 1rem;
                        transition: all 0.3s;
                    }
                    .pet-btn-cancel:hover { border-color: ${theme.colors.primary}; color: ${theme.colors.primary}; }
                `}
            </style>

            <div className="container" style={{ 
                maxWidth: '700px', margin: '0 auto', background: theme.colors.white, 
                padding: '40px', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.05)'
            }}>
                <h2 style={{ textAlign: 'center', marginBottom: '30px', color: theme.colors.primary, fontFamily: theme.fonts.header, fontSize: '2rem', marginTop: 0 }}>
                    {id ? ' Chỉnh Sửa Nhật Ký' : ' Viết Nhật Ký Mới'}
                </h2>
                
                <form onSubmit={handleSubmit}>
                    {/* Album Selection */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={labelStyle}>
                             Chọn Album
                        </label>
                        <select
                            className="pet-input"
                            value={formData.albumId}
                            onChange={e => setFormData({...formData, albumId: e.target.value})}
                            style={{ ...inputStyle, appearance: 'none', backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231B3A4B%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 15px top 50%', backgroundSize: '12px auto' }}
                        >
                            <option value="">-- Nhật ký lẻ (Không thuộc Album nào) --</option>
                            {albums.map(album => (
                                <option key={album.albumId} value={album.albumId}>
                                     {album.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '25px' }}>
                        {/* Title */}
                        <div>
                            <label style={labelStyle}>
                                 Tiêu đề *
                            </label>
                            <input 
                                className="pet-input"
                                type="text" required value={formData.title} 
                                onChange={e => setFormData({...formData, title: e.target.value})} 
                                placeholder="Hôm nay bé làm gì?"
                                style={inputStyle}
                            />
                        </div>
                        
                        {/* Date */}
                        <div>
                            <label style={labelStyle}>
                                 Ngày *
                            </label>
                            <input 
                                className="pet-input"
                                type="date" required value={formData.entryDate} 
                                onChange={e => setFormData({...formData, entryDate: e.target.value})}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                    
                    {/* Content */}
                    <div style={{ marginBottom: '25px' }}>
                        <label style={labelStyle}>
                             Nội dung chi tiết
                        </label>
                        <textarea 
                            className="pet-input"
                            rows="6" value={formData.content} 
                            onChange={e => setFormData({...formData, content: e.target.value})} 
                            placeholder="Kể lại câu chuyện đáng yêu nào..."
                            style={{ ...inputStyle, resize: 'vertical', lineHeight: '1.6' }}
                        />
                    </div>

                    {/* Upload Area */}
                    <div style={{ marginBottom: '30px' }}>
                        <label style={labelStyle}>
                            📸 Ảnh kỷ niệm
                        </label>
                        <div 
                            className="pet-upload-area"
                            style={{ 
                                border: '2px dashed #CBD5E1', padding: '30px', textAlign: 'center', 
                                cursor: 'pointer', background: '#F8FAFC', borderRadius: '16px', transition: 'all 0.3s',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
                            }} 
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            <div style={{ fontSize: '30px' }}>📷</div>
                            <span style={{ color: theme.colors.gray, fontWeight: '600' }}>Bấm để chọn ảnh từ máy</span>
                            <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>(Hỗ trợ JPG, PNG)</span>
                        </div>
                        <input id="fileInput" type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={handleFileSelect} />
                        
                        {/* Preview Images Grid */}
                        {(existingImages.length > 0 || previewUrls.length > 0) && (
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', marginTop: '20px' }}>
                                {/* Existing Images */}
                                {existingImages.map(img => (
                                    <div key={img.imageId} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                                        <img 
                                            src={img.imageUrl} alt="Existing" 
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            onError={(e) => {
                                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80"%3E%3Crect width="80" height="80" fill="%23f1f5f9"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-size="12"%3EError%3C/text%3E%3C/svg%3E';
                                            }}
                                        />
                                        <button type="button" onClick={() => handleDeleteImage(img.imageId)} 
                                            style={{ 
                                                position: 'absolute', top: 4, right: 4, background: 'rgba(239, 68, 68, 0.9)', color: 'white', 
                                                border: 'none', borderRadius: '50%', width: '22px', height: '22px', 
                                                cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >×</button>
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '10px', padding: '2px', textAlign: 'center' }}>Đã lưu</div>
                                    </div>
                                ))}
                                
                                {/* New Upload Previews */}
                                {previewUrls.map((url, idx) => (
                                    <div key={idx} style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', border: `2px solid ${theme.colors.secondary}` }}>
                                        <img src={url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                        <button type="button" onClick={() => handleRemovePreview(idx)} 
                                            style={{ 
                                                position: 'absolute', top: 4, right: 4, background: 'rgba(239, 68, 68, 0.9)', color: 'white', 
                                                border: 'none', borderRadius: '50%', width: '22px', height: '22px', 
                                                cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}
                                        >×</button>
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: theme.colors.secondary, color: theme.colors.primary, fontSize: '10px', padding: '2px', textAlign: 'center', fontWeight: 'bold' }}>Mới</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '40px' }}>
                        <button type="button" onClick={() => navigate(-1)}
                            disabled={loading}
                            className="pet-btn-cancel"
                            style={{ flex: 1, opacity: loading ? 0.6 : 1 }}
                        >
                            Hủy bỏ
                        </button>
                        <button type="submit" disabled={loading}
                            className="pet-btn-primary"
                            style={{ flex: 1, opacity: loading ? 0.6 : 1 }}
                        >
                            {loading ? ' Đang lưu...' : (id ? ' Cập nhật' : 'Đăng bài ngay')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DiaryForm;