import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import DatePicker from 'react-datepicker';
import { toast } from 'react-toastify';
import { FaMapMarkerAlt, FaStar, FaWifi, FaParking, FaSwimmingPool, FaDumbbell, FaCoffee, FaBed, FaUsers, FaCalendarAlt, FaCheck, FaShoppingCart } from 'react-icons/fa';
import { fetchHotelById } from '../store/slices/hotelSlice';
import { addToCart } from '../store/slices/cartSlice';

const HotelDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedHotel, isLoading } = useSelector(state => state.hotels);
  const { user } = useSelector(state => state.auth);
  const { isLoading: cartLoading } = useSelector(state => state.cart);

  const [selectedRoom, setSelectedRoom] = useState(null);
  const [checkInDate, setCheckInDate] = useState(location.state?.checkin || null);
  const [checkOutDate, setCheckOutDate] = useState(location.state?.checkout || null);
  const [guests, setGuests] = useState(location.state?.guests || 1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loadingRoomId, setLoadingRoomId] = useState(null);
  const [availabilityChecked, setAvailabilityChecked] = useState(false);
  const [checkingAvailability, setCheckingAvailability] = useState(false);

  useEffect(() => {
    const params = {
      checkin: checkInDate?.toISOString(),
      checkout: checkOutDate?.toISOString(),
      guests
    };
    dispatch(fetchHotelById({ id, params }));
   
    setAvailabilityChecked(false);
  }, [dispatch, id, checkInDate, checkOutDate, guests]);

  const calculateNights = () => {
    if (checkInDate && checkOutDate) {
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  const handleCheckAvailability = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    setCheckingAvailability(true);

    try {
     
      const params = {
        checkin: checkInDate.toISOString(),
        checkout: checkOutDate.toISOString(),
        guests
      };
      await dispatch(fetchHotelById({ id, params })).unwrap();
      setAvailabilityChecked(true);

    
      if (selectedHotel?.rooms?.some(room => room.availability > 0)) {
        toast.success('Rooms are available for your selected dates!');
      } else {
        toast.warning('No rooms available for these dates. Please try different dates.');
      }
    } catch (error) {
      toast.error('Failed to check availability. Please try again.');
    } finally {
      setCheckingAvailability(false);
    }
  };

  const handleAddToCart = async (room) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (!availabilityChecked) {
      toast.error('Please check availability first');
      return;
    }

    if (room.availability === 0) {
      toast.error('This room is not available for the selected dates');
      return;
    }

    const cartItem = {
      hotelId: selectedHotel._id,
      roomId: room.roomId,
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      guests
    };

   
    setLoadingRoomId(room.roomId);

    try {
      await dispatch(addToCart(cartItem)).unwrap();
      toast.success('Room added to cart successfully!');
    } catch (error) {
      toast.error(error || 'Failed to add to cart');
    } finally {
    
      setLoadingRoomId(null);
    }
  };

  const amenityIcons = {
    'WiFi': <FaWifi />,
    'Parking': <FaParking />,
    'Pool': <FaSwimmingPool />,
    'Gym': <FaDumbbell />,
    'Restaurant': <FaCoffee />,
    'Spa': <FaCoffee />,
    'Bar': <FaCoffee />
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!selectedHotel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-600">Hotel not found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Image Gallery */}
      <div className="relative h-96 bg-gray-900">
        {selectedHotel.images && selectedHotel.images.length > 0 ? (
          <>
            <img
              src={selectedHotel.images[activeImageIndex]}
              alt={selectedHotel.name}
              className="w-full h-full object-cover opacity-90"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {selectedHotel.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === activeImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <img
            src="https://via.placeholder.com/1200x400"
            alt={selectedHotel.name}
            className="w-full h-full object-cover"
          />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="container mx-auto px-4 h-full flex items-end pb-8">
            <div className="text-white">
              <h1 className="text-4xl font-bold mb-2">{selectedHotel.name}</h1>
              <p className="text-xl mb-2">
                <FaMapMarkerAlt className="inline mr-2" />
                {selectedHotel.destination}
              </p>
              <div className="flex items-center">
                <div className="flex text-yellow-400 mr-2">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < Math.floor(selectedHotel.rating || 0) ? '' : 'text-gray-400'} />
                  ))}
                </div>
                <span>{selectedHotel.rating} ({selectedHotel.reviewCount || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">About This Hotel</h2>
              <p className="text-gray-700 leading-relaxed">{selectedHotel.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedHotel.amenities?.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-primary-600 text-xl">
                      {amenityIcons[amenity] || <FaCheck />}
                    </span>
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Rooms */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-4">
                {availabilityChecked ? 'Available Rooms' : 'Room Options'}
              </h2>

              {!availabilityChecked && checkInDate && checkOutDate && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm">
                    <FaCalendarAlt className="inline mr-2" />
                    Please check availability for your selected dates to see real-time room availability and prices.
                  </p>
                </div>
              )}

              {selectedHotel.rooms && selectedHotel.rooms.length > 0 ? (
                <div className="space-y-4">
                  {selectedHotel.rooms.map((room) => (
                    <div key={room.roomId} className="border rounded-lg p-4 hover:border-primary-500 transition">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{room.name}</h3>
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div className="flex items-center text-gray-600">
                              <FaBed className="mr-2" />
                              <span>{room.bedType || 'Standard Bed'}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <FaUsers className="mr-2" />
                              <span>Max {room.capacity} guests</span>
                            </div>
                          </div>
                          <p className="text-gray-700 mb-3">{room.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {room.amenities?.map((amenity, idx) => (
                              <span key={idx} className="px-2 py-1 bg-gray-100 text-sm rounded">
                                {amenity}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600">
                            Room size: {room.size || 'Standard'}
                          </p>
                        </div>

                        <div className="text-right ml-6">
                          <div className="text-2xl font-bold text-primary-600">
                            ₹{room.price}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">per night</p>
                          {calculateNights() > 0 && (
                            <p className="text-sm font-semibold mb-3">
                              Total: ₹{room.price * calculateNights()}
                            </p>
                          )}
                          {availabilityChecked && (
                            <p className={`text-sm mb-3 font-medium ${
                              room.availability > 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {room.availability > 0
                                ? `${room.availability} rooms available`
                                : 'Not available for selected dates'
                              }
                            </p>
                          )}
                          {!availabilityChecked && (
                            <p className="text-sm text-gray-500 mb-3">
                              Check availability to see room status
                            </p>
                          )}
                          <button
                            onClick={() => handleAddToCart(room)}
                            disabled={loadingRoomId === room.roomId || !availabilityChecked || (availabilityChecked && room.availability === 0)}
                            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {loadingRoomId === room.roomId ? 'Adding...' :
                             !availabilityChecked ? 'Check Availability First' :
                             room.availability === 0 ? 'Not Available' : 'Add to Cart'
                            }
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600">No rooms available for the selected dates</p>
              )}
            </div>

            {/* Policies */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h2 className="text-2xl font-semibold mb-4">Hotel Policies</h2>
              <div className="space-y-3">
                {selectedHotel.policies?.checkInTime && (
                  <div>
                    <strong>Check-in:</strong> {selectedHotel.policies.checkInTime}
                  </div>
                )}
                {selectedHotel.policies?.checkOutTime && (
                  <div>
                    <strong>Check-out:</strong> {selectedHotel.policies.checkOutTime}
                  </div>
                )}
                {selectedHotel.policies?.cancellation && (
                  <div>
                    <strong>Cancellation:</strong> {selectedHotel.policies.cancellation}
                  </div>
                )}
                {selectedHotel.policies?.childPolicy && (
                  <div>
                    <strong>Child Policy:</strong> {selectedHotel.policies.childPolicy}
                  </div>
                )}
                {selectedHotel.policies?.petPolicy && (
                  <div>
                    <strong>Pet Policy:</strong> {selectedHotel.policies.petPolicy}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden sticky top-20">
              {/* Header */}
              <div className="bg-gradient-to-r from-primary-600 to-secondary-600 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">Book Your Stay</h3>
                <p className="text-sm opacity-90">Best Price Guaranteed!</p>
              </div>

              <div className="p-6">
                <div className="space-y-5">
                  {/* Check-in Date */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <FaCalendarAlt className="mr-2 text-primary-600" />
                      Check-in Date
                    </label>
                    <DatePicker
                      selected={checkInDate}
                      onChange={setCheckInDate}
                      minDate={new Date()}
                      placeholderText="Select check-in date"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 hover:border-gray-300 transition-colors"
                      dateFormat="dd MMM yyyy"
                    />
                  </div>

                  {/* Check-out Date */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <FaCalendarAlt className="mr-2 text-primary-600" />
                      Check-out Date
                    </label>
                    <DatePicker
                      selected={checkOutDate}
                      onChange={setCheckOutDate}
                      minDate={checkInDate || new Date()}
                      placeholderText="Select check-out date"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 hover:border-gray-300 transition-colors"
                      dateFormat="dd MMM yyyy"
                    />
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                      <FaUsers className="mr-2 text-primary-600" />
                      Number of Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 hover:border-gray-300 transition-colors bg-white"
                    >
                      {[1,2,3,4,5,6].map(n => (
                        <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* Booking Summary */}
                  {checkInDate && checkOutDate && calculateNights() > 0 ? (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 space-y-4">
                      <h4 className="font-bold text-gray-800 text-lg mb-3">Booking Summary</h4>

                      {/* Dates Display */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Check-in:</span>
                          <span className="font-semibold">{checkInDate.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Check-out:</span>
                          <span className="font-semibold">{checkOutDate.toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}</span>
                        </div>
                      </div>

                      <div className="border-t pt-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-bold text-lg text-primary-600">
                            {calculateNights()} Night{calculateNights() > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Guests:</span>
                          <span className="font-semibold">{guests} Guest{guests > 1 ? 's' : ''}</span>
                        </div>
                      </div>

                      <div className="border-t pt-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600">Price per night:</span>
                          <div className="text-right">
                            <div className="text-sm text-gray-500 line-through">
                              ₹{selectedHotel.priceRange?.max}
                            </div>
                            <div className="font-bold text-green-600">
                              From ₹{selectedHotel.priceRange?.min}
                            </div>
                          </div>
                        </div>

                        {/* Estimated Total */}
                        <div className="bg-primary-50 rounded-lg p-3 mt-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-700 font-medium">Estimated Total:</span>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary-600">
                                ₹{(selectedHotel.priceRange?.min * calculateNights()).toLocaleString('en-IN')}
                              </div>
                              <div className="text-xs text-gray-500">+ taxes & fees</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Features */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✓ Free Cancellation</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">✓ No Prepayment</span>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">✓ Best Price</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-50 rounded-xl p-5 text-center">
                      <FaCalendarAlt className="text-4xl text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 font-medium">Select your dates</p>
                      <p className="text-sm text-gray-400 mt-1">Choose check-in and check-out dates to see availability and prices</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {checkInDate && checkOutDate && calculateNights() > 0 && (
                      <button
                        onClick={handleCheckAvailability}
                        disabled={checkingAvailability}
                        className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 rounded-xl hover:from-primary-700 hover:to-secondary-700 transition-all transform hover:scale-[1.02] font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {checkingAvailability ? 'Checking...' :
                         availabilityChecked ? 'Refresh Availability' : 'Check Availability'
                        }
                      </button>
                    )}

                    <button
                      onClick={() => navigate('/cart')}
                      className="w-full bg-white border-2 border-primary-600 text-primary-600 py-3 rounded-xl hover:bg-primary-50 transition-all font-semibold flex items-center justify-center gap-2"
                    >
                      <FaShoppingCart />
                      View Cart
                    </button>
                  </div>

                  {/* Help Text */}
                  <div className="text-center pt-3">
                    <p className="text-xs text-gray-500">
                      Need help? Call us at
                      <a href="tel:+918888888888" className="text-primary-600 font-semibold ml-1">+91 88888 88888</a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelDetailPage;