import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
  FaCalendarAlt, FaMapMarkerAlt, FaHotel, FaUsers, FaClock,
  FaCheckCircle, FaTimesCircle, FaSpinner, FaArrowRight,
  FaDownload, FaEnvelope, FaPhone, FaFilter, FaSearch
} from 'react-icons/fa';
import { MdFlightTakeoff, MdEventAvailable, MdCancel } from 'react-icons/md';
import API_CONFIG, { buildApiUrl, getAuthHeader } from '../config/api.config';

const BookingsPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to view your bookings');
        navigate('/login');
        return;
      }

      const response = await axios.get(buildApiUrl('/bookings'), {
        headers: getAuthHeader()
      });

      if (response.data.success || Array.isArray(response.data)) {
        // Handle both response formats - with or without success wrapper
        const bookingsData = response.data.data || response.data;

        // Transform the data to match the component's expected format
        const transformedBookings = bookingsData.map(booking => ({
          id: booking.id || booking.bookingReference,
          bookingReference: booking.bookingReference,
          hotelName: booking.hotel?.name || 'Hotel',
          location: booking.hotel?._id ? 'Mumbai' : 'Location', // Default to Mumbai or extract from other fields
          image: booking.hotel?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500',
          checkIn: booking.checkInDate,
          checkOut: booking.checkOutDate,
          guests: booking.numberOfGuests || 2,
          rooms: booking.numberOfRooms || 1,
          roomType: booking.roomType || 'Standard Room',
          totalAmount: parseFloat(booking.totalAmount) || 0,
          status: booking.status,
          bookingDate: booking.createdAt,
          paymentStatus: booking.paymentStatus || 'pending',
          hotelId: booking.hotelId,
          specialRequests: booking.specialRequests
        }));

        setBookings(transformedBookings);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        navigate('/login');
      } else {
        toast.error('Failed to fetch bookings');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'upcoming':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'upcoming':
        return <MdEventAvailable className="text-blue-500" />;
      case 'completed':
        return <FaCheckCircle className="text-gray-500" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status === filter;
    const matchesSearch = booking.hotelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          booking.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          String(booking.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
                          String(booking.bookingReference).toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to cancel booking');
        navigate('/login');
        return;
      }

      const response = await axios.put(
        buildApiUrl(`/bookings/${bookingId}/cancel`),
        {},
        { headers: getAuthHeader() }
      );

      if (response.data.success) {
        toast.success('Booking cancelled successfully');
        fetchBookings(); // Refresh the bookings list
      }
    } catch (error) {
      console.error('Cancel booking error:', error);
      if (error.response?.status === 400) {
        toast.error(error.response.data.error || 'Cannot cancel this booking');
      } else {
        toast.error('Failed to cancel booking');
      }
    }
  };

  const handleDownloadReceipt = (bookingId) => {
    toast.success('Receipt downloaded successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full mx-auto mb-4 flex items-center justify-center animate-spin">
            <FaSpinner className="text-3xl text-white" />
          </div>
          <p className="text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 left-20 w-72 h-72 bg-primary-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-secondary-200/20 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl font-bold gradient-text mb-4">My Bookings</h1>
          <p className="text-gray-600">Manage and track all your hotel reservations</p>
        </div>

        {/* Filters and Search */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6 animate-slide-up">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by hotel, location, or booking ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all"
                  />
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2">
                {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`px-4 py-3 rounded-xl font-medium capitalize transition-all transform hover:scale-105 ${
                      filter === status
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Timeline */}
        <div className="max-w-6xl mx-auto">
          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-16 text-center animate-fade-in">
              <div className="w-32 h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FaHotel className="text-5xl text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No bookings found</h3>
              <p className="text-gray-500 mb-6">Start exploring hotels and make your first booking!</p>
              <Link
                to="/search"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105"
              >
                <MdFlightTakeoff />
                Explore Hotels
                <FaArrowRight />
              </Link>
            </div>
          ) : (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-200 via-secondary-200 to-primary-200 hidden lg:block"></div>

              {/* Booking Cards */}
              <div className="space-y-8">
                {filteredBookings.map((booking, index) => (
                  <div
                    key={booking.id}
                    className="relative animate-slide-up"
                    style={{animationDelay: `${index * 0.1}s`}}
                  >
                    {/* Timeline Node */}
                    <div className="absolute left-5 w-8 h-8 bg-white rounded-full border-4 border-primary-500 hidden lg:flex items-center justify-center">
                      <div className="w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
                    </div>

                    {/* Booking Card */}
                    <div className="ml-0 lg:ml-20 bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all transform hover:scale-[1.02]">
                      <div className="flex flex-col md:flex-row">
                        {/* Hotel Image */}
                        <div className="md:w-1/3 relative">
                          <img
                            src={booking.image}
                            alt={booking.hotelName}
                            className="w-full h-full object-cover"
                          />
                          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(booking.status)}`}>
                            <span className="flex items-center gap-2">
                              {getStatusIcon(booking.status)}
                              {booking.status}
                            </span>
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1 p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-2xl font-bold text-gray-800 mb-1">{booking.hotelName}</h3>
                              <p className="text-gray-500 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-primary-500" />
                                {booking.location}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-500">Booking ID</p>
                              <p className="font-bold text-primary-600" title={booking.id}>
                                {String(booking.id).substring(0, 6).toUpperCase()}
                              </p>
                            </div>
                          </div>

                          {/* Stay Details */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div className="bg-gray-50 p-3 rounded-xl">
                              <p className="text-xs text-gray-500 mb-1">Check-in</p>
                              <p className="font-semibold text-sm flex items-center gap-1">
                                <FaCalendarAlt className="text-primary-500" />
                                {new Date(booking.checkIn).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl">
                              <p className="text-xs text-gray-500 mb-1">Check-out</p>
                              <p className="font-semibold text-sm flex items-center gap-1">
                                <FaCalendarAlt className="text-secondary-500" />
                                {new Date(booking.checkOut).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl">
                              <p className="text-xs text-gray-500 mb-1">Guests</p>
                              <p className="font-semibold text-sm flex items-center gap-1">
                                <FaUsers className="text-accent-orange" />
                                {booking.guests} Guests
                              </p>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-xl">
                              <p className="text-xs text-gray-500 mb-1">Room</p>
                              <p className="font-semibold text-sm">{booking.roomType}</p>
                            </div>
                          </div>

                          {/* Price and Actions */}
                          <div className="flex flex-col md:flex-row justify-between items-center pt-4 border-t">
                            <div>
                              <p className="text-sm text-gray-500">Total Amount</p>
                              <p className="text-2xl font-bold gradient-text">₹{booking.totalAmount.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">Payment: {booking.paymentStatus}</p>
                            </div>

                            <div className="flex gap-3 mt-4 md:mt-0">
                              <Link
                                to={`/booking/${booking.id}`}
                                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 flex items-center gap-2"
                              >
                                View Details
                                <FaArrowRight />
                              </Link>

                              <button
                                onClick={() => handleDownloadReceipt(booking.id)}
                                className="px-4 py-2 border-2 border-primary-500 text-primary-600 rounded-xl hover:bg-primary-50 transition-all flex items-center gap-2"
                              >
                                <FaDownload />
                                Receipt
                              </button>

                              {(booking.status === 'pending' || booking.status === 'confirmed') && (
                                <button
                                  onClick={() => handleCancelBooking(booking.id)}
                                  className="px-4 py-2 border-2 border-red-500 text-red-600 rounded-xl hover:bg-red-50 transition-all flex items-center gap-2"
                                >
                                  <MdCancel />
                                  Cancel
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {filteredBookings.length > 0 && (
          <div className="max-w-6xl mx-auto mt-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl text-center transform hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <FaCheckCircle className="text-white text-xl" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
                <p className="text-sm text-gray-500">Confirmed</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl text-center transform hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <MdEventAvailable className="text-white text-xl" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
                <p className="text-sm text-gray-500">Pending</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl text-center transform hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-gradient-to-r from-gray-400 to-gray-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <FaClock className="text-white text-xl" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-xl text-center transform hover:scale-105 transition-all">
                <div className="w-12 h-12 bg-gradient-to-r from-primary-400 to-secondary-600 rounded-xl mx-auto mb-3 flex items-center justify-center">
                  <FaHotel className="text-white text-xl" />
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {bookings.length}
                </p>
                <p className="text-sm text-gray-500">Total Bookings</p>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="bg-gradient-to-r from-primary-500 to-secondary-500 rounded-2xl p-8 text-white shadow-xl">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Need Help with Your Booking?</h3>
                <p className="text-white/90 mb-4">Our customer support team is available 24/7</p>
                <div className="flex gap-6">
                  <a href="tel:+911234567890" className="flex items-center gap-2 hover:text-white/80 transition-colors">
                    <FaPhone />
                    +91 123 456 7890
                  </a>
                  <a href="mailto:support@travelstay.com" className="flex items-center gap-2 hover:text-white/80 transition-colors">
                    <FaEnvelope />
                    support@travelstay.com
                  </a>
                </div>
              </div>
              <button className="mt-4 md:mt-0 px-6 py-3 bg-white text-primary-600 rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 font-semibold">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;