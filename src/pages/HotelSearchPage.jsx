import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import { FaMapMarkerAlt, FaCalendarAlt, FaUsers, FaStar, FaFilter, FaSort } from 'react-icons/fa';
import { fetchHotels, setSearchParams } from '../store/slices/hotelSlice';

const HotelSearchPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { hotels, searchParams, isLoading, totalPages, currentPage } = useSelector(state => state.hotels);

  const [filters, setFilters] = useState({
    destination: searchParams.destination || '',
    checkin: searchParams.checkin ? new Date(searchParams.checkin) : null,
    checkout: searchParams.checkout ? new Date(searchParams.checkout) : null,
    guests: searchParams.guests || 1,
    minPrice: '',
    maxPrice: '',
    sort: 'rating'
  });

  const [page, setPage] = useState(1);

  useEffect(() => {
    if (filters.destination) {
      const params = {
        destination: filters.destination,
        checkin: filters.checkin?.toISOString(),
        checkout: filters.checkout?.toISOString(),
        guests: filters.guests,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        sort: filters.sort,
        page,
        limit: 10
      };

      dispatch(fetchHotels(params));
    }
  }, [dispatch, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    getData();
  };

  useEffect(() => {
    getData();
  }, [])

  const getData = () => {
    setPage(1);
    const params = {
      destination: filters.destination,
      checkin: filters.checkin?.toISOString(),
      checkout: filters.checkout?.toISOString(),
      guests: filters.guests,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      sort: filters.sort,
      page: 1,
      limit: 10
    };
    dispatch(setSearchParams(params));
    dispatch(fetchHotels(params));
  }






  const calculateNights = () => {
    if (filters.checkin && filters.checkout) {
      const nights = Math.ceil((filters.checkout - filters.checkin) / (1000 * 60 * 60 * 24));
      return nights > 0 ? nights : 0;
    }
    return 0;
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Search Header */}
      <div className="bg-primary-600 py-6">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaMapMarkerAlt className="inline mr-1" />
                  Destination
                </label>
                <input
                  type="text"
                  value={filters.destination}
                  onChange={(e) => setFilters({ ...filters, destination: e.target.value })}
                  placeholder="City or Hotel"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaCalendarAlt className="inline mr-1" />
                  Check-in
                </label>
                <DatePicker
                  selected={filters.checkin}
                  onChange={(date) => setFilters({ ...filters, checkin: date })}
                  minDate={new Date()}
                  placeholderText="Select date"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaCalendarAlt className="inline mr-1" />
                  Check-out
                </label>
                <DatePicker
                  selected={filters.checkout}
                  onChange={(date) => setFilters({ ...filters, checkout: date })}
                  minDate={filters.checkin || new Date()}
                  placeholderText="Select date"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <FaUsers className="inline mr-1" />
                  Guests
                </label>
                <select
                  value={filters.guests}
                  onChange={(e) => setFilters({ ...filters, guests: Number(e.target.value) })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                >
                  {[1, 2, 3, 4, 5, 6].map(n => (
                    <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <FaFilter className="mr-2" />
                Filters
              </h3>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium mb-3">Price Range (per night)</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                  />
                </div>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <h4 className="font-medium mb-3 flex items-center">
                  <FaSort className="mr-2" />
                  Sort By
                </h4>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-primary-500"
                >
                  <option value="rating">Rating</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="name">Name</option>
                </select>
              </div>

              <button
                onClick={handleSearch}
                className="w-full bg-primary-600 text-white py-2 rounded-lg hover:bg-primary-700 transition"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {/* Hotel Results */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex justify-between items-center">
              <h2 className="text-2xl font-bold">
                {hotels.length} Hotels Found {filters.destination && `in ${filters.destination}`}
              </h2>
              {calculateNights() > 0 && (
                <span className="text-gray-600">
                  {calculateNights()} night{calculateNights() > 1 ? 's' : ''}
                </span>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                <p className="mt-4 text-gray-600">Loading hotels...</p>
              </div>
            ) : hotels.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-12 text-center">
                <p className="text-gray-600">No hotels found. Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {hotels.map(hotel => (
                  <div key={hotel._id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                    <div className="md:flex">
                      <div className="md:w-1/3">
                        <img
                          src={hotel.images?.[0] || 'https://via.placeholder.com/400x300'}
                          alt={hotel.name}
                          className="w-full h-48 md:h-full object-cover"
                        />
                      </div>
                      <div className="md:w-2/3 p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{hotel.name}</h3>
                            <p className="text-gray-600 mb-2">
                              <FaMapMarkerAlt className="inline mr-1" />
                              {hotel.destination}
                            </p>
                            <div className="flex items-center mb-3">
                              <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                  <FaStar key={i} className={i < Math.floor(hotel.rating || 0) ? '' : 'text-gray-300'} />
                                ))}
                              </div>
                              <span className="ml-2 text-gray-600">
                                {hotel.rating} ({hotel.reviewCount || 0} reviews)
                              </span>
                            </div>
                            <p className="text-gray-700 mb-3 line-clamp-2">
                              {hotel.description}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {hotel.amenities?.slice(0, 5).map((amenity, index) => (
                                <span key={index} className="px-2 py-1 bg-gray-100 text-sm rounded">
                                  {amenity}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right ml-6">
                            <div className="text-2xl font-bold text-primary-600">
                              ₹{hotel.priceRange?.min || 0}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">per night</p>
                            {calculateNights() > 0 && (
                              <p className="text-sm text-gray-700 mb-3">
                                Total: ₹{(hotel.priceRange?.min || 0) * calculateNights()}
                              </p>
                            )}
                            <button
                              onClick={() => navigate(`/hotel/${hotel._id}`, {
                                state: {
                                  checkin: filters.checkin,
                                  checkout: filters.checkout,
                                  guests: filters.guests
                                }
                              })}
                              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
                            >
                              View Details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 space-x-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => setPage(i + 1)}
                        className={`px-4 py-2 border rounded-lg ${page === i + 1 ? 'bg-primary-600 text-white' : 'hover:bg-gray-100'
                          }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelSearchPage;