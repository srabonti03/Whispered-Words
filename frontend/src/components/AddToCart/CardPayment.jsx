import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { motion } from 'framer-motion';

const CardPayment = () => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvc: '',
    cardName: '',
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
  }, []);

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const placeOrderCardPayment = async () => {
    if (cart.length === 0) {
      alert('Your cart is empty. Add items to your cart before placing an order.');
      return;
    }

    if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvc || !paymentDetails.cardName) {
      alert('Please fill in all payment details.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3001/api/v1/cardpayment',
        { order: cart, paymentDetails },
        { headers }
      );
      if (response.status === 201) {
        setCart([]);
        setTotal(0);
        alert(
          `✅ Order Placed Successfully with Credit Card!\n\n🛒 Total Amount:\n💳 ${response.data.totalAmount.toFixed(2)} Tk`
        );
        navigate('/PaymentInvoice');
      }
    } catch (error) {
      alert(`❌ Failed to place the order. ${error.response?.data?.message || 'Please try again.'}`);
    }
  };

  const maskCardNumber = (cardNumber) => {
    return cardNumber.length >= 4
      ? `**** **** **** ${cardNumber.slice(-4)}`
      : 'XXXX XXXX XXXX XXXX';
  };

  const handleCancel = () => {
    navigate('/Cart');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900">
      <div
        className="absolute top-0 left-0 w-full h-full bg-cover bg-center z-0"
        style={{
          backgroundImage: 'url(./cardbg.jpg)',
          filter: 'blur(2px)',
        }}
      ></div>
      <div
        className="absolute top-0 left-0 w-full h-full bg-blue-600 opacity-30"
        style={{ mixBlendMode: 'overlay' }}
      ></div>

      {loading ? (
        <div className="flex items-center justify-center h-screen z-10">
          <Loader />
        </div>
      ) : (
        <motion.div
          className="w-full max-w-2xl sm:max-w-md p-4 bg-gray-800 rounded-lg shadow-2xl z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ marginTop: '-5rem', marginBottom: '0.5rem' }}
        >
          <div className="relative w-full mb-6">
            <div
              className="w-full h-64 rounded-lg p-6 shadow-lg relative"
              style={{
                backgroundImage: 'url(./card.jpg)',
                backgroundSize: '150%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundBlendMode: 'overlay',
              }}
            >
              <div className="absolute top-2 right-4 text-white font-bold text-xl">Credit Card</div>
              <div className="text-white text-2xl tracking-wider font-mono mt-32">
                {maskCardNumber(paymentDetails.cardNumber)}
              </div>
              <div className="flex justify-between text-white mt-4 text-lg">
                <span>{paymentDetails.cardName || 'Cardholder Name'}</span>
                <span>{paymentDetails.expiryDate || 'MM/YY'}</span>
              </div>
            </div>
          </div>

          <input
            type="text"
            name="cardNumber"
            placeholder="Card Number"
            value={paymentDetails.cardNumber}
            onChange={handlePaymentChange}
            className="w-full mb-3 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-white text-lg"
          />
          <input
            type="text"
            name="expiryDate"
            placeholder="Expiry Date (MM/YY)"
            value={paymentDetails.expiryDate}
            onChange={handlePaymentChange}
            className="w-full mb-3 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-white text-lg"
          />
          <input
            type="text"
            name="cvc"
            placeholder="CVC"
            value={paymentDetails.cvc}
            onChange={handlePaymentChange}
            className="w-full mb-3 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-white text-lg"
          />
          <input
            type="text"
            name="cardName"
            placeholder="Name on Card"
            value={paymentDetails.cardName}
            onChange={handlePaymentChange}
            className="w-full mb-4 px-4 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-900 text-white text-lg"
          />

          <div className="flex space-x-4">
            <button
              onClick={placeOrderCardPayment}
              className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg shadow-lg transition duration-300 text-lg"
            >
              Place Order
            </button>
            <button
              onClick={handleCancel}
              className="w-full py-2 bg-gray-500 hover:bg-gray-600 text-black font-bold rounded-lg shadow-lg transition duration-300 text-lg"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CardPayment;
