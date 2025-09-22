import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { FaSearch, FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaStar, FaHeart, FaWifi, FaParking, FaSwimmingPool, FaCoffee, FaArrowRight, FaPlay } from 'react-icons/fa';
import { MdLocationOn, MdTrendingUp } from 'react-icons/md';
import { fetchFeaturedHotels, setSearchParams } from '../store/slices/hotelSlice';

const HomePage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { featuredHotels } = useSelector(state => state.hotels);

  const [destination, setDestination] = useState('');
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [hoveredCard, setHoveredCard] = useState(null);

  useEffect(() => {
    dispatch(fetchFeaturedHotels());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!destination || !checkInDate || !checkOutDate) {
      alert('Please fill in all search fields');
      return;
    }

    dispatch(setSearchParams({
      destination,
      checkin: checkInDate.toISOString(),
      checkout: checkOutDate.toISOString(),
      guests
    }));

    navigate('/search');
  };

  const popularDestinations = [
    { name: 'Mumbai', image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=500', count: '250+ Hotels', gradient: 'from-purple-600 to-pink-600' },
    { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=500', count: '180+ Hotels', gradient: 'from-blue-600 to-cyan-600' },
    { name: 'New Delhi', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=500', count: '320+ Hotels', gradient: 'from-orange-600 to-red-600' },
    { name: 'Bangalore', image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=500', count: '200+ Hotels', gradient: 'from-green-600 to-teal-600' }
  ];

  const features = [
    { icon: <FaSearch />, title: 'Easy Search', desc: 'Find perfect hotels in seconds', color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
    { icon: <FaHeart />, title: 'Best Prices', desc: 'Guaranteed lowest rates', color: 'bg-gradient-to-br from-red-500 to-pink-600' },
    { icon: <FaStar />, title: 'Verified Reviews', desc: 'Real guest experiences', color: 'bg-gradient-to-br from-yellow-500 to-orange-600' },
    { icon: <FaMapMarkerAlt />, title: '500+ Cities', desc: 'Hotels worldwide', color: 'bg-gradient-to-br from-green-500 to-teal-600' }
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section with Video Background Effect */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600 via-purple-600 to-secondary-600 animate-gradient">
          <div className="absolute inset-0 bg-hero-pattern opacity-20"></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary-300/20 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>

        <div className="relative z-10 container mx-auto px-4 py-20">
          <div className="text-center text-white mb-12 animate-slide-down">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Discover Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Dream Stay
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Book hotels at unbeatable prices across 500+ cities
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mb-12">
              <div className="text-center animate-fade-in" style={{animationDelay: '0.5s'}}>
                <div className="text-3xl font-bold text-yellow-300">2M+</div>
                <div className="text-sm text-white/80">Happy Guests</div>
              </div>
              <div className="text-center animate-fade-in" style={{animationDelay: '0.7s'}}>
                <div className="text-3xl font-bold text-yellow-300">50K+</div>
                <div className="text-sm text-white/80">Hotels</div>
              </div>
              <div className="text-center animate-fade-in" style={{animationDelay: '0.9s'}}>
                <div className="text-3xl font-bold text-yellow-300">4.8★</div>
                <div className="text-sm text-white/80">Rating</div>
              </div>
            </div>
          </div>

          {/* Modern Search Form */}
          <div className="max-w-5xl mx-auto animate-slide-up">
            <div className="glass-effect rounded-3xl p-8 shadow-2xl">
              <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="md:col-span-1">
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaMapMarkerAlt className="inline mr-2 text-primary-500" />
                    Destination
                  </label>
                  <input
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    placeholder="Where to?"
                    className="input-modern"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaCalendarAlt className="inline mr-2 text-primary-500" />
                    Check-in
                  </label>
                  <DatePicker
                    selected={checkInDate}
                    onChange={setCheckInDate}
                    minDate={new Date()}
                    placeholderText="Select date"
                    className="input-modern"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaCalendarAlt className="inline mr-2 text-primary-500" />
                    Check-out
                  </label>
                  <DatePicker
                    selected={checkOutDate}
                    onChange={setCheckOutDate}
                    minDate={checkInDate || new Date()}
                    placeholderText="Select date"
                    className="input-modern"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    <FaUsers className="inline mr-2 text-primary-500" />
                    Guests
                  </label>
                  <select
                    value={guests}
                    onChange={(e) => setGuests(Number(e.target.value))}
                    className="input-modern"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>{num} {num === 1 ? 'Guest' : 'Guests'}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center group"
                  >
                    <FaSearch className="mr-2 group-hover:rotate-12 transition-transform" />
                    Search
                    <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-white animate-bounce-slow">
          <div className="flex flex-col items-center">
            <span className="text-sm mb-2">Scroll to explore</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 gradient-text">Why Choose TravelStay?</h2>
            <p className="text-gray-600 text-lg">Experience the best in hotel booking</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="card-modern p-8 text-center h-full card-hover">
                  <div className={`w-20 h-20 mx-auto mb-4 rounded-2xl ${feature.color} flex items-center justify-center text-white text-3xl transform group-hover:rotate-12 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels with Modern Cards */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Trending Now</span>
            <h2 className="text-4xl font-bold mt-2 mb-4">Featured Hotels</h2>
            <p className="text-gray-600 text-lg">Hand-picked properties with exceptional service</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {featuredHotels.map((hotel, index) => (
              <div
                key={hotel._id}
                className="group relative animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
                onMouseEnter={() => setHoveredCard(hotel._id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div className="card-modern overflow-hidden card-hover">
                  {/* Image Container */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={hotel.images?.[0] || 'https://via.placeholder.com/400x300'}
                      alt={hotel.name}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="font-semibold">Quick View</p>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                        Featured
                      </span>
                    </div>

                    {/* Favorite Button */}
                    <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors group/fav">
                      <FaHeart className="text-gray-400 group-hover/fav:text-red-500 transition-colors" />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl mb-2 line-clamp-1">{hotel.name}</h3>
                    <p className="text-gray-600 mb-3 flex items-center">
                      <MdLocationOn className="text-primary-500 mr-1" />
                      {hotel.destination}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400 mr-2">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < Math.floor(hotel.rating) ? '' : 'text-gray-300'} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {hotel.rating} ({hotel.reviewCount || 0})
                      </span>
                    </div>

                    {/* Amenities */}
                    <div className="flex gap-2 mb-4">
                      <span className="text-gray-400" title="WiFi"><FaWifi /></span>
                      <span className="text-gray-400" title="Parking"><FaParking /></span>
                      <span className="text-gray-400" title="Pool"><FaSwimmingPool /></span>
                      <span className="text-gray-400" title="Restaurant"><FaCoffee /></span>
                    </div>

                    {/* Price and Button */}
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-gray-500 text-sm">From</span>
                        <div className="text-2xl font-bold text-primary-600">
                          ₹{hotel.priceRange?.min || 0}
                          <span className="text-sm text-gray-600 font-normal">/night</span>
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/hotel/${hotel._id}`)}
                        className="bg-gradient-to-r from-primary-500 to-primary-600 text-white px-4 py-2 rounded-xl hover:from-primary-600 hover:to-primary-700 transition-all transform hover:scale-105"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations with Overlay */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Explore More</span>
            <h2 className="text-4xl font-bold mt-2 mb-4">Popular Destinations</h2>
            <p className="text-gray-600 text-lg">Discover amazing places around the world</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {popularDestinations.map((city, index) => (
              <div
                key={city.name}
                className="group relative h-80 rounded-2xl overflow-hidden cursor-pointer card-hover animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
                onClick={() => {
                  setDestination(city.name);
                  window.scrollTo(0, 0);
                }}
              >
                <img
                  src={city.image}
                  alt={city.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${city.gradient} opacity-60 group-hover:opacity-70 transition-opacity`}></div>
                <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
                  <h3 className="text-2xl font-bold mb-1">{city.name}</h3>
                  <p className="text-white/90">{city.count}</p>
                  <div className="mt-3 flex items-center text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>Explore</span>
                    <FaArrowRight className="ml-2 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-secondary-600">
          <div className="absolute inset-0 bg-hero-pattern opacity-10"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 text-white/90">Join millions of happy travelers</p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/search')}
              className="bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all shadow-xl"
            >
              Browse Hotels
            </button>
            <button
              onClick={() => navigate('/register')}
              className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white hover:text-primary-600 transform hover:scale-105 transition-all"
            >
              Sign Up Free
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H8a2 2 0 012-2v1h2V2a2 2 0 112 0v1h2a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5z" />
              </svg>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
              <span>Best Price Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;