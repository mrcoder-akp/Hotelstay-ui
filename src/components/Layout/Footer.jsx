import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">TravelStay</h3>
            <p className="text-gray-400">
              Your trusted partner for finding the perfect accommodation for your travels.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-gray-400 hover:text-white transition">
                  Search Hotels
                </Link>
              </li>
              <li>
                <Link to="/bookings" className="text-gray-400 hover:text-white transition">
                  My Bookings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li className="text-gray-400">Help Center</li>
              <li className="text-gray-400">Terms of Service</li>
              <li className="text-gray-400">Privacy Policy</li>
              <li className="text-gray-400">Contact Us</li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <FaFacebook className="text-2xl text-gray-400 hover:text-white cursor-pointer transition" />
              <FaTwitter className="text-2xl text-gray-400 hover:text-white cursor-pointer transition" />
              <FaInstagram className="text-2xl text-gray-400 hover:text-white cursor-pointer transition" />
              <FaLinkedin className="text-2xl text-gray-400 hover:text-white cursor-pointer transition" />
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
          <p>&copy; 2024 TravelStay. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;