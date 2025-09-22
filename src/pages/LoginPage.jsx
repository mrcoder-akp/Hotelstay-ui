import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, reset } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaFacebook, FaArrowRight } from 'react-icons/fa';
import { MdEmail, MdLock } from 'react-icons/md';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const { email, password } = formData;

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = { email, password };
    dispatch(login(userData));
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-purple-600 to-secondary-600 animate-gradient">
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary-300/20 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent-pink/10 rounded-full blur-3xl animate-float" style={{animationDelay: '5s'}}></div>

      {/* Login Container */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-8 text-white text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl mb-4">
              <MdLock className="text-4xl" />
            </div>
            <h2 className="text-3xl font-bold mb-2">Welcome Back!</h2>
            <p className="text-white/90">Login to continue your journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-modern pl-10"
                  placeholder="Enter your email"
                  value={email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="input-modern pl-10 pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-primary-600 hover:text-primary-500 transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center group"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                <>
                  Sign In
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all hover:scale-105 group"
              >
                <FaGoogle className="text-red-500 group-hover:scale-110 transition-transform" />
                <span className="ml-2 text-sm font-medium text-gray-700">Google</span>
              </button>

              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all hover:scale-105 group"
              >
                <FaFacebook className="text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="ml-2 text-sm font-medium text-gray-700">Facebook</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign up for free
              </Link>
            </p>
          </form>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="text-white/90">
            <div className="text-2xl font-bold">100%</div>
            <div className="text-sm">Secure</div>
          </div>
          <div className="text-white/90">
            <div className="text-2xl font-bold">24/7</div>
            <div className="text-sm">Support</div>
          </div>
          <div className="text-white/90">
            <div className="text-2xl font-bold">Easy</div>
            <div className="text-sm">Booking</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;