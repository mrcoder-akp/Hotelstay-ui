import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  FaArrowLeft, FaHotel, FaCalendarAlt, FaUsers, FaBed,
  FaCreditCard, FaMapMarkerAlt, FaPhone, FaEnvelope,
  FaPrint, FaDownload, FaCheck, FaTimes, FaClock,
  FaInfoCircle, FaReceipt, FaStar, FaWifi, FaParking,
  FaSwimmingPool, FaCoffee
} from 'react-icons/fa';
import { MdConfirmationNumber, MdPayment, MdLocationOn } from 'react-icons/md';
import axios from 'axios';
import API_CONFIG, { buildApiUrl, getAuthHeader } from '../config/api.config';

const BookingDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBookingDetails();
    } else {
      // Redirect to bookings page if no ID
      navigate('/bookings');
    }
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        toast.error('Please login to view booking details');
        navigate('/login');
        return;
      }

      // Fetch real booking details
      const bookingResponse = await axios.get(
        buildApiUrl(`/bookings/${id}`),
        { headers: getAuthHeader() }
      );

      // Handle both response formats - with or without success wrapper
      const bookingData = bookingResponse.data.data || bookingResponse.data;

      // Transform totalAmount to number if it's a string
      if (bookingData.totalAmount && typeof bookingData.totalAmount === 'string') {
        bookingData.totalAmount = parseFloat(bookingData.totalAmount);
      }

      setBooking(bookingData);

      // Hotel data is already included in booking response
      if (bookingData.hotel) {
        setHotel(bookingData.hotel);
      } else if (bookingData.hotelId) {
          // Fetch hotel details if not included
          try {
            const hotelResponse = await axios.get(
              buildApiUrl(`/hotels/${bookingData.hotelId}`)
            );

            if (hotelResponse.data.success) {
              setHotel(hotelResponse.data.data);
            }
          } catch (hotelError) {
            console.error('Failed to fetch hotel details:', hotelError);
            toast.error('Failed to load hotel information');
        }
      }
    } catch (error) {
      console.error('Error fetching booking:', error);
      if (error.response?.status === 404) {
        toast.error('Booking not found');
      } else if (error.response?.status === 401) {
        toast.error('Session expired. Please login again');
        navigate('/login');
      } else {
        toast.error('Failed to load booking details');
      }
      navigate('/bookings');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-blue-100 text-blue-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      refunded: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: <FaClock className="text-yellow-600" />,
      confirmed: <FaCheck className="text-green-600" />,
      cancelled: <FaTimes className="text-red-600" />,
      completed: <FaCheck className="text-blue-600" />
    };
    return icons[status] || <FaInfoCircle className="text-gray-600" />;
  };

  const calculateNights = () => {
    if (!booking) return 0;
    const checkIn = new Date(booking.checkInDate);
    const checkOut = new Date(booking.checkOutDate);
    return Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.info('Download feature coming soon!');
  };

  const handleCancelBooking = async () => {
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
        buildApiUrl(`/bookings/${id}/cancel`),
        {},
        { headers: getAuthHeader() }
      );

      if (response.data.success) {
        toast.success('Booking cancelled successfully');
        fetchBookingDetails();
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!booking || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
            <FaReceipt className="text-4xl text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Booking Found</h2>
          <p className="text-gray-600 mb-6">
            Unable to load booking details. Please try again.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/bookings')}
              className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700 transition font-semibold"
            >
              View My Bookings
            </button>
            <button
              onClick={() => navigate('/hotels')}
              className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Browse Hotels
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={() => navigate('/bookings')}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-4 transition"
          >
            <FaArrowLeft />
            Back to Bookings
          </button>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Booking Details</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/90">
                <span className="flex items-center gap-2">
                  <MdConfirmationNumber />
                  Booking ID: {booking.bookingReference}
                </span>
                <span className="flex items-center gap-2">
                  <FaCalendarAlt />
                  Booked on: {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <FaPrint />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <FaDownload />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Status Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-600 font-medium">Booking Status</h3>
                  {getStatusIcon(booking.status)}
                </div>
                <span className={`inline-block px-4 py-2 rounded-full font-semibold ${getStatusColor(booking.status)}`}>
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-600 font-medium">Payment Status</h3>
                  <MdPayment className="text-gray-600 text-xl" />
                </div>
                <span className={`inline-block px-4 py-2 rounded-full font-semibold ${getPaymentStatusColor(booking.paymentStatus)}`}>
                  {booking.paymentStatus.charAt(0).toUpperCase() + booking.paymentStatus.slice(1)}
                </span>
              </div>
            </div>

            {/* Hotel Information */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaHotel className="text-primary-600" />
                  Hotel Information
                </h2>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex gap-4">
                    {hotel.images && hotel.images[0] && (
                      <img
                        src={hotel.images[0]}
                        alt={hotel.name}
                        className="w-32 h-24 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{hotel.name}</h3>
                      <p className="flex items-center gap-2 text-gray-600 mb-2">
                        <MdLocationOn className="text-primary-600" />
                        {hotel.destination || hotel.address?.city || 'Location'}
                      </p>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={`${i < Math.floor(hotel.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                        <span className="text-gray-600 ml-2">({hotel.rating})</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-gray-600 mb-1">Address</p>
                      <p className="font-medium">
                        {hotel.address ? `${hotel.address.street}, ${hotel.address.city}, ${hotel.address.state}` : hotel.destination || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Contact</p>
                      <p className="font-medium">{hotel.contact?.phone || 'N/A'}</p>
                    </div>
                  </div>

                  {hotel.amenities && (
                    <div>
                      <p className="text-gray-600 mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.slice(0, 6).map((amenity, index) => (
                          <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <FaCalendarAlt className="text-primary-600" />
                  Booking Information
                </h2>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-gray-600 mb-1">Check-in Date</p>
                    <p className="font-semibold text-lg">
                      {new Date(booking.checkInDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-500">After 3:00 PM</p>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-1">Check-out Date</p>
                    <p className="font-semibold text-lg">
                      {new Date(booking.checkOutDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-500">Before 12:00 PM</p>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-1">Duration</p>
                    <p className="font-semibold text-lg">
                      {calculateNights()} Night{calculateNights() > 1 ? 's' : ''}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-1">Number of Rooms</p>
                    <p className="font-semibold text-lg flex items-center gap-2">
                      <FaBed className="text-primary-600" />
                      {booking.numberOfRooms || 1} Room{(booking.numberOfRooms || 1) > 1 ? 's' : ''}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-1">Number of Guests</p>
                    <p className="font-semibold text-lg flex items-center gap-2">
                      <FaUsers className="text-primary-600" />
                      {booking.numberOfGuests || booking.guests || 2} Guest{(booking.numberOfGuests || booking.guests || 2) > 1 ? 's' : ''}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-1">Room Type</p>
                    <p className="font-semibold text-lg">
                      {booking.roomType || 'Deluxe Room'}
                    </p>
                  </div>

                  <div>
                    <p className="text-gray-600 mb-1">Total Amount</p>
                    <p className="font-bold text-2xl text-primary-600">
                      ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {booking.specialRequests && (
                  <div className="mt-6 pt-6 border-t">
                    <p className="text-gray-600 mb-2">Special Requests</p>
                    <p className="bg-gray-50 p-4 rounded-lg">{booking.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-6 py-4">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FaReceipt />
                  Price Summary
                </h3>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Room Charges</span>
                  <span className="font-medium">₹{((booking.totalAmount || 0) * 0.85).toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxes & Fees (GST)</span>
                  <span className="font-medium">₹{((booking.totalAmount || 0) * 0.15).toFixed(0)}</span>
                </div>
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-lg">Total Paid</span>
                    <span className="font-bold text-2xl text-primary-600">
                      ₹{(booking.totalAmount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-yellow-50 rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-yellow-600" />
                Important Information
              </h3>

              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <FaCheck className="text-green-600 mt-0.5" />
                  <span>Valid ID proof required at check-in</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheck className="text-green-600 mt-0.5" />
                  <span>Check-in time: 3:00 PM</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaCheck className="text-green-600 mt-0.5" />
                  <span>Check-out time: 12:00 PM</span>
                </li>
                <li className="flex items-start gap-2">
                  <FaInfoCircle className="text-blue-600 mt-0.5" />
                  <span>Free cancellation up to 72 hours before check-in</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {booking.status === 'confirmed' && (
                <button
                  onClick={handleCancelBooking}
                  className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 transition font-semibold"
                >
                  Cancel Booking
                </button>
              )}

              <button
                onClick={() => navigate('/search')}
                className="w-full bg-primary-600 text-white py-3 rounded-xl hover:bg-primary-700 transition font-semibold"
              >
                Book Another Hotel
              </button>

              <button
                onClick={() => navigate('/support')}
                className="w-full bg-white border-2 border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition font-semibold"
              >
                Need Help?
              </button>
            </div>

            {/* Contact Support */}
            <div className="bg-gray-100 rounded-xl p-6 text-center">
              <h4 className="font-semibold mb-3">Need Assistance?</h4>
              <p className="text-sm text-gray-600 mb-4">Our support team is here to help</p>
              <div className="space-y-2">
                <a href="tel:+918888888888" className="flex items-center justify-center gap-2 text-primary-600 font-medium">
                  <FaPhone />
                  +91 88888 88888
                </a>
                <a href="mailto:support@miniota.com" className="flex items-center justify-center gap-2 text-primary-600 font-medium">
                  <FaEnvelope />
                  support@miniota.com
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailPage;