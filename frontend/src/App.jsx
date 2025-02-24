import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authActions } from './store/auth';

import Home from './pages/home/Home';
import Books from './pages/books/Books';
import Cart from './pages/cart/Cart';
import About from './pages/about/About';
import Contact from './pages/contact/Contact';
import Event from './pages/event/Event';
import Profile from './pages/profile/Profile';
import Signup from './pages/signup/Signup';
import Login from './pages/login/Login';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Favourites from './components/Profile/Favourites';
import UserOrderHistory from './components/Profile/UserOrderHistory';
import UserSettings from './components/Profile/UserSettings';
import Dashboard from './components/Profile/Dashboard';
import ManageBooks from './components/Profile/ManageBooks';
import AllOrders from './components/Profile/Allorders';
import ManageEvents from './components/Profile/ManageEvents';
import ViewBookDetails from './components/ViewBookDetails/ViewBookDetails';
import ViewEventDetails from './components/ViewEventDetails/ViewEventDetails';
import CardPayment from './components/AddToCart/Cardpayment';
import PaymentInvoice from './components/AddToCart/PaymentInvoice';
import BkashPayment from './components/AddToCart/BkashPayment';
import AddBook from './components/Profile/AddBook';
import AddEvent from './components/Profile/AddEvent';
import UpdateBook from './components/Profile/UpdateBook';
import UpdateEvent from './components/Profile/UpdateEvent';

function App() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.role);

  useEffect(() => {
    if (
      localStorage.getItem('id') &&
      localStorage.getItem('token') &&
      localStorage.getItem('role')
    ) {
      dispatch(authActions.login());
      dispatch(authActions.changeRole(localStorage.getItem('role')));
    }
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/Books" element={<Books />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/CardPayment" element={<CardPayment />} />
        <Route path="/BkashPayment" element={<BkashPayment />} />
        <Route path="/PaymentInvoice" element={<PaymentInvoice />} />
        <Route path="/About" element={<About />} />
        <Route path="/Contact" element={<Contact />} />
        <Route path="/Events" element={<Event />} />
        <Route path="/Profile" element={<Profile />}>
          {role === 'user' && (
            <>
              <Route index element={<Favourites />} />
              <Route path="orderhistory" element={<UserOrderHistory />} />
              <Route path="settings" element={<UserSettings />} />
            </>
          )}
          {role === 'admin' && (
            <>
              <Route index element={<Dashboard />} />
              <Route path="managebooks" element={<ManageBooks />} />
              <Route path="addbook" element={<AddBook />} />
              <Route path="addevent" element={<AddEvent />} />
              <Route path="updatebook/:id" element={<UpdateBook />} />
              <Route path="updateevent/:id" element={<UpdateEvent />} />
              <Route path="allorders" element={<AllOrders />} />
              <Route path="manageevents" element={<ManageEvents />} />
            </>
          )}
        </Route>
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/viewbookdetails/:id" element={<ViewBookDetails />} />
        <Route path="/eventdetails/:eventId" element={<ViewEventDetails />} />
        <Route path="/PaymentInvoice/:timestamp" element={<PaymentInvoice />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
