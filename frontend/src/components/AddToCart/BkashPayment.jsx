import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { FaCartPlus, FaPhoneAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';

const BkashPayment = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    bkashPhoneNumber: '',
    pin: '',
  });
  const headers = { Authorization: `Bearer ${localStorage.getItem('token')}` };
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await axios.get('http://localhost:3001/api/v1/getusercart', { headers });
        setCart(res.data.cart);
        const total = res.data.cart.reduce((sum, item) => sum + item.price, 0);
        setTotal(total);
      } catch (err) {
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();

    setPaymentDetails({
      bkashPhoneNumber: '',
      pin: '',
    });

  }, []);

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;

    if (name === 'bkashPhoneNumber') {
      let formattedNumber = value.replace(/\D/g, '');

      if (formattedNumber.length === 11 && formattedNumber.startsWith('01')) {
        formattedNumber = '+880' + formattedNumber.slice(1);
      } else {
        formattedNumber = formattedNumber.slice(0, 11);
      }

      setPaymentDetails((prevState) => ({
        ...prevState,
        [name]: formattedNumber,
      }));
    } else {
      setPaymentDetails((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handlePinChange = (e) => {
    const { value } = e.target;

    if (value.length <= 5) {
      setPaymentDetails((prevState) => ({
        ...prevState,
        pin: value,
      }));
    }
  };

  const placeOrderBkashPayment = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Add items to your cart before placing an order.');
      return;
    }

    const phoneRegex = /^\+8801\d{9}$/;
    if (!phoneRegex.test(paymentDetails.bkashPhoneNumber)) {
      alert('Please enter a valid bKash phone number.');
      return;
    }

    if (paymentDetails.pin.length !== 5) {
      alert('Please enter a valid 5-digit PIN.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3001/api/v1/bkashpayment',
        { order: cart, paymentDetails },
        { headers }
      );
      if (response.status === 201) {
        setCart([]);
        setTotal(0);
        alert(`✅ Order Placed Successfully with bKash!\n\n🛒 Total Amount: 💳 ${response.data.totalAmount.toFixed(2)} Tk`);
        navigate('/PaymentInvoice');
      }
    } catch (error) {
      alert(`❌ Failed to place the order. ${error.response?.data?.message || 'Please try again.'}`);
    }
  };

  return (
    <motion.div 
      className="flex items-center justify-center min-h-screen bg-white bg-cover bg-center bg-no-repeat backdrop-blur-3xl" 
      style={{ backgroundImage: "url('./bkashbg.jpg')" }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {loading ? (
        <Loader />
      ) : (
        <motion.div 
          className="bg-white max-w-lg w-full p-8 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <img
              src="./bkash.jpg"
              alt="bKash Logo"
              className="w-65 mx-auto mb-4"
              onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }}
            />
          </div>

          <div className="w-full h-2 bg-pink-600 mb-6"></div>

          <motion.div
            className="mb-4"
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center text-gray-700 mb-4">
              <div className="flex items-center space-x-2">
                <FaCartPlus className="text-xl text-pink-600" />
                <span className="font-semibold text-gray-500">Whispered Words</span>
              </div>
              <span className="font-semibold text-2xl text-gray-500">{Math.round(total)} TK</span>
            </div>
          </motion.div>

          <motion.div 
            className="mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="bkashPhoneNumber" className="block text-sm font-medium text-gray-700">bKash Account Number</label>
            <input
              id="bkashPhoneNumber"
              type="tel"
              name="bkashPhoneNumber"
              placeholder="Your bKash Account number"
              value={paymentDetails.bkashPhoneNumber}
              onChange={handlePaymentChange}
              maxLength={20}
              autoComplete="off"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </motion.div>

          <motion.div
            className="mb-6"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <label htmlFor="pin" className="block text-sm font-medium text-gray-700">PIN</label>
            <input
              id="pin"
              type="password"
              name="pin"
              placeholder="Enter PIN"
              value={paymentDetails.pin}
              onChange={handlePinChange}
              maxLength={5}
              autoComplete="off"
              className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </motion.div>

          <div className="text-sm text-gray-500 mb-4">
            By clicking Confirm, you are agreeing to the <a href="/terms" className="text-pink-400 font-semibold">Terms and Conditions</a>.
          </div>

          <motion.div
            className="flex justify-between mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <button
              onClick={placeOrderBkashPayment}
              className="w-[48%] bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-bold transition duration-300"
            >
              Confirm
            </button>
            <button
              onClick={() => navigate('/Cart')}
              className="w-[48%] bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg font-bold transition duration-300"
            >
              Close
            </button>
          </motion.div>

          <motion.div
            className="mt-4 text-center text-gray-600"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <FaPhoneAlt className="inline text-white bg-pink-600 text-3xl rounded-full p-2" />
            <span className="font-bold text-pink-600"> 16247</span>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default BkashPayment;
