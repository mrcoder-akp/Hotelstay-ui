import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice';
import { fetchCart } from '../../store/slices/cartSlice';

import { FaShoppingCart, FaUser, FaBars, FaTimes, FaHotel, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import { MdDashboard, MdExplore, MdLocalOffer } from 'react-icons/md';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.cart);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);

    useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-lg shadow-lg'
        : 'bg-gradient-to-r from-white/80 to-white/70 backdrop-blur-md'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-xl blur-lg group-hover:blur-xl transition-all opacity-70"></div>
              <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-xl transform group-hover:scale-110 transition-transform">
                <FaHotel className="text-2xl text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                TravelStay
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="relative text-gray-700 hover:text-primary-500 transition-colors font-medium group"
            >
              <span className="flex items-center gap-2">
                <MdDashboard className="text-lg" />
                Home
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all"></span>
            </Link>
 

            <Link
              to="/search"
              className="relative text-gray-700 hover:text-primary-500 transition-colors font-medium group"
            >
              <span className="flex items-center gap-2">
                <MdLocalOffer className="text-lg" />
                Search
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all"></span>
            </Link>

            {user ? (
              <>
                <Link
                  to="/bookings"
                  className="relative text-gray-700 hover:text-primary-500 transition-colors font-medium group"
                >
                  My Bookings
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-secondary-500 group-hover:w-full transition-all"></span>
                </Link>

                {/* Cart */}
                <Link
                  to="/cart"
                  className="relative p-2 rounded-xl bg-gradient-to-r from-primary-100 to-secondary-100 hover:from-primary-200 hover:to-secondary-200 transition-all group"
                >
                  <FaShoppingCart className="text-xl text-primary-600" />
                  {items.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold animate-pulse-slow">
                      {items.length}
                    </span>
                  )}
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdown(!profileDropdown)}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105"
                  >
                    <FaUserCircle className="text-xl" />
                    <span className="font-medium">{user.firstName}</span>
                  </button>

                  {/* Dropdown Menu */}
                  <div className={`absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl overflow-hidden transition-all transform ${
                    profileDropdown
                      ? 'opacity-100 translate-y-0 visible'
                      : 'opacity-0 -translate-y-2 invisible'
                  }`}>
                    <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 text-white">
                      <p className="font-semibold">{user.firstName} {user.lastName}</p>
                      <p className="text-sm opacity-90">{user.email}</p>
                    </div>
                    <div className="p-2">
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl transition-colors"
                        onClick={() => setProfileDropdown(false)}
                      >
                        <FaUser className="text-primary-500" />
                        <span>My Profile</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setProfileDropdown(false);
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl transition-colors w-full text-left text-red-600"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="px-6 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-6 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 font-medium shadow-lg"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-all ${
        mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`} onClick={() => setMobileMenuOpen(false)}>
        <div className={`fixed right-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`} onClick={(e) => e.stopPropagation()}>
          <div className="p-6">
            <div className="flex justify-between items-center mb-8">
              <span className="text-xl font-bold gradient-text">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            <div className="space-y-4">
              <Link
                to="/"
                className="block py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/search"
                className="block py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Search Hotels
              </Link>
              {user ? (
                <>
                  <Link
                    to="/bookings"
                    className="block py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/cart"
                    className="block py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Cart ({items.length})
                  </Link>
                  <Link
                    to="/profile"
                    className="block py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-left py-3 px-4 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block py-3 px-4 rounded-xl hover:bg-gray-100 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block py-3 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;