import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { authHelpers } from '../../../api/authApi'
import reviewService from '../../review_huyen/services/reviewService'

// Fallback reviews data
const fallbackReviews = [
  {
    id: 1,
    rating: 5,
    text: "Dịch vụ grooming tuyệt vời! Bé cún nhà mình rất thích và lông luôn mượt mà sau mỗi lần spa. Nhân viên thân thiện và chuyên nghiệp.",
    author: "Nguyễn Thu Hà",
    petInfo: "Chú bé Golden - Max",
    avatar: "woman"
  },
  {
    id: 2,
    rating: 5,
    text: "Sản phẩm chất lượng, giá cả hợp lý. Giao hàng nhanh chóng, đóng gói cẩn thận. Sẽ tiếp tục ủng hộ shop!",
    author: "Trần Minh Đức",
    petInfo: "Chú bé Husky - Snow",
    avatar: "man"
  },
  {
    id: 3,
    rating: 5,
    text: "Pet Hotel rất tốt! Minh đi công tác 1 tuần mà yên tâm gửi bé mèo. Camera xem 24/7, nhân viên cập nhật hình ảnh liên tục.",
    author: "Lê Thị Mai",
    petInfo: "Chú bé British - Mimi",
    avatar: "woman"
  }
]

// Features data
const features = [
  {
    id: 'profile',
    icon: '🐾',
    title: 'Profile',
    description: 'Tạo hồ sơ chi tiết cho từng thú cưng, cập nhật thông tin nhanh chóng.',
    bgColor: 'bg-bg-orange',
    items: ['Tạo profile cho pet', 'Cập nhật cân nặng nhanh', 'Lưu trữ thông tin chi tiết'],
    path: '/my-pets'
  },
  {
    id: 'vaccine',
    icon: '💉',
    title: 'Vaccine & Grooming',
    description: 'Quản lý lịch tiêm phòng và chăm sóc, không bao giờ bỏ lỡ.',
    bgColor: 'bg-bg-green',
    items: ['Xem lịch dạng calendar', 'Đánh dấu hoàn thành', 'Thông báo trước ngày hẹn'],
    path: '/bookings'
  },
  {
    id: 'health',
    icon: '❤️',
    title: 'Health',
    description: 'Theo dõi sức khỏe thú cưng với hồ sơ y tế đầy đủ.',
    bgColor: 'bg-bg-pink',
    items: ['Thêm hồ sơ khám bệnh', 'Upload ảnh chỉ định', 'Biểu đồ cân nặng/nhiệt độ'],
    path: '/health'
  },
  {
    id: 'nutrition',
    icon: '🍖',
    title: 'Nutrition',
    description: 'Gợi ý chế độ dinh dưỡng phù hợp với từng giống và độ tuổi.',
    bgColor: 'bg-bg-blue',
    items: ['Chọn giống/tuổi', 'Gợi ý khẩu phần ăn', 'Lưu meal plan theo ngày'],
    path: '/nutrition'
  },
  {
    id: 'vet',
    icon: '🏥',
    title: 'Vet Finder',
    description: 'Tìm kiếm phòng khám thú y gần nhất với bản đồ tích hợp.',
    bgColor: 'bg-bg-purple',
    items: ['Bản đồ + bộ lọc', 'Mở Google Maps chỉ đường', 'Lưu địa điểm yêu thích'],
    path: '/vet-finder'
  },
  {
    id: 'diary',
    icon: '📔',
    title: 'Diary',
    description: 'Lưu giữ những khoảnh khắc đáng nhớ cùng thú cưng.',
    bgColor: 'bg-bg-teal',
    items: ['Viết note kèm ảnh', 'Timeline kỷ niệm', 'Chia sẻ với bạn bè'],
    path: '/diary'
  }
]

// Animation observer hook
function useIntersectionObserver(options = {}) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true)
      }
    }, { threshold: 0.1, ...options })
if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return [ref, isVisible]
}

// Star Rating Component
function StarRating({ rating }) {
  return (
    <div className="flex gap-1">
      {[...Array(5)].map((_, i) => (
        <span key={i} className="text-yellow text-xl">
          {i < rating ? '★' : '☆'}
        </span>
      ))}
    </div>
  )
}

