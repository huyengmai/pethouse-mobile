import React, { useState } from 'react';

// --- PETMANIA THEME ---
const theme = {
    colors: {
        primary: '#1B3A4B',      // Xanh đậm
        secondary: '#FFD93D',    // Vàng
        white: '#ffffff',
        bgLight: '#F9FAFB',      // Nền input
        border: '#E5E7EB',       // Viền nhạt
        danger: '#E91E63',       // Màu xóa
        dangerBg: '#FCE4EC',
        shadow: '0 4px 15px rgba(0,0,0,0.05)'
    },
    fonts: {
        header: "'Fredoka', sans-serif",
        body: "'Nunito', sans-serif"
    }
};

const DiarySearchBar = ({ onSearch, placeholder = "Tìm kiếm...", showDateFilter = false }) => {
    const [keyword, setKeyword] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch({ keyword, startDate, endDate });
    };

    const handleClear = () => {
        setKeyword('');
        setStartDate('');
        setEndDate('');
        onSearch({ keyword: '', startDate: '', endDate: '' });
    };

    // Style objects
    const containerStyle = {
        background: theme.colors.white,
        padding: '15px 20px',
        borderRadius: '16px',
        marginBottom: '30px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '15px',
        alignItems: 'center',
        boxShadow: theme.colors.shadow,
        border: `1px solid ${theme.colors.border}`,
        fontFamily: theme.fonts.body
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 15px',
        borderRadius: '12px',
        border: `2px solid ${theme.colors.border}`,
        fontSize: '0.95rem',
        outline: 'none',
        background: theme.colors.bgLight,
        transition: 'all 0.3s',
        color: theme.colors.primary,
        fontFamily: theme.fonts.body
    };

    return (
        <>
            {/* Inject CSS for hover/focus states */}
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;500;600;700&display=swap');

                    .search-input:focus {
                        border-color: ${theme.colors.secondary} !important;
                        background: ${theme.colors.white} !important;
                        box-shadow: 0 0 0 3px rgba(255, 217, 61, 0.2);
                    }

                    .btn-search {
                        background: ${theme.colors.primary};
                        color: ${theme.colors.white};
                        transition: all 0.3s;
                        font-family: ${theme.fonts.header};
                    }
                    .btn-search:hover {
                        background: #2D5A6B;
                        transform: translateY(-2px);
                        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                    }

                    .btn-clear {
                        background: ${theme.colors.dangerBg};
                        color: ${theme.colors.danger};
                        transition: all 0.3s;
                    }
                    .btn-clear:hover {
                        background: ${theme.colors.danger};
                        color: ${theme.colors.white};
                    }
                `}
            </style>

            <form onSubmit={handleSubmit} style={containerStyle}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                    <input
                        className="search-input"
                        type="text"
                        placeholder={placeholder}
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        style={inputStyle}
                    />
                </div>

                {showDateFilter && (
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="search-input"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                style={{ ...inputStyle, width: 'auto', minWidth: '140px' }}
                                title="Từ ngày"
                            />
                        </div>
                        <span style={{ color: theme.colors.secondary, fontWeight: 'bold', fontSize: '1.2rem' }}>➜</span>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="search-input"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                style={{ ...inputStyle, width: 'auto', minWidth: '140px' }}
                                title="Đến ngày"
                            />
                        </div>
                    </div>
                )}

                <button type="submit" className="btn-search" style={{
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <span></span> Tìm kiếm
                </button>

                {(keyword || startDate || endDate) && (
                    <button type="button" onClick={handleClear} className="btn-clear" style={{
                        border: 'none',
                        padding: '12px 18px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        ✕
                    </button>
                )}
            </form>
        </>
    );
};

export default DiarySearchBar;