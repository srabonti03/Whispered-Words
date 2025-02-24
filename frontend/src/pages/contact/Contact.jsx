import React from 'react';
import ContactUs from '../../components/contactUs/ContactUs';

function Contact() {
  return (
    <div
      className='bg-zinc-900 text-white px-10 py-8 relative'
      style={{
        backgroundImage: 'url(./contact.png)',
        backgroundSize: '130%',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div
        className='absolute top-0 left-0 w-full h-full bg-zinc-700 opacity-30'
        style={{
          zIndex: 1,
        }}
      ></div>
      <div className="relative z-10">
        <ContactUs />
      </div>
    </div>
  );
}

export default Contact;
