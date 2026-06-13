import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
 import { authHelpers } from '../../../api/authApi';
import { API_BASE_URL } from '../../../config/api';
// --- 1. Hook tạo hiệu ứng xuất hiện khi cuộn chuột ---
function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const currentRef = ref.current; // Lưu ref.current vào biến cục bộ
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
      }
    }, { threshold: 0.1, ...options });

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) { // Sử dụng biến cục bộ trong cleanup
        observer.unobserve(currentRef);
      }
    };
  }, [options]); // Thêm options vào dependency array

  return [ref, isVisible];
}

// --- 2. Component số chạy (Counter Animation) ---
function AnimatedNumber({ value }) {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.7 }); // Kích hoạt khi hiện 70%

  useEffect(() => {
    if (!isVisible) return; // Chỉ chạy animation khi component hiển thị

    let start = 0;
    const end = parseInt(value);
    if (isNaN(end) || start === end) return;

    let timer = setInterval(() => {
      start += Math.ceil(end / 30);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 40);
    return () => clearInterval(timer);
  }, [value, isVisible]); // Thêm isVisible vào dependency
  
  return <span ref={ref}>{count.toLocaleString()}</span>;
}

// --- Component hiển thị mỗi module (AdminCard) ---
const AdminModuleCard = ({ mod, index, navigate }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 }); // Gọi Hook ở cấp component con

  return (
    <div
      key={mod.id}
      ref={ref}
      onClick={() => navigate(mod.path)}
      className="admin-card-v3"
      style={{
        backgroundColor: 'white',
        padding: '45px',
        borderRadius: '45px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.04)',
        border: `2px solid transparent`,
        cursor: 'pointer',
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transitionDelay: `${index * 150}ms`,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '6px', background: mod.accent }}></div>
      <div style={{
        width: '75px', height: '75px', borderRadius: '22px',
        backgroundColor: mod.bgColor, display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: '36px', marginBottom: '30px',
        boxShadow: `0 10px 20px ${mod.accent}22`
      }}>
        {mod.icon}
      </div>
      <h3 style={{ fontSize: '1.7rem', fontWeight: '700', marginBottom: '15px', color: '#1B3A4B' }}>
        {mod.title}
      </h3>
      <p style={{ fontSize: '15px', color: '#64748B', lineHeight: 1.7, marginBottom: '40px', height: '50px' }}>
        {mod.desc}
      </p>
      <div style={{
        marginTop: 'auto',
        paddingTop: '25px',
        borderTop: '1px solid #F1F5F9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>👤</span>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#94A3B8' }}>
            {mod.owner}
          </span>
        </div>
        <div style={{ color: mod.accent, fontWeight: '800', fontSize: '15px' }}>
          Truy cập ➔
        </div>
      </div>
    </div>
  );
};

// --- Component thống kê (StatisticCard) ---
const StatisticCard = ({ title, icon, value, accentColor, bgColor, delay = 0 }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });

  return (
    <div
      ref={ref}
      style={{
        backgroundColor: 'white',
        padding: '30px',
        borderRadius: '35px',
        boxShadow: '0 15px 40px rgba(0,0,0,0.04)',
        transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        transitionDelay: `${delay}ms`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '200px',
        borderBottom: `6px solid ${accentColor}`
      }}
    >
      <div style={{
        width: '65px',
        height: '65px',
        borderRadius: '20px',
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '30px',
        marginBottom: '20px',
        boxShadow: `0 8px 15px ${accentColor}22`
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '10px', color: '#1B3A4B' }}>
        {title}
      </h3>
      <div style={{ fontSize: '2.5rem', fontWeight: '800', color: accentColor }}>
        {value !== null ? <AnimatedNumber value={value} /> : '...'}
      </div>
    </div>
  );
};