// Hero Section
function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-bg-green to-bg-blue py-16 lg:py-24 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%231B3A4B' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-md mb-6">
              <span>🎉</span>
              <span className="text-sm font-semibold text-primary">Nền tảng #1 cho người yêu thú cưng</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-[52px] font-bold text-primary leading-tight mb-6">
              Chăm sóc{' '}
              <span className="relative inline-block text-green-600">
                thú cưng
                <span className="absolute bottom-1 left-0 w-full h-3 bg-yellow rounded -z-10" />
              </span>{' '}
              của bạn một cách thông minh
            </h1>

            {/* Description */}
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Quản lý sức khỏe, lịch tiêm phòng, dinh dưỡng và mọi thông tin về thú cưng yêu thương của bạn trong một nền tảng duy nhất.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white rounded-xl font-semibold hover:bg-primary-light transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                Bắt đầu ngay
              </Link>
              <a
                href="#features"
className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary border-2 border-primary rounded-xl font-semibold hover:bg-primary hover:text-white transition-all"
              >
                Tìm hiểu thêm
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-8 lg:gap-10 justify-center lg:justify-start">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">50K+</div>
                <div className="text-sm text-gray-600">Người dùng</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">100K+</div>
                <div className="text-sm text-gray-600">Thú cưng</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">4.9⭐</div>
                <div className="text-sm text-gray-600">Đánh giá</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="hidden lg:flex justify-center items-center relative">
            {/* Floating Cards */}
            <div className="absolute top-5 left-0 bg-white rounded-2xl p-4 shadow-lg flex items-center gap-3 animate-float z-20">
              <div className="w-11 h-11 bg-bg-green rounded-xl flex items-center justify-center text-xl">📅</div>
              <div>
                <h4 className="text-sm font-semibold text-primary">Lịch tiêm phòng</h4>
                <p className="text-xs text-gray-500">Nhắc nhở tự động</p>
              </div>
            </div>

            <div className="absolute bottom-12 right-0 bg-white rounded-2xl p-4 shadow-lg flex items-center gap-3 animate-float delay-1000 z-20">
              <div className="w-11 h-11 bg-bg-blue rounded-xl flex items-center justify-center text-xl">📊</div>
              <div>
                <h4 className="text-sm font-semibold text-primary">Theo dõi sức khỏe</h4>
                <p className="text-xs text-gray-500">Biểu đồ chi tiết</p>
              </div>
            </div>

            <div className="absolute top-1/2 -right-4 bg-white rounded-2xl p-4 shadow-lg flex items-center gap-3 animate-float delay-500 z-20">
              <div className="w-11 h-11 bg-bg-pink rounded-xl flex items-center justify-center text-xl">🗺️</div>
              <div>
                <h4 className="text-sm font-semibold text-primary">Tìm bác sĩ thú y</h4>
                <p className="text-xs text-gray-500">Gần bạn nhất</p>
              </div>
            </div>

            {/* Main Pet Icon */}
            <div className="w-80 h-80 lg:w-96 lg:h-96 bg-yellow rounded-full flex items-center justify-center shadow-2xl">
              <span className="text-[180px] lg:text-[200px] animate-bounce-slow">🐕</span>
            </div>
          </div>
</div>
      </div>
    </section>
  )
}

