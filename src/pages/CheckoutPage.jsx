import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import {
  FaUser, FaCheck, FaPhone, FaEnvelope, FaHome, FaCity,
  FaMapMarkerAlt, FaLock, FaShieldAlt, FaTag
} from 'react-icons/fa';
import { MdLocalOffer, MdSecurity } from 'react-icons/md';
import { clearCart } from '../store/slices/cartSlice';
import API_CONFIG, { buildApiUrl, getAuthHeader } from '../config/api.config';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    specialRequests: ''
  });

  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    if (items.length === 0 && !paymentSuccess) {
      navigate('/cart');
    }
  }, [user, items, navigate, paymentSuccess]);

  const calculateTotal = () => {
   
    const subtotal = items.reduce((total, item) => {
      const nights = item.quantity || item.nights || 1;
      const price = item.totalPrice || (item.price * nights);
      return total + price;
    }, 0);
    const taxes = subtotal * 0.18; // 18% GST
    const discountAmount = (subtotal * discount) / 100;
    return {
      subtotal,
      taxes,
      discount: discountAmount,
      total: subtotal + taxes - discountAmount
    };
  };

  const { subtotal, taxes, discount: discountAmount, total } = calculateTotal();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const applyPromoCode = () => {
    const promoCodes = {
      'SAVE10': 10,
      'SAVE20': 20,
      'WELCOME15': 15
    };

    if (promoCodes[promoCode.toUpperCase()]) {
      setDiscount(promoCodes[promoCode.toUpperCase()]);
      toast.success(`Promo code applied! ${promoCodes[promoCode.toUpperCase()]}% off`);
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handlePayment = async () => {
    // Validate form
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in your name and email');
      return;
    }

    if (!formData.phone || !formData.address || !formData.city || !formData.zipCode || !formData.state) {
      toast.error('Please fill in all billing address fields');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/hotels');
      return;
    }

    setIsProcessing(true);

    try {
      // Get token
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to continue');
        navigate('/login');
        return;
      }

    
      const cartItemIds = items.map(item => {
     
        return item._id || item.id || null;
      }).filter(id => id !== null);

      console.log('=== CHECKOUT CALCULATION ===');
      console.log('Subtotal (before GST):', subtotal);
      console.log('Taxes (GST 18%):', taxes);
      console.log('Discount:', discountAmount);
      console.log('FINAL TOTAL (subtotal + taxes - discount):', total);
      console.log('Verification: ', subtotal, '+', taxes, '-', discountAmount, '=', total);
      console.log('Amount in Paise being sent:', Math.round(total * 100));
      console.log('Sending checkout request with items:', cartItemIds);

      const requestBody = {
        cartItemIds: cartItemIds.length > 0 ? cartItemIds : undefined,
        totalAmount: Math.round(total * 100) / 100, // Total with GST in rupees
        amountInPaise: Math.round(total * 100), // Total with GST in paise for Razorpay
        subtotal: Math.round(subtotal * 100) / 100,
        taxes: Math.round(taxes * 100) / 100,
        discount: Math.round(discountAmount * 100) / 100,
        promoCode: discount > 0 ? promoCode : null,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        },
        specialRequests: formData.specialRequests || '',
        items: items.map(item => ({
          hotelId: item.hotelId,
          hotelName: item.hotelName,
          roomType: item.roomType,
          checkInDate: item.checkInDate,
          checkOutDate: item.checkOutDate,
          price: item.price,
          nights: item.quantity || item.nights || 1,
          totalPrice: item.totalPrice || (item.price * (item.quantity || item.nights || 1))
        }))
      };

      console.log('REQUEST BODY BEING SENT:', requestBody);
      console.log('VERIFY totalAmount includes GST:', requestBody.totalAmount);

      
      const response = await fetch(buildApiUrl('/payment/checkout'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      console.log('Checkout response:', data);

      if (!response.ok) {
        console.error('Checkout failed:', data);
        throw new Error(data.error || data.message || 'Failed to create order');
      }

      if (!data.orderId) {
        throw new Error('No order ID received from server');
      }

      console.log('=== RAZORPAY INITIALIZATION ===');
      console.log('Amount from backend (in paise):', data.amount);
      console.log('Amount from backend (in rupees):', data.amount / 100);
      console.log('Local total (in rupees) with GST:', total);
      console.log('Subtotal:', subtotal);
      console.log('GST (18%):', taxes);
      console.log('Final amount being used:', data.amount || Math.round(total * 100));

     
      const finalAmount = data.amount || Math.round(total * 100);

     
      const options = {
        key: data.key || 'rzp_test_TKVlloXlym3fFS',
        amount: finalAmount, // This MUST include GST
        currency: data.currency || 'INR',
        name: 'Mini OTA Hotel Booking',
        description: `Booking for ${items.length} hotel(s)`,
        order_id: data.orderId,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          contact: formData.phone
        },

        
        handler: async function (response) {
          try {
          
            const verifyResponse = await fetch(buildApiUrl('/payment/verify'), {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                ...getAuthHeader()
              },
              body: JSON.stringify({
                razorpay_order_id: data.orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentId: data.paymentId,
                totalAmount: Math.round(total * 100) / 100
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.success) {
              setPaymentSuccess(true);
              dispatch(clearCart());
              toast.success('Payment successful! Booking confirmed.');

              setTimeout(() => {
                navigate('/bookings');
              }, 3000);
            } else {
              toast.error('Payment verification failed');
              setIsProcessing(false);
            }
          } catch (verifyError) {
            console.error('Verification error:', verifyError);
            toast.error('Payment verification failed. Please contact support.');
            setIsProcessing(false);
          }
        },
        
        theme: {
          color: '#FF6B6B'
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
            toast.info('Payment cancelled');
          }
        }
      };

     
      if (!window.Razorpay) {
        throw new Error('Razorpay SDK not loaded. Please refresh the page.');
      }

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        console.error('Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setIsProcessing(false);
      });

      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error.message || 'Failed to process payment');
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center animate-slide-up">
          <div className="w-32 h-32 bg-gradient-to-r from-green-400 to-green-600 rounded-full mx-auto mb-6 flex items-center justify-center animate-bounce-slow">
            <FaCheck className="text-6xl text-white" />
          </div>
          <h2 className="text-4xl font-bold gradient-text mb-4">Payment Successful!</h2>
          <p className="text-gray-600 mb-2">Your booking has been confirmed</p>
          <p className="text-sm text-gray-500">Redirecting to your bookings...</p>

          <div className="flex justify-center mt-8 space-x-2">
            <div className="w-3 h-3 bg-primary-500 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
            <div className="w-3 h-3 bg-secondary-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
            <div className="w-3 h-3 bg-accent-purple rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center gradient-text mb-8">Complete Your Booking</h1>

        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              {/* Guest Information */}
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <FaUser className="text-primary-500" />
                Guest Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="+91 98765 43210"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Billing Address */}
              <h3 className="text-lg font-semibold mb-4">Billing Address</h3>

              <div className="space-y-4 mb-6">
                <div className="relative">
                  <FaHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Street Address *"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="relative">
                    <FaCity className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="City *"
                      required
                    />
                  </div>

                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="ZIP Code *"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="State *"
                    required
                  />

                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="India">India</option>
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                  </select>
                </div>
              </div>

              {/* Special Requests */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests (Optional)</label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  rows="3"
                  placeholder="Any special requests or preferences..."
                />
              </div>

              {/* Security Badge */}
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl flex items-center gap-4 mb-6">
                <FaShieldAlt className="text-3xl text-green-500" />
                <div>
                  <p className="font-semibold text-gray-800">100% Secure Payment</p>
                  <p className="text-sm text-gray-600">Your payment is processed securely through Razorpay</p>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full px-8 py-4 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-xl hover:from-primary-600 hover:to-secondary-600 transition-all transform hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <FaLock />
                    Pay ₹{total.toFixed(2)} with Razorpay
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-4 text-white">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <MdLocalOffer />
                  Order Summary
                </h3>
              </div>

              <div className="p-4">
                {/* Items */}
                <div className="space-y-3 mb-4">
                  {items.map((item, index) => (
                    <div key={index} className="flex gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.quantity || item.nights || 1} nights</p>
                        <p className="font-semibold text-primary-600">₹{item.totalPrice || item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Promo Code */}
                {/* <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 text-sm"
                      placeholder="Enter code"
                    />
                    <button
                      onClick={applyPromoCode}
                      className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:from-primary-600 hover:to-secondary-600 text-sm"
                    >
                      Apply
                    </button>
                  </div>
                  {discount > 0 && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      <FaTag />
                      {discount}% discount applied!
                    </p>
                  )}
                </div> */}

                {/* Price Breakdown */}
                <div className="space-y-2 py-4 border-t">
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">Subtotal</p>
                    <p className="font-medium">₹{subtotal.toFixed(2)}</p>
                  </div>
                  <div className="flex justify-between text-sm">
                    <p className="text-gray-600">Taxes (GST)</p>
                    <p className="font-medium">₹{taxes.toFixed(2)}</p>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <p>Discount</p>
                      <p className="font-medium">-₹{discountAmount.toFixed(2)}</p>
                    </div>
                  )}
                  <div className="pt-3 border-t">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-semibold">Total</p>
                      <p className="text-2xl font-bold gradient-text">₹{total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Security Note */}
                <div className="mt-4 text-center">
                  <img src="https://cdn.razorpay.com/static/assets/logo/payment.svg" alt="Razorpay" className="h-8 mx-auto mb-2" />
                  <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                    <MdSecurity className="text-green-500" />
                    Secure SSL Encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;