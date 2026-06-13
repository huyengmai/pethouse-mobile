import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminLayout = ({ children }) => {
  const navigate = useNavigate()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [activeMenu, setActiveMenu] = useState('dashboard')

  const handleLogout = () => {
    console.log('Đã bấm đăng xuất')
    navigate('/')
  }

  // DANH SÁCH MENU
  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: '🏠', path: '/admin' },
    { id: 'users', label: 'Người dùng', icon: '👥', path: '/admin/users' },
    { id: 'bookings', label: 'Quản lý đặt lịch', icon: '📅', path: '/admin/bookings' },
    { id: 'timeslots', label: 'Quản lý khung giờ', icon: '🕐', path: '/admin/time-slots' },
    { id: 'nutrition', label: 'Dinh dưỡng', icon: '🍖', path: '/admin/nutrition' }
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* --- SIDEBAR --- */}
      <aside style={{
        width: sidebarCollapsed ? '80px' : '280px',
        backgroundColor: '#1B3A4B',
        padding: '20px 0',
        position: 'fixed',
        height: '100vh',
        overflowY: 'auto',
        transition: 'width 0.3s ease',
        boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
        zIndex: 1000
      }}>
        {/* Logo */}
        <div style={{
          padding: '0 25px 30px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '20px'
        }}>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', cursor: 'pointer' }}
            onClick={() => navigate('/admin')}
          >
            <img
              src="/images/logo.png"
              alt="PetHouse Logo"
              style={{ width: '40px', height: '40px', objectFit: 'contain', flexShrink: 0 }}
            />
            
            {!sidebarCollapsed && (
              <div>
                <div style={{ color: '#FFD93D', fontSize: '20px', fontWeight: '700', lineHeight: 1 }}>
                  PetHouse
                </div>
                <div style={{ color: '#94A3B8', fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px' }}>
                  ADMIN PANEL
                </div>
              </div>
            )}
          </div>
          
          {/* Toggle Button */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: 'rgba(255,217,61,0.1)',
              border: '1px solid rgba(255,217,61,0.3)',
              borderRadius: '10px',
              color: '#FFD93D',
              cursor: 'pointer',
              fontSize: '20px',
              transition: 'all 0.3s'
            }}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* Menu Items */}
        <nav style={{ padding: '0 15px' }}>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id)
                navigate(item.path)
              }}
              style={{
                width: '100%',
                padding: '15px 15px',
                marginBottom: '8px',
                backgroundColor: activeMenu === item.id ? 'rgba(255,217,61,0.15)' : 'transparent',
                color: activeMenu === item.id ? '#FFD93D' : '#94A3B8',
                border: 'none',
                borderLeft: activeMenu === item.id ? '4px solid #FFD93D' : '4px solid transparent',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '700',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                textAlign: 'left'
              }}
              onMouseEnter={e => {
                if (activeMenu !== item.id) {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={e => {
                if (activeMenu !== item.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <span style={{ fontSize: '20px', minWidth: '20px' }}>{item.icon}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Section */}
        {!sidebarCollapsed && (
          <div style={{ 
            position: 'absolute', 
            bottom: '20px', 
            left: '15px', 
            right: '15px',
            padding: '15px',
            backgroundColor: 'rgba(255,255,255,0.05)',
            borderRadius: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#FFD93D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              flexShrink: 0
            }}>
              👤
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap' }}>Admin</div>
              <div style={{ color: '#94A3B8', fontSize: '11px', whiteSpace: 'nowrap' }}>Super User</div>
            </div>
      </div>
        )}
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main style={{ 
        marginLeft: sidebarCollapsed ? '80px' : '280px',
        flex: 1,
        transition: 'margin-left 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Top Bar */}
        <div style={{
          backgroundColor: 'white',
          padding: '20px 40px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1B3A4B', margin: 0 }}>
              Bảng Quản trị
            </h1>
            <p style={{ fontSize: '13px', color: '#94A3B8', margin: '5px 0 0' }}>
              Chào mừng trở lại, Admin! 👋
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button 
              onClick={() => navigate('/')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                color: '#1B3A4B',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = '#1B3A4B'
                e.currentTarget.style.color = 'white'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = '#F8FAFC'
                e.currentTarget.style.color = '#1B3A4B'
              }}
            >
              Trang khách
            </button>

            
            <button 
              onClick={handleLogout}
              style={{
                padding: '10px 20px',
                backgroundColor: '#EF4444',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#DC2626'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EF4444'}
            >
               Đăng xuất
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div style={{ 
          flex: 1,
          padding: '40px',
          maxWidth: '1400px',
          width: '100%'
        }}>
          {children}
        </div>
      </main>

      {/* --- CSS --- */}
      <style>{`
        aside::-webkit-scrollbar {
          width: 6px;
        }

        aside::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }

        aside::-webkit-scrollbar-thumb {
          background: rgba(255,217,61,0.3);
          border-radius: 3px;
        }

        aside::-webkit-scrollbar-thumb:hover {
          background: rgba(255,217,61,0.5);
        }
      `}</style>
    </div>
  )
}

export default AdminLayout
