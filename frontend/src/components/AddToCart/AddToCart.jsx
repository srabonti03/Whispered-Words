import React, { useEffect, useState } from "react";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";
import { FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Loader from "../Loader/Loader";

function AddToCart() {
  const [Cart, setCart] = useState([]);
  const [Total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3001/api/v1/getusercart", { headers });
        setCart(res.data.cart);
        const total = res.data.cart.reduce((sum, item) => sum + item.price, 0);
        setTotal(total);
      } catch (err) {
        console.error("Error fetching cart:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const deleteItem = async (bookid) => {
    try {
      const res = await axios.put(
        `http://localhost:3001/api/v1/removebookfromcart`,
        {},
        {
          headers: {
            ...headers,
            bookid,
          },
        }
      );

      setCart(res.data.cart);
      const total = res.data.cart.reduce((sum, item) => sum + item.price, 0);
      setTotal(total);

      alert("Item removed from cart successfully!");

      if (res.data.cart.length === 0) {
        navigate("/Books");
      }
    } catch (err) {
      console.error("Error deleting item:", err);
      alert("There was an error removing the item from your cart. Please try again.");
    }
  };

  const PlaceOrder = async () => {
    if (Cart.length === 0) {
      alert("Your cart is empty. Add items to your cart before placing an order.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:3001/api/v1/placeorder",
        { order: Cart },
        { headers }
      );
      console.log("Response Data:", response.data);
      if (response.status === 201) {
        setCart([]);
        setTotal(0);
        alert(
          `✅ Order Placed Successfully with Cash on Delivery!\n\n🛒 Total Amount:\n💳 ${Total.toFixed(2)} Tk`
        );
        navigate('/PaymentInvoice');
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert(
        `❌ Failed to place the order. ${
          error.response?.data?.message || error.message || 'Please try again.'
        }`
      );
    }
  };

  const handlePayment = () => {
    if (paymentMethod === "cod") {
      PlaceOrder();
      navigate("/PaymentInvoice");
    } else if (paymentMethod === "card") {
      navigate("/CardPayment");
    }else if (paymentMethod === "bkash") {
      navigate("/BkashPayment");
    } else {
      alert("Please select a payment method.");
    }
  };

  return (
    <motion.div
      className="bg-zinc-900 px-12 py-8 flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {loading ? (
        <div className="flex items-center justify-center my-8 bg-zinc-900">
          <Loader />
        </div>
      ) : Cart.length === 0 ? (
        <div className="flex items-center justify-center min-h-screen bg-zinc-900 text-center">
          <div className="flex flex-col items-center justify-center space-y-6">
            <motion.p
              className="text-yellow-100 text-3xl md:text-4xl font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              Looks like your cart is feeling a bit lonely.{" "}
              <span className="text-yellow-400">Fill it with some amazing books!</span>
            </motion.p>
            <motion.div
              className="flex items-center justify-center p-4 shadow-lg"
              initial={{ x: -50 }}
              animate={{ x: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 25 }}
            >
              <FaShoppingCart size={80} color="white" />
            </motion.div>
          </div>
        </div>
      ) : (
        <>
          <motion.h1
            className="text-4xl text-yellow-100 font-semibold mb-8 text-center"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            Items <span className="text-yellow-300">You’ve Chosen</span>
          </motion.h1>

          <div className="overflow-y-auto flex-grow">
            {Cart.map((items, i) => (
              <motion.div
                key={i}
                className="w-full my-4 rounded flex flex-col md:flex-row p-4 bg-zinc-800 justify-between items-center"
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <img src={`http://localhost:3001${items.url}`} alt={items.title} className="h-[20vh] md:h-[10vh] object-cover" />
                <div className="w-full md:w-auto">
                  <h1 className="text-2xl text-zinc-100 font-semibold text-start mt-2 md:mt-0">
                    {items.title}
                  </h1>
                  <p className="text-normal text-zinc-300 mt-2">{items.desc.slice(0, 100)}...</p>
                </div>
                <div className="flex mt-4 w-full md:w-auto items-center justify-between">
                  <h2 className="text-zinc-100 text-3xl font-semibold flex">{items.price} TK</h2>
                  <button
                    className="bg-red-100 text-red-700 border-red-700 p-2 ms-12"
                    onClick={() => deleteItem(items._id)}
                  >
                    <AiFillDelete size={24} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-xl text-zinc-100">Total: {Total.toFixed(2)} TK</h2>
          </motion.div>
        </>
      )}

      {Cart.length > 0 && (
        <motion.div
          className="w-full mt-4 flex items-center justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="p-4 bg-zinc-800 rounded w-full md:w-[400px]">
            <h1 className="text-3xl text-yellow-600 font-semibold">Select Payment Method</h1>
            <div className="mt-4 flex flex-col space-y-4">
              <button
                className={`py-2 px-4 rounded ${
                  paymentMethod === "cod" ? "bg-green-600 text-white" : "bg-zinc-100 text-zinc-800"
                }`}
                onClick={() => setPaymentMethod("cod")}
              >
                Cash on Delivery (COD)
              </button>
              <button
                className={`py-2 px-4 rounded ${
                  paymentMethod === "card" ? "bg-blue-600 text-white" : "bg-zinc-100 text-zinc-800"
                }`}
                onClick={() => setPaymentMethod("card")}
              >
                Credit Card
              </button>
              <button
                className={`py-2 px-4 rounded ${
                  paymentMethod === "bkash" ? "bg-pink-600 text-white" : "bg-zinc-100 text-zinc-800"
                }`}
                onClick={() => setPaymentMethod("bkash")}
              >
                bKash
              </button>
            </div>
            <button
              className="bg-yellow-600 text-white rounded px-4 py-2 flex justify-center w-full mt-4 font-semibold hover:bg-yellow-700"
              onClick={handlePayment}
            >
              Proceed
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default AddToCart;