// Feature Card Component
function FeatureCard({ feature, delay }) {
  const [ref, isVisible] = useIntersectionObserver()

  return (
    <Link
      to={feature.path}
      ref={ref}
      className={`${feature.bgColor} rounded-3xl p-8 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl border-2 border-transparent hover:border-primary/10 block cursor-pointer ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-4xl shadow-md mb-6">
        {feature.icon}
      </div>
      <h3 className="text-xl font-bold text-primary mb-3">{feature.title}</h3>
      <p className="text-gray-600 mb-5 leading-relaxed">{feature.description}</p>
      <ul className="space-y-2">
        {feature.items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-primary">
            <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-green-500 text-xs font-bold">✓</span>
            {item}
          </li>
        ))}
      </ul>
    </Link>
  )
}

// Features Section
function FeaturesSection() {
  const [ref, isVisible] = useIntersectionObserver()

  return (
    <section id="features" className="py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="inline-flex items-center gap-2 bg-yellow-light text-primary px-5 py-2 rounded-full text-sm font-semibold mb-4">
            <span>✨</span>
            Tính năng nổi bật
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-primary mb-4">
            Mọi thứ bạn cần để{' '}
            <span className="relative inline-block">
              chăm sóc
              <span className="absolute bottom-1 left-0 w-full h-2.5 bg-yellow rounded -z-10" />
            </span>{' '}
            thú cưng
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            6 tính năng chính giúp bạn quản lý và chăm sóc thú cưng một cách toàn diện
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} delay={index * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonial Card Component
function TestimonialCard({ review, delay }) {
  const [ref, isVisible] = useIntersectionObserver()

  return (
    <div
      ref={ref}
className={`bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {/* Quote Icon */}
      <span className="absolute top-8 right-8 text-4xl text-yellow opacity-50">❝</span>

      {/* Rating */}
      <div className="mb-5">
        <StarRating rating={review.rating} />
      </div>

      {/* Review Text */}
      <p className="text-gray-600 italic leading-relaxed mb-6">"{review.text}"</p>

      {/* Author */}
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow to-orange-400 flex items-center justify-center text-3xl">
          {review.avatar === 'woman' ? '👩' : '👨'}
        </div>
        <div>
          <h4 className="font-semibold text-primary">{review.author}</h4>
          <p className="text-sm text-gray-500">{review.petInfo}</p>
        </div>
      </div>
    </div>
  )
}

// Testimonials Section
function TestimonialsSection() {
  const [reviews, setReviews] = useState(fallbackReviews)
  const [ref, isVisible] = useIntersectionObserver()

  useEffect(() => {
    // Fetch real reviews from API
    const fetchReviews = async () => {
      try {
        const response = await reviewService.getPublicReviews()
        if (response.data && response.data.length > 0) {
          // Map API data to review format for display
          const mappedReviews = response.data.map((review) => ({
            id: review.id,
            rating: review.rating,
            text: review.content,
            author: review.userName || 'Khách hàng',
            petInfo: review.petName ? `${review.serviceType} - ${review.petName}` : review.serviceType,
            avatar: 'woman' // Default avatar
          }))
          setReviews(mappedReviews)
        }
      } catch (error) {
        console.log('Using fallback reviews data')
      }
    }
    fetchReviews()
  }, [])

  return (
    <section id="testimonials" className="py-20 lg:py-24 bg-gradient-to-b from-bg-green to-yellow-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Header */}
        <div
          ref={ref}
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-primary italic mb-4">
            Khách hàng nói gì về chúng tôi
          </h2>
          <p className="text-lg text-gray-600">
           Hàng ngàn khách hàng hài lòng với dịch vụ của PetHouse
          </p>
</div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <TestimonialCard key={review.id} review={review} delay={index * 150} />
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section
function CTASection() {
  const [ref, isVisible] = useIntersectionObserver()

  return (
    <section className="py-20 lg:py-24 bg-primary relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 whitespace-nowrap text-8xl opacity-5 animate-scroll-text" style={{ top: '50%', transform: 'translateY(-50%)' }}>
        🐕 🐈 🐇 🦜 🐠 🦎 🐕 🐈 🐇 🦜 🐠 🦎
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div
          ref={ref}
          className={`text-center transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-white mb-5">
            Sẵn sàng chăm sóc thú cưng tốt hơn?  🐾
          </h2>
          <p className="text-lg text-white/80 mb-10 max-w-2xl mx-auto">
            Đăng ký miễn phí ngay hôm nay và trải nghiệm cách quản lý thú cưng thông minh nhất
          </p>
          {!authHelpers.isAuthenticated() && (
            <Link
              to="/register"
              className="inline-flex items-center gap-3 px-10 py-5 bg-yellow text-primary rounded-xl font-bold text-lg hover:-translate-y-1 hover:shadow-2xl transition-all"
            >
              <span>🚀</span>
              Đăng ký miễn phí
            </Link>
          )}

        </div>
      </div>
    </section>
  )
}

// Main HomePage Component
export default function HomePage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
    </div>
  )
}