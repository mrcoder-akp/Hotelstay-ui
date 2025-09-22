import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import {
  FaTrash, FaShoppingCart, FaCalendarAlt, FaUsers, FaBed,
  FaMapMarkerAlt, FaCheck, FaTimes, FaHotel,
  FaReceipt, FaTag, FaInfoCircle
} from 'react-icons/fa';
import { MdPayment } from 'react-icons/md';
import { fetchCart, removeFromCart, updateCartItem, clearCart } from '../store/slices/cartSlice';
import { format } from 'date-fns';

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items = [], isLoading = false } = useSelector(state => state.cart || {});
  const { user } = useSelector(state => state.auth);
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [dispatch, user]);


  const handleRemoveItem = async (itemId) => {
    try {
      await dispatch(removeFromCart(itemId)).unwrap();
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleUpdateGuests = async (itemId, guests) => {
    try {
      await dispatch(updateCartItem({ itemId, guests })).unwrap();
      toast.success('Cart updated');
    } catch {
      toast.error('Failed to update cart');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await dispatch(clearCart()).unwrap();
        toast.success('Cart cleared');
      } catch {
        toast.error('Failed to clear cart');
      }
    }
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  const applyPromoCode = () => {
    const promoCodes = {
      'SAVE10': 10,
      'SAVE20': 20,
      'WELCOME15': 15,
      'SUMMER25': 25
    };

    if (promoCodes[promoCode.toUpperCase()]) {
      setDiscountPercent(promoCodes[promoCode.toUpperCase()]);
      toast.success(`Promo code applied! ${promoCodes[promoCode.toUpperCase()]}% off`);
    } else {
      setDiscountPercent(0);
      toast.error('Invalid promo code');
    }
  };

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Not specified';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid date';
      return format(date, 'MMM dd, yyyy');
    } catch {
      return dateString || 'Not specified';
    }
  };

  const calculateNights = (checkin, checkout) => {
    try {
      if (!checkin || !checkout) return 1;
      const checkInDate = new Date(checkin);
      const checkOutDate = new Date(checkout);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 1;
    } catch {
      return 1;
    }
  };

  const calculateTotals = () => {
    let subtotal = 0;

    if (items?.length > 0) {
      items.forEach(item => {
        if (item) {
          let nights = 1;
          if (item.nights) nights = item.nights;
          else if (item.checkInDate && item.checkOutDate) {
            nights = calculateNights(item.checkInDate, item.checkOutDate);
          }

          const price = item.price || 0;
          const itemTotal = item.totalPrice || (price * nights);
          subtotal += itemTotal;
        }
      });
    }

    const taxRate = 0.18; // 18% GST
    const taxes = subtotal * taxRate;
    const discountAmount = (subtotal * discountPercent) / 100;
    const grandTotal = subtotal + taxes - discountAmount;

    return {
      subtotal: Math.round(subtotal),
      taxes: Math.round(taxes),
      discountAmount: Math.round(discountAmount),
      grandTotal: Math.round(grandTotal)
    };
  };

  const totals = calculateTotals();

  // If not logged in
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-12 max-w-md mx-auto">
          <FaShoppingCart className="text-6xl text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-4">Please Login to View Your Cart</h2>
          <p className="text-gray-600 mb-6">Sign in to access your saved items and continue booking</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition font-semibold"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Main Cart
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold flex items-center">
              <FaShoppingCart className="mr-3 text-primary-600" />
              Shopping Cart
              <span className="ml-3 bg-primary-600 text-white px-3 py-1 rounded-full text-sm">
                {items.length} {items.length === 1 ? 'Item' : 'Items'}
              </span>
            </h1>
            {items.length > 0 && (
              <button
                onClick={handleClearCart}
                className="text-red-600 hover:text-red-700 transition flex items-center gap-2"
              >
                <FaTrash />
                Clear Cart
              </button>
            )}
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <FaShoppingCart className="text-8xl text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8 text-lg">Start adding hotels to your cart to plan your perfect trip!</p>
            <button
              onClick={() => navigate('/search')}
              className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white px-8 py-3 rounded-lg hover:from-primary-700 hover:to-secondary-700 transition font-semibold text-lg"
            >
              Browse
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item, index) => {
                if (!item) return null;

                let nights = 1;
                if (item.nights) nights = item.nights;
                else if (item.checkInDate && item.checkOutDate) {
                  nights = calculateNights(item.checkInDate, item.checkOutDate);
                }

                const roomPrice = item.price || 0;
                const itemTotal = item.totalPrice || (roomPrice * nights);

                return (
                  <div key={item._id || index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="p-6">
                      {/* Hotel Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-lg p-3">
                              <FaHotel className="text-2xl text-primary-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-gray-800 mb-1">
                                {item.hotelName || 'Hotel Name'}
                              </h3>
                              <p className="text-gray-600 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-primary-600 text-sm" />
                                {item.destination || 'Location'}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item._id)}
                          className="text-red-500 hover:text-red-700 transition p-2 hover:bg-red-50 rounded-lg"
                          title="Remove from cart"
                        >
                          <FaTimes className="text-xl" />
                        </button>
                      </div>

                      {/* Room Details */}
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-semibold text-gray-800">{item.roomName || 'Room Type'}</p>
                            <p className="text-sm text-gray-600">{item.roomType || 'Standard Room'}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-primary-600">₹{roomPrice.toLocaleString('en-IN')}</p>
                            <p className="text-xs text-gray-500">per night</p>
                          </div>
                        </div>

                        {/* Dates */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-3">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaCalendarAlt className="mr-2 text-primary-600 text-sm" />
                              <p className="text-xs font-medium">Check-in</p>
                            </div>
                            <p className="font-semibold text-gray-800">{item.checkInDate ? formatDate(item.checkInDate) : 'Not set'}</p>
                          </div>
                          <div className="bg-white rounded-lg p-3">
                            <div className="flex items-center text-gray-600 mb-1">
                              <FaCalendarAlt className="mr-2 text-primary-600 text-sm" />
                              <p className="text-xs font-medium">Check-out</p>
                            </div>
                            <p className="font-semibold text-gray-800">{item.checkOutDate ? formatDate(item.checkOutDate) : 'Not set'}</p>
                          </div>
                        </div>

                        {/* Nights & Guests */}
                        <div className="flex items-center justify-between bg-white rounded-lg p-3">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <FaBed className="text-primary-600" />
                              <span className="font-medium">{nights} Night{nights > 1 ? 's' : ''}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FaUsers className="text-primary-600" />
                              <select
                                value={item.guests || 1}
                                onChange={(e) => handleUpdateGuests(item._id, Number(e.target.value))}
                                className="border border-gray-300 rounded px-3 py-1 text-sm focus:outline-none focus:border-primary-500"
                              >
                                {[1,2,3,4,5,6].map(n => (
                                  <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                                ))}
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Price Breakdown */}
                      <div className="border-t pt-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Room charges ({nights} × ₹{roomPrice.toLocaleString('en-IN')})</span>
                          <span className="font-semibold">₹{(roomPrice * nights).toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-semibold text-gray-800">Item Total</span>
                          <span className="text-2xl font-bold text-primary-600">₹{itemTotal.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-xl overflow-hidden sticky top-20">
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <FaReceipt /> Booking Summary
                  </h2>
                </div>

                <div className="p-6">
                  {/* Items Summary */}
                  <div className="space-y-3 mb-6">
                    <h3 className="font-semibold text-gray-800 mb-3">Items ({items.length})</h3>
                    {items.map((item, index) => {
                      if (!item) return null;
                      let nights = 1;
                      if (item.nights) nights = item.nights;
                      else if (item.checkInDate && item.checkOutDate) {
                        nights = calculateNights(item.checkInDate, item.checkOutDate);
                      }
                      const price = item.price || 0;
                      const itemTotal = item.totalPrice || (price * nights);
                      return (
                        <div key={item._id || index} className="flex justify-between text-sm">
                          <div className="flex-1">
                            <p className="font-medium text-gray-700">{item.roomName || 'Room'}</p>
                            <p className="text-xs text-gray-500">{nights} night{nights > 1 ? 's' : ''}</p>
                          </div>
                          <span className="font-semibold">₹{itemTotal.toLocaleString('en-IN')}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Promo Code */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaTag className="inline mr-1" /> Promo Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-primary-500 text-sm"
                        placeholder="Enter code"
                      />
                      <button
                        onClick={applyPromoCode}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm font-medium"
                      >
                        Apply
                      </button>
                    </div>
                    {discountPercent > 0 && (
                      <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                        <FaCheck /> {discountPercent}% discount applied!
                      </p>
                    )}
                  </div>

                  {/* Price Details */}
                  <div className="space-y-3 pb-4 border-b">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">₹{totals.subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxes & Fees (GST 18%)</span>
                      <span className="font-medium">₹{totals.taxes.toLocaleString('en-IN')}</span>
                    </div>
                    {discountPercent > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount ({discountPercent}%)</span>
                        <span className="font-medium">-₹{totals.discountAmount.toLocaleString('en-IN')}</span>
                      </div>
                    )}
                  </div>

                  {/* Grand Total */}
                  <div className="py-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">Total Amount</span>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-primary-600">₹{totals.grandTotal.toLocaleString('en-IN')}</p>
                        <p className="text-xs text-gray-500">Inclusive of all taxes</p>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-primary-600 to-secondary-600 text-white py-4 rounded-xl hover:from-primary-700 hover:to-secondary-700 transition font-semibold text-lg mb-3 flex items-center justify-center gap-2"
                  >
                    <MdPayment /> Proceed to Checkout
                  </button>

                  <button
                    onClick={() => navigate('/hotels')}
                    className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 transition text-sm font-medium"
                  >
                    Continue Shopping
                  </button>

                  {/* Booking Benefits */}
                  <div className="mt-6 bg-blue-50 rounded-lg p-4 text-sm">
                    <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-1">
                      <FaInfoCircle /> Booking Benefits
                    </h4>
                    <ul className="space-y-1 text-blue-700">
                      <li>✓ Free cancellation on most hotels</li>
                      <li>✓ 24/7 customer support</li>
                      <li>✓ Secure payment guarantee</li>
                      <li>✓ Price match assurance</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