const AdminDashboard = () => {
  const navigate = useNavigate();

  // State để lưu số liệu thống kê
  const [userCount, setUserCount] = useState(null);
  const [petCount, setPetCount] = useState(null);

  // API call để lấy số liệu thống kê
useEffect(() => {
      const loadStats = async () => {
        try {
          const token = authHelpers.getAccessToken();
          const response = await fetch(`${API_BASE_URL}/admin/stats/summary`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!response.ok) throw new Error('Không thể tải dữ liệu thống kê');

          const data = await response.json();

          setUserCount(data.userCount);
          setPetCount(data.petCount);
        } catch (error) {
          console.error("Lỗi API:", error);
          setUserCount(0);
          setPetCount(0);
        }
      };

      loadStats();
    }, []);


  const modules = [
    {
      id: 'users',
      title: 'Quản lý Người dùng',
      icon: '👥',
      desc: 'Phân quyền, khóa/mở tài khoản và quản lý danh sách khách hàng toàn hệ thống.',
      path: '/admin/users',
      bgColor: '#E3F2FD',
      accent: '#2196F3',
    },
    {
      id: 'vaccine',
      title: 'Cấu hình Vaccine',
      icon: '💉',
      desc: 'Thiết lập danh mục vaccine mẫu và xây dựng lộ trình tiêm phòng tự động cho Pet.',
      path: '/admin/bookings',
      bgColor: '#E8F5E9',
      accent: '#4CAF50',
    },
    {
      id: 'nutrition',
      title: 'Quy tắc Dinh dưỡng',
      icon: '🍖',
      desc: 'Xây dựng bộ quy tắc gợi ý thức ăn thông minh dựa trên giống, cân nặng và độ tuổi.',
      path: '/admin/nutrition',
      bgColor: '#FFF3E0',
      accent: '#FF9800',
    }
  ];

  return (
    <div style={{ color: '#1B3A4B', maxWidth: '1400px', margin: '0 auto', padding: '0 20px' }}>
      {/* --- HERO SECTION --- */}
      <section style={{
        background: 'linear-gradient(135deg, #1B3A4B 0%, #2D5A6B 100%)',
        borderRadius: '35px',
        padding: '70px 45px',
        marginBottom: '60px',
        color: 'white',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(27, 58, 75, 0.2)'
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
          <div>
            <div className="animate-bounce-slow" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,217,61,0.2)', color: '#FFD93D', padding: '8px 20px', borderRadius: '50px', fontSize: '14px', fontWeight: '800', marginBottom: '20px' }}>
              🛠️ QUẢN TRỊ VIÊN
            </div>
            <h1 style={{ fontSize: '3.2rem', fontWeight: '700', lineHeight: 1.2, marginBottom: '20px' }}>
              Vận hành <span style={{ color: '#FFD93D' }}>PetHouse</span> <br />
              theo cách của bạn!
            </h1>
            <p style={{ fontSize: '1.1rem', opacity: 0.8, maxWidth: '500px', marginBottom: '30px' }}>
              Tùy chỉnh hệ thống, thiết lập các quy tắc thông minh để mang lại trải nghiệm tốt nhất cho thú cưng.
            </p>

            <div style={{ display: 'flex', gap: '40px' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#FFD93D' }}><AnimatedNumber value={1240} />+</div>
                <div style={{ fontSize: '12px', opacity: 0.6, fontWeight: '700' }}>NGƯỜI DÙNG HIỆN TẠI</div>
              </div>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: '800', color: '#4CAF50' }}><AnimatedNumber value={45} />+</div>
                <div style={{ fontSize: '12px', opacity: 0.6, fontWeight: '700' }}>CẤU HÌNH MẪU</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }} className="hidden lg:flex">
            <div className="animate-float" style={{ width: '220px', height: '220px', background: 'rgba(255,255,255,0.1)', borderRadius: '60px', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '100px' }}>
              ⚙️
            </div>
          </div>
        </div>
      </section>

      {/* --- STATS SECTION --- */}
      <section style={{ padding: '20px 0', marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: '700', marginBottom: '10px' }}>
            Tổng quan <span style={{ color: '#FFD93D', textShadow: '1px 1px 0px #1B3A4B' }}>Dữ liệu</span>
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '18px', fontWeight: '500' }}>Các số liệu thống kê quan trọng của hệ thống</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
          <StatisticCard
            title="Tổng số Người dùng"
            icon="🧑‍🤝‍🧑"
            value={userCount}
            accentColor="#2196F3"
            bgColor="#E3F2FD"
            delay={0}
          />
          <StatisticCard
            title="Tổng số Thú cưng"
            icon="🐾"
            value={petCount}
            accentColor="#FF9800"
            bgColor="#FFF3E0"
            delay={150}
          />
        </div>
      </section>


      {/* --- MODULES SECTION --- */}
      <section style={{ padding: '20px 0', marginBottom: '60px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: '700', marginBottom: '10px' }}>
            Trung tâm <span style={{ color: '#FFD93D', textShadow: '1px 1px 0px #1B3A4B' }}>Quản trị</span>
          </h2>
          <p style={{ color: '#94A3B8', fontSize: '18px', fontWeight: '500' }}>Lựa chọn phân vùng để bắt đầu cấu hình hệ thống</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          {modules.map((mod, index) => (
            <AdminModuleCard key={mod.id} mod={mod} index={index} navigate={navigate} />
          ))}
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section style={{
        marginTop: '80px',
        padding: '60px',
        borderRadius: '45px',
        backgroundColor: '#1B3A4B',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '40px'
      }}>
        <div className="animate-scroll-text" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', fontSize: '90px', fontWeight: '900', color: 'white', opacity: 0.04, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          PET HOUSE ADMIN • SYSTEM CONTROL • PET HOUSE ADMIN • SYSTEM CONTROL •&nbsp;
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2.8rem', fontWeight: '700', color: 'white', marginBottom: '20px' }}>
            Vận hành hệ thống ngay! 
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <button
              onClick={() => navigate('/')}
              style={{ padding: '18px 45px', background: '#FFD93D', color: '#1B3A4B', border: 'none', borderRadius: '20px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              🌐 Trang chủ Client
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '18px 45px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '20px', fontWeight: '800', fontSize: '16px', cursor: 'pointer', transition: 'all 0.3s' }}
            >
              🔄 Làm mới dữ liệu
            </button>
          </div>
        </div>
      </section>

      {/* --- CSS ANIMATIONS --- */}
      <style>{`
        body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow { animation: bounce-slow 3s ease-in-out infinite; }

        @keyframes scroll-text {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-text { animation: scroll-text 35s linear infinite; }

        .admin-card-v3:hover {
          transform: translateY(-15px) !important;
          box-shadow: 0 30px 60px rgba(0,0,0,0.1) !important;
          border-color: #FFD93D !important;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;