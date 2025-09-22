import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, reset } from '../store/slices/authSlice';
import { toast } from 'react-toastify';
import {
  FaUser, FaEnvelope, FaLock, FaPhone, FaEye, FaEyeSlash,
  FaGoogle, FaFacebook, FaCheckCircle, FaArrowRight, FaHotel,
  FaMapMarkedAlt, FaUserFriends, FaStar, FaShieldAlt, FaGift,
  FaHeart, FaCrown, FaPlane
} from 'react-icons/fa';
import { MdEmail, MdPerson, MdPhone, MdLock, MdCheck, MdLocationCity } from 'react-icons/md';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);

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
      toast.success('Welcome to TravelStay!');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const { firstName, lastName, email, password, confirmPassword, phone } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value
    }));

    // Calculate password strength
    if (name === 'password') {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (value.match(/[a-z]/) && value.match(/[A-Z]/)) strength++;
      if (value.match(/[0-9]/)) strength++;
      if (value.match(/[^a-zA-Z0-9]/)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!agreedToTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (passwordStrength < 2) {
      toast.error('Please use a stronger password');
      return;
    }

    const userData = { firstName, lastName, email, password, phone };
    dispatch(register(userData));
  };

  const features = [
    { icon: <FaShieldAlt />, title: 'Secure Booking', text: 'Your data is protected with bank-level encryption' },
    { icon: <FaGift />, title: 'Exclusive Deals', text: 'Members get access to special discounts' },
    { icon: <FaCrown />, title: 'Loyalty Rewards', text: 'Earn points with every booking' },
    { icon: <FaHeart />, title: '24/7 Support', text: 'We are here to help anytime, anywhere' }
  ];

  const stats = [
    { number: '2M+', label: 'Happy Travelers' },
    { number: '50K+', label: 'Hotels Listed' },
    { number: '500+', label: 'Cities Covered' },
    { number: '4.8/5', label: 'User Rating' }
  ];

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 0: case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-blue-500';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 0: case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-gray-50 to-white relative">
        {/* Decorative Elements */}
        <div className="hidden lg:block absolute top-10 left-10 w-20 h-20 bg-primary-100 rounded-full blur-2xl animate-float"></div>
        <div className="hidden lg:block absolute bottom-10 right-10 w-32 h-32 bg-secondary-100 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>

        <div className="relative z-10 w-full max-w-md animate-fade-in">
          {/* Progress Steps - Mobile Only */}
          <div className="lg:hidden flex justify-center mb-6">
            <div className="flex items-center space-x-2">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`w-2 h-2 rounded-full transition-all ${
                    step === 1 ? 'w-8 bg-gradient-to-r from-primary-500 to-secondary-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Form Header */}
          <div className="text-center lg:text-left mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl mb-4 transform hover:scale-110 transition-transform">
              <FaHotel className="text-2xl text-white" />
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
              Join TravelStay
            </h2>
            <p className="text-gray-600">Start your journey with us today</p>
          </div>

          {/* Social Signup */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all hover:scale-105 group shadow-sm"
            >
              <FaGoogle className="text-red-500 group-hover:scale-110 transition-transform" />
              <span className="ml-2 text-sm font-medium hidden sm:block">Google</span>
            </button>

            <button
              type="button"
              className="flex items-center justify-center px-4 py-3 bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all hover:scale-105 group shadow-sm"
            >
              <FaFacebook className="text-blue-600 group-hover:scale-110 transition-transform" />
              <span className="ml-2 text-sm font-medium hidden sm:block">Facebook</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-r from-gray-50 to-white text-gray-500">Or register with email</span>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 ml-1">First Name</label>
                <div className="relative group mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    name="firstName"
                    type="text"
                    required
                    className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all hover:border-gray-300"
                    placeholder="John"
                    value={firstName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 ml-1">Last Name</label>
                <div className="relative group mt-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                  </div>
                  <input
                    name="lastName"
                    type="text"
                    required
                    className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all hover:border-gray-300"
                    placeholder="Doe"
                    value={lastName}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-gray-700 ml-1">Email Address</label>
              <div className="relative group mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all hover:border-gray-300"
                  placeholder="john@example.com"
                  value={email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="text-xs font-semibold text-gray-700 ml-1">Phone Number <span className="text-gray-400">(Optional)</span></label>
              <div className="relative group mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaPhone className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  name="phone"
                  type="tel"
                  className="w-full pl-10 pr-3 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all hover:border-gray-300"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-semibold text-gray-700 ml-1">Password</label>
              <div className="relative group mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all hover:border-gray-300"
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-600">Password Strength</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength >= 3 ? 'text-green-600' : passwordStrength >= 2 ? 'text-yellow-600' : 'text-red-600'
                    }`}>{getPasswordStrengthText()}</span>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                          level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength < 2 && password && (
                    <p className="text-xs text-gray-500 mt-1">Use uppercase, numbers & symbols</p>
                  )}
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-gray-700 ml-1">Confirm Password</label>
              <div className="relative group mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
                </div>
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all hover:border-gray-300"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FaEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <FaEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-500 mt-1 flex items-center">
                  <span className="inline-block w-4 h-4 mr-1">✗</span>
                  Passwords do not match
                </p>
              )}
              {confirmPassword && password === confirmPassword && confirmPassword.length > 0 && (
                <p className="text-xs text-green-500 mt-1 flex items-center">
                  <FaCheckCircle className="mr-1" />
                  Passwords match
                </p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded cursor-pointer"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-gray-600 cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500 font-semibold">
                  Terms and Conditions
                </Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500 font-semibold">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !agreedToTerms}
              className="w-full py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-[1.02] font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center group"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Creating Account...
                </div>
              ) : (
                <>
                  Create Free Account
                  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Image/Info */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500 via-purple-500 to-secondary-500 animate-gradient"></div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-secondary-300/20 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-accent-pink/10 rounded-full blur-2xl animate-float" style={{animationDelay: '5s'}}></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white w-full">
          {/* Header */}
          <div className="text-center mb-10 animate-slide-down">
            <h1 className="text-5xl font-bold mb-4">Welcome to TravelStay</h1>
            <p className="text-xl opacity-90">Your gateway to amazing travel experiences</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4 mb-10 w-full max-w-md animate-fade-in">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center transform hover:scale-105 transition-all"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-3xl font-bold mb-1">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features */}
          <div className="space-y-3 w-full max-w-md mb-10 animate-slide-up">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start space-x-3 bg-white/10 backdrop-blur-md rounded-xl p-4 transform hover:scale-105 hover:bg-white/20 transition-all"
                style={{animationDelay: `${0.5 + index * 0.1}s`}}
              >
                <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <div className="text-xl">{feature.icon}</div>
                </div>
                <div>
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm opacity-90">{feature.text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Travel Icon */}
          <div className="animate-bounce-slow">
            <FaPlane className="text-6xl opacity-20" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;