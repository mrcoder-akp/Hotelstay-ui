import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';

// Layout
import Layout from './components/Layout/Layout';
import PrivateRoute from './components/PrivateRoute';

// Pages
import HomePage from './pages/HomePage';
import HotelSearchPage from './pages/HotelSearchPage';
import HotelDetailPage from './pages/HotelDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingsPage from './pages/BookingsPage';
import BookingDetailPage from './pages/BookingDetailPage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<HotelSearchPage />} />
            <Route path="/hotel/:id" element={<HotelDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<PrivateRoute><CartPage /></PrivateRoute>} />
            <Route path="/checkout" element={<PrivateRoute><CheckoutPage /></PrivateRoute>} />
            <Route path="/bookings" element={<PrivateRoute><BookingsPage /></PrivateRoute>} />
            <Route path="/booking/:id" element={<PrivateRoute><BookingDetailPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Router>
    </Provider>
  );
}

export default App
