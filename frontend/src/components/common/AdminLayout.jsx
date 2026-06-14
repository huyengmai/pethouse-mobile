import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AdminLayout = ({ children }) => {
  const navigate = useNavigate()
  const [activeMenu, setActiveMenu] = useState('dashboard')

  const handleLogout = () => {
    console.log('Đã bấm đăng xuất')
    navigate('/')
  }

  // DANH SÁCH MENU
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: '🏠',
      path: '/admin'
    },
    {
      id: 'users',
      label: 'Users',
      icon: '👥',
      path: '/admin/users'
    },
    {
      id: 'bookings',
      label: 'Lịch',
      icon: '📅',
      path: '/admin/bookings'
    },
    {
      id: 'timeslots',
      label: 'Giờ',
      icon: '🕐',
      path: '/admin/time-slots'
    },
    {
      id: 'nutrition',
      label: 'Food',
      icon: '🍖',
      path: '/admin/nutrition'
    }
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>

      {/* --- MAIN CONTENT --- */}
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%'
        }}
      >
        {/* Top Bar */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '16px',
            borderBottom: '1px solid #E2E8F0',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '18px',
                fontWeight: '800',
                color: '#1B3A4B',
                margin: 0
              }}
            >
              Bảng Quản trị
            </h1>

            <p
              style={{
                fontSize: '12px',
                color: '#94A3B8',
                margin: '4px 0 0'
              }}
            >
              Chào mừng trở lại 👋
            </p>
          </div>

          <button
            onClick={handleLogout}
            style={{
              background: '#EF4444',
              border: 'none',
              color: 'white',
              padding: '10px 14px',
              borderRadius: '12px',
              fontWeight: '700'
            }}
          >
            Đăng xuất
          </button>
        </div>

        {/* Content Area */}
        <div
          style={{
            flex: 1,
            padding: '12px 16px',
            paddingBottom: '90px',
            width: '100%'
          }}
        >
          {children}
        </div>

{/* --- Bottom Navigation --- */}
        <div
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            height: '70px',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            zIndex: 9999,
            boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
            paddingBottom: 'env(safe-area-inset-bottom)'
          }}
        >
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                setActiveMenu(item.id)
                navigate(item.path)
              }}
              style={{
                border: 'none',
                background: 'transparent',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                color:
                  activeMenu === item.id
                    ? '#1B3A4B'
                    : '#94A3B8',
                fontWeight:
                  activeMenu === item.id
                    ? '700'
                    : '500'
              }}
            >
              <span style={{ fontSize: '20px' }}>
                {item.icon}
              </span>

              <span
                style={{
                  fontSize: '11px'
                }}
              >
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </main>

    </div>
  )
}

export default AdminLayout
