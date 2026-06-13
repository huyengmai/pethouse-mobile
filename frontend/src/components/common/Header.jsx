import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authApi, authHelpers } from '../../api/authApi'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isFeatureOpen, setIsFeatureOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const userMenuRef = useRef(null)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = authHelpers.getUser()
    if (savedUser) {
      setUser(savedUser)
    }
  }, [location]) // Re-check when location changes

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navLinks = [
    { path: '/', label: 'Trang chủ' },
    { path: '/review', label: 'Đánh giá' },
  ]

  const featureItems = [
    { name: 'Pet Profile', path: '/my-pets' },
    { name: 'Health', path: '/health' },
    { name: 'Vaccine & Grooming', path: '/bookings' },
    { name: 'Nutrition', path: '/nutrition' },
    { name: 'Vet Finder', path: '/vet-finder' },
    { name: 'Diary', path: '/diary' },
  ]

  const handleNavClick = (e, path) => {
    if (path.startsWith('/#')) {
      e.preventDefault()
      const sectionId = path.replace('/#', '')
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      } else if (location.pathname !== '/') {
        window.location.href = path
      }
      setMobileMenuOpen(false)
    }
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch (error) {
      console.log('Logout API error:', error)
    } finally {
      authHelpers.clearAuthData()
      setUser(null)
      setIsUserMenuOpen(false)
      navigate('/')
    }
  }

  const isAuthenticated = authHelpers.isAuthenticated()

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        <div className="flex justify-between items-center py-5">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/logo.png" alt="PetHouse Logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold text-primary">PetHouse</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {/* Trang chủ */}
            <Link
              to="/"
              className="text-primary font-semibold text-[15px] hover:text-yellow transition-colors"
            >
              Trang chủ
            </Link>

            {/* Tính năng Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsFeatureOpen(true)}
              onMouseLeave={() => setIsFeatureOpen(false)}
            >
              <button className="flex items-center gap-1 font-semibold text-[15px] text-primary hover:text-yellow transition-colors py-2">
                Tính năng
                <svg
                  className={`w-4 h-4 transition-transform duration-200 ${isFeatureOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {isFeatureOpen && (
                <div className="absolute top-full left-0 pt-2 w-56 z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-dropdown">
                    {featureItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="block px-4 py-3 text-primary hover:bg-gray-50 font-medium transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Other nav links */}
            {navLinks.filter(link => link.path !== '/').map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="text-primary font-semibold text-[15px] hover:text-yellow transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
                >
                  Đăng nhập
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition-all"
                >
                  Đăng ký
                </Link>
              </>
            ) : (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow to-orange-400 rounded-full flex items-center justify-center text-xl">
                    {user?.fullName?.charAt(0)?.toUpperCase() || '👤'}
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-primary text-sm">
                      {user?.fullName || 'User'}
                    </div>
                    <div className="text-xs text-gray-500">
                      {user?.role || 'Member'}
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-dropdown">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-semibold text-primary">{user?.fullName}</div>
                      <div className="text-sm text-gray-500">{user?.email || user?.username}</div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-gray-50 transition-colors"
                    >
                      <span>👤</span>
                      <span>Trang cá nhân</span>
                    </Link>
                    <Link
                      to="/my-bookings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-gray-50 transition-colors"
                    >
                      <span>📅</span>
                      <span>Lịch đặt của tôi</span>
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 text-primary hover:bg-gray-50 transition-colors"
                      >
                        <span>⚙️</span>
                        <span>Quản trị</span>
                      </Link>
                    )}
                    <hr className="my-2 border-gray-100" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <span>🚪</span>
                      <span>Đăng xuất</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-2">
              {/* Trang chủ */}
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-primary font-semibold py-2 hover:text-yellow transition-colors"
              >
                Trang chủ
              </Link>

              {/* Tính năng với submenu */}
              <div>
                <button
                  onClick={() => setIsFeatureOpen(!isFeatureOpen)}
                  className="flex items-center justify-between w-full text-primary font-semibold py-2 hover:text-yellow transition-colors"
                >
                  Tính năng
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isFeatureOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isFeatureOpen && (
                  <div className="pl-4 flex flex-col gap-1 mt-1">
                    {featureItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-gray-600 py-2 hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Other links */}
              {navLinks.filter(link => link.path !== '/').map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={(e) => {
                    handleNavClick(e, link.path)
                    setMobileMenuOpen(false)
                  }}
                  className="text-primary font-semibold py-2 hover:text-yellow transition-colors"
                >
                  {link.label}
                </Link>
              ))}

              <div className="flex flex-col gap-3 pt-4 border-t mt-2">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-6 py-3 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-all text-center"
                    >
                      Đăng nhập
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-light transition-all text-center"
                    >
                      Đăng ký
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3 py-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow to-orange-400 rounded-full flex items-center justify-center text-xl">
                        {user?.fullName?.charAt(0)?.toUpperCase() || '👤'}
                      </div>
                      <div>
                        <div className="font-semibold text-primary">{user?.fullName}</div>
                        <div className="text-sm text-gray-500">{user?.email || user?.username}</div>
                      </div>
                    </div>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-primary py-2 hover:text-yellow transition-colors"
                    >
                      👤 Trang cá nhân
                    </Link>
                    {user?.role === 'ADMIN' && (
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="text-primary py-2 hover:text-yellow transition-colors"
                      >
                        ⚙️ Quản trị
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout()
                        setMobileMenuOpen(false)
                      }}
                      className="text-red-500 py-2 hover:text-red-600 transition-colors text-left"
                    >
                      🚪 Đăng xuất
                    </button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
