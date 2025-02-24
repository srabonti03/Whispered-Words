import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { FaDownload } from "react-icons/fa";
import { jsPDF } from "jspdf";
import Loader from "../Loader/Loader";

const PaymentInvoice = () => {
  const { timestamp } = useParams();
  const decodedTimestamp = decodeURIComponent(timestamp);
  const [isScrolling, setIsScrolling] = useState(false);
  const [orderDetails, setOrderDetails] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const headers = {
    id: localStorage.getItem("id"),
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:3001/api/v1/invoice", { headers });
      if (response.data.user) {
        setUserDetails(response.data.user);
      }
      setOrderDetails(response.data.orders || []);
    } catch (err) {
      console.error("Error fetching order details:", err);
      alert("There was an error fetching your order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderByTimestamp = async (timestamp) => {
    setLoading(true);
    try {
      const decodedTimestamp = decodeURIComponent(timestamp);
      const formattedTimestamp = new Date(decodedTimestamp).toISOString();
      const response = await axios.get(`http://localhost:3001/api/v1/invoice/timestamp/${formattedTimestamp}`, {
        headers,
      });
      if (response.data.user) {
        setUserDetails(response.data.user);
      }
      setOrderDetails(response.data.orders || []);
    } catch (err) {
      console.error("Error fetching order details:", err);
      alert("There was an error fetching your order details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (timestamp) {
      fetchOrderByTimestamp(timestamp);
    } else {
      fetchOrderDetails();
    }
  }, [timestamp]);

  if (loading) {
    return <Loader />;
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const setPageStyle = () => {
        doc.setFillColor(26, 32, 44);
        doc.rect(0, 0, 210, 297, "F");

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(255, 255, 255);
    };

    setPageStyle();

    const logoPath = "/logo.png";
    const centerY = 30;
    const shiftRight = 10;

    try {
        doc.addImage(logoPath, "PNG", 40 + shiftRight, centerY - 15, 30, 30);
    } catch (error) {
        console.error("Error loading logo image:", error);
    }

    doc.text("Whispered Words", 75 + shiftRight, centerY - 5);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(169, 169, 169);
    doc.text("Your one-stop destination for handpicked books.", 75 + shiftRight, centerY + 5);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    const title = "Transaction Receipt";

    const titleWidth = doc.getTextWidth(title);
    const centerX = 105;
    const linePadding = 30;
    const lineY = 55;

    const lineXStart = centerX - titleWidth / 8 - linePadding;
    doc.setLineWidth(2);
    doc.setDrawColor(255, 255, 0);
    doc.line(20, lineY - 2, lineXStart, lineY - 2);

    doc.text(title, centerX, lineY, { align: "center" });

    const lineXEnd = centerX + titleWidth / 8 + linePadding;
    doc.line(lineXEnd, lineY - 2, 190, lineY - 2);

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Order Details", 20, 70);
    doc.setFont("helvetica", "normal");
    doc.text(`Order No: ${orderDetails[0]?.orderNumber || "N/A"}`, 20, 78);
    doc.text(`Payment Method: ${orderDetails[0]?.paymentMethod || "N/A"}`, 20, 85);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 92);
    doc.text(`Time: ${new Date().toLocaleTimeString()}`, 20, 99);

    doc.setFont("helvetica", "bold");
    doc.text("Customer Details", 190, 70, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text(`Username: ${userDetails?.username || "N/A"}`, 190, 78, { align: "right" });
    doc.text(`Email: ${userDetails?.email || "N/A"}`, 190, 85, { align: "right" });
    doc.text(`Address: ${userDetails?.address || "N/A"}`, 190, 92, { align: "right" });

    let yPosition = 110;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Book Image", 25, yPosition);
    doc.text("Title", 80, yPosition);
    doc.text("Author", 130, yPosition);
    doc.text("Price", 180, yPosition, { align: "right" });

    doc.setLineWidth(0.5);
    doc.setDrawColor(255, 255, 255);
    doc.line(20, yPosition + 2, 190, yPosition + 2);

    const wrapText = (doc, text, x, y, maxWidth, columnHeight) => {
        const lines = doc.splitTextToSize(text, maxWidth);
        const textHeight = lines.length * 5;
        const offsetY = (columnHeight - textHeight) / 2;
        lines.forEach((line, index) => {
            doc.text(line, x, y + offsetY + index * 5);
        });
    };

    const imageSize = 30;
    const columnHeight = 20;

    orderDetails.forEach((order) => {
        yPosition += columnHeight + 20;

        const bookImageY = yPosition - imageSize / 2 + columnHeight / 2;
        const bookImage = `http://localhost:3001${order.book.url}`;

        try {
            doc.addImage(bookImage, "PNG", 25, bookImageY, imageSize, imageSize);
        } catch (error) {
            console.error("Error loading book image:", error);
        }

        doc.setFont("helvetica", "normal");

        wrapText(doc, order.book.title, 80, yPosition, 40, columnHeight);
        wrapText(doc, order.book.author, 130, yPosition, 40, columnHeight);

        doc.text(
            `${order.book.price} TK`,
            180,
            yPosition + columnHeight / 2 - 3,
            { align: "right" }
        );
    });

    const totalAmount = orderDetails.reduce(
        (total, order) => total + order.book.price * (order.quantity || 1),
        0
    );

    yPosition += 35;
    doc.setLineWidth(0.5);
    doc.setDrawColor(255, 255, 255);
    doc.line(20, yPosition + 2, 190, yPosition + 2);

    yPosition += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 0);
    doc.text(`Total Amount: ${totalAmount} TK`, 180, yPosition, { align: "right" });

    const pageHeight = doc.internal.pageSize.height;
    const footerYPosition = pageHeight - 25;

    if (yPosition + 40 > footerYPosition) {
        doc.addPage();
    }

    setPageStyle();
    const isFooterOnlyPage = yPosition + 40 > footerYPosition;
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(255, 255, 255);

    if (isFooterOnlyPage) {
        doc.text(
            "Thank you for shopping with Whispered Words. We hope to see you again soon.",
            105,
            50,
            { align: "center" }
        );

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(169, 169, 169);
        doc.text("© 2025 Whispered Words. All Rights Reserved.", 105, 60, { align: "center" });
    } else {
        doc.text(
            "Thank you for shopping with Whispered Words. We hope to see you again soon.",
            105,
            footerYPosition - 5,
            { align: "center" }
        );

        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(169, 169, 169);
        doc.text("© 2025 Whispered Words. All Rights Reserved.", 105, footerYPosition, { align: "center" });
    }

    doc.save("transaction_receipt.pdf");
};

  const formatBangladeshDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      timeZone: "Asia/Dhaka",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatBangladeshTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-GB", {
      timeZone: "Asia/Dhaka",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const handleScroll = (e) => {
    const scrollTop = e.target.scrollTop;
    setIsScrolling(scrollTop > 0);
};

  return (
  <div className="bg-slate-800 w-full py-8">
    <div className="invoice-container bg-zinc-900 text-white p-6 max-w-full sm:max-w-xl md:max-w-2xl lg:max-w-5xl mx-auto shadow-2xl">
      <motion.h1
        className="text-4xl font-bold text-yellow-300 mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        Transaction Receipt
      </motion.h1>

      <div className="details-container mb-6 p-4 bg-zinc-800 rounded-lg shadow-md border-l-8 border-yellow-300 w-full">
        <div className="flex justify-between space-x-6">
          <div className="order-details w-1/2 pr-4">
            <h2 className="text-xl font-semibold text-yellow-50 mb-4">Order Details</h2>
            <div className="text-zinc-300">
              <p className="mb-2"><strong>Order No:</strong> {orderDetails[0]?.orderNumber || "N/A"}</p>
              <p className="mb-2"><strong>Payment Method:</strong> {orderDetails[0]?.paymentMethod || "N/A"}</p>
              <p className="mb-2"><strong>Date:</strong> {formatBangladeshDate(orderDetails[0]?.createdAt)}</p>
              <p className="mb-2"><strong>Time:</strong> {formatBangladeshTime(orderDetails[0]?.createdAt)}</p>
            </div>
          </div>

          <div className="customer-details w-1/2 pl-4">
            <h2 className="text-xl font-semibold text-yellow-50 mb-4">Customer Details</h2>
            <div className="text-zinc-300">
              {userDetails ? (
                <>
                  <p className="mb-2"><strong>Username:</strong> {userDetails.username}</p>
                  <p className="mb-2"><strong>Email:</strong> {userDetails.email}</p>
                  <p className="mb-2"><strong>Address:</strong> {userDetails.address}</p>
                </>
              ) : (
                <div className="bg-zinc-900 text-white h-screen flex items-center justify-center">
                  <Loader />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center mt-4 text-zinc-300">
          <button
            onClick={handleDownloadPDF}
            className="text-lg text-yellow-200 hover:text-yellow-400 flex items-center gap-1"
          >
            Download Invoice <FaDownload />
          </button>
        </div>
      </div>

      <div className="order-summary mb-6 p-6 border-t-4 border-yellow-300 bg-zinc-800 rounded-lg shadow-md w-full">
        <h2 className="text-2xl font-semibold text-yellow-100 mb-4">Order Summary</h2>
        {orderDetails.map((order, index) => {
          const totalAmount = order.book.price * (order.quantity || 1);
          return (
            <div
              key={index}
              className="order-item mb-4 flex gap-4 items-center bg-slate-900 bg-opacity-60 p-4 rounded-lg shadow-sm w-full"
            >
              <div className="w-32 h-32 lg:w-40 lg:h-40 relative">
                <img
                  src={`http://localhost:3001${order.book.url}`}
                  alt={order.book.title}
                  className="w-full h-full object-cover rounded-lg shadow-md"
                />
              </div>
              <div className="order-details ml-4 flex-1 text-left">
                <h3 className="text-xl font-semibold text-yellow-300">{order.book.title}</h3>
                <p className="italic text-sm text-zinc-400">by {order.book.author}</p>
                <div className="relative overflow-hidden max-h-[15rem]">
                  <div
                    className="overflow-y-auto max-h-[18rem] scrollbar-none pr-2"
                    onScroll={handleScroll}
                  >
                    <p className="mt-1 text-gray-400">{order.book.desc}</p>
                  </div>
                  {isScrolling && (
                    <div className="absolute top-0 left-0 w-full h-12 bg-gradient-to-b from-zinc-900 to-transparent opacity-50 pointer-events-none"></div>
                  )}
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-zinc-900 to-transparent opacity-50 pointer-events-none"></div>
                </div>
                <p className="text-lg text-yellow-100 mt-2">Price: {order.book.price} TK</p>
              </div>
            </div>
          );
        })}
        <div className="total-amount p-4 text-right text-xl font-semibold text-yellow-300 w-full">
          <p>Total Amount: {orderDetails.reduce((total, order) => total + order.book.price * (order.quantity || 1), 0).toFixed(2)} TK</p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-8">
        <motion.button
          onClick={() => navigate("/Profile/orderhistory")}
          className="bg-yellow-300 text-zinc-900 px-6 py-2 rounded-lg shadow-md hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
        >
          Your Order Timeline
        </motion.button>
        <p className="text-zinc-300 text-sm font-medium italic text-center">
          Thank you for choosing Whispered Words! 📚✨
        </p>
      </div>
    </div>
  </div>
  );
};

export default PaymentInvoice;
