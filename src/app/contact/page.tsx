"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  BuildingOfficeIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Replace 'YOUR_ACCESS_KEY_HERE' with your actual Web3Forms access key
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: '113fc0b6-b978-4ee8-a7ca-3ad1550b491b',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || 'Contact Form Submission',
          message: formData.message,
          from_name: formData.name,
          replyto: formData.email,
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });

        // Reset success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error(result.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-gray-900 relative overflow-hidden">
      <div className="relative z-10">
        {/* Header */}
        <motion.div
          className="text-center pt-20 pb-16 px-4"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-6"
            animate={{ y: [-10, 10, -10] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ChatBubbleLeftRightIcon className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-gray-900 via-orange-500 to-orange-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Let's Talk
          </motion.h1>

          <motion.p
            className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Questions about our menu? Want to place a large order? We'd love to
            hear from you!
          </motion.p>
        </motion.div>

        {/* Main Content */}
        <div className="px-4 pb-20">
          <motion.div
            className="max-w-7xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Contact Form - Takes 2 columns */}
              <motion.div className="lg:col-span-2" variants={itemVariants}>
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 p-8 lg:p-12 shadow-2xl">
                  <div className="flex items-center mb-8">
                    <div className="w-3 h-3 bg-orange-400 rounded-full mr-3 animate-pulse"></div>
                    <h2 className="text-3xl font-bold text-gray-900">
                      Send Message
                    </h2>
                  </div>

                  {submitted && (
                    <motion.div
                      className="mb-8 p-6 bg-green-50 border border-green-200 rounded-2xl"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center text-green-600">
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="font-semibold">
                          Message sent successfully! We'll be in touch soon.
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {error && (
                    <motion.div
                      className="mb-8 p-6 bg-red-50 border border-red-200 rounded-2xl"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center text-red-600">
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center mr-3">
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className="font-semibold">
                          {error}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Name *
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 group-hover:border-gray-300"
                            placeholder="Your full name"
                          />
                          <UserIcon className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Email *
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 group-hover:border-gray-300"
                            placeholder="your@email.com"
                          />
                          <EnvelopeIcon className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Phone
                        </label>
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 group-hover:border-gray-300"
                            placeholder="+91 - 1234567890"
                          />
                          <PhoneIcon className="absolute right-4 top-4 w-5 h-5 text-gray-400" />
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Subject
                        </label>
                        <select
                          name="subject"
                          value={formData.subject}
                          onChange={handleInputChange}
                          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 group-hover:border-gray-300"
                        >
                          <option value="" className="bg-white">
                            Select a topic
                          </option>
                          <option value="Order Inquiry" className="bg-white">
                            Order Inquiry
                          </option>
                          <option value="Catering Services" className="bg-white">
                            Catering Services
                          </option>
                          <option value="Feedback" className="bg-white">
                            Feedback
                          </option>
                          <option value="General Inquiry" className="bg-white">
                            General Inquiry
                          </option>
                        </select>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 placeholder-gray-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition-all duration-300 group-hover:border-gray-300 resize-none"
                        placeholder="Tell us about your order, feedback, or question..."
                      />
                    </div>

                    <motion.button
                      type="button"
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 shadow-lg hover:shadow-orange-500/25"
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <PaperAirplaneIcon className="w-5 h-5" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Contact Info - Takes 1 column */}
              <motion.div className="space-y-6" variants={itemVariants}>
                {/* Restaurant Info */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 p-8 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 bg-orange-400 rounded-full mr-3 animate-pulse"></div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Visit Us
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <MapPinIcon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Location</p>
                        <p className="text-gray-900 font-medium">
                          AT-Jatani IIT, Arugul, M/S NESTLE CORNER, IIT BBS, SBS
                          Complex, near ROB, Jatani, Khordha, Orissa-752050
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <PhoneIcon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Phone</p>
                        <p className="text-gray-900 font-medium">
                          +91 - 7008203600
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <EnvelopeIcon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Email</p>
                        <p className="text-gray-900 font-medium">
                          support@lkb-solutions.com
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ClockIcon className="w-5 h-5 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">Hours</p>
                        <p className="text-gray-900 font-medium">
                          Mon-Sat: 08AM-10PM
                          <br />
                          Sun: 07PM-12PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-gray-200 p-8 shadow-2xl">
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 bg-orange-400 rounded-full mr-3 animate-pulse"></div>
                    <h3 className="text-xl font-bold text-gray-900">
                      Nestle Corner-2{" "}
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-orange-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                          <path
                            fillRule="evenodd"
                            d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">
                          Dine-in Services
                        </p>
                        <p className="text-gray-600 text-sm">
                          Elegant dining experience
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5 text-orange-600"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-gray-900 font-medium">
                          Room Delivery
                        </p>
                        <p className="text-gray-600 text-sm">
                          Direct to your accommodation
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;