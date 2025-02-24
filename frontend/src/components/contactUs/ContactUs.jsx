import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import { FaPaperPlane } from 'react-icons/fa';
import { motion } from 'framer-motion';

function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isClicked, setIsClicked] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFocus = (name) => {
    setFocusedField(name);
  };

  const handleBlur = (e, name) => {
    if (e.target.value === '') {
      setFocusedField(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsClicked(true);
    setTimeout(() => {
      setIsClicked(false);
    }, 300);

    emailjs
      .send(
        'service_o8v355b',
        'template_v70ej55',
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          message: formData.message,
        },
        'ZjwKmULXmRa7I_ozB'
      )
      .then(
        (response) => {
          alert('We’ve received your message and will get back to you soon! 💬');
          setFormData({ name: '', email: '', subject: '', message: '' });
        },
        (err) => {
          alert('Failed to send message. Please try again later.');
        }
      );
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="max-w-screen-2xl container mx-auto md:px-20 px-4 my-0">
      <motion.h2
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        transition={{ duration: 0.4 }}
        className="text-4xl font-bold text-center mb-4 text-yellow-50"
      >
        Have Something on Your Mind? <span className="text-yellow-400">We’re Here to Listen</span>
      </motion.h2>

      <form
        onSubmit={handleSubmit}
        className="bg-zinc-800 p-4 border rounded-lg shadow-lg transition-shadow duration-500 hover:shadow-xl w-full max-w-4xl mx-auto backdrop-blur-lg bg-opacity-30"
      >
        {['name', 'email', 'subject'].map((field, index) => (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.05 }}
            className="form-control mb-3"
            key={field}
          >
            <div
              className={`relative ${formData[field] || focusedField === field ? 'pt-8' : 'pt-10'}`}
            >
              <label
                className={`absolute left-4 text-yellow-200 transition-all duration-300 transform ${
                  formData[field] || focusedField === field ? 'text-yellow-200 scale-75 top-0' : 'top-3'
                }`}
              >
                {field === 'email' ? 'Email Address' : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === 'email' ? 'email' : 'text'}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                onFocus={() => handleFocus(field)}
                onBlur={(e) => handleBlur(e, field)}
                placeholder={
                  field === 'name'
                    ? 'Your name, please.'
                    : field === 'email'
                    ? 'Where can we send our book recommendations?'
                    : 'Tell us the reason you’re reaching out!'
                }
                className="input input-bordered w-full bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-transparent transition-all duration-300 rounded-lg h-12 pl-4"
                required
              />
            </div>
          </motion.div>
        ))}

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.4, delay: 0.6 }}
          className="form-control mb-3"
        >
          <div
            className={`relative ${formData.message || focusedField === 'message' ? 'pt-8' : 'pt-10'}`}
          >
            <label
              className={`absolute left-4 text-yellow-200 transition-all duration-300 transform ${
                formData.message || focusedField === 'message' ? 'text-yellow-200 scale-75 top-0' : 'top-3'
              }`}
            >
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              onFocus={() => handleFocus('message')}
              onBlur={(e) => handleBlur(e, 'message')}
              placeholder="Share your thoughts or ask us anything 💌"
              className="textarea textarea-bordered w-full bg-zinc-800 text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-transparent transition-all duration-300 rounded-lg h-32 pl-4"
              required
            ></textarea>
          </div>
        </motion.div>

        <motion.button
          type="submit"
          className={`btn btn-primary w-full flex justify-center items-center space-x-2 transform transition duration-500 ${
            isClicked ? 'scale-95' : 'hover:scale-105'
          } rounded-lg h-10`}
          onMouseEnter={() => isClicked && setIsClicked(false)}
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <FaPaperPlane className="text-lg" />
          <span>Send Message</span>
        </motion.button>
      </form>
    </div>
  );
}

export default ContactUs;
