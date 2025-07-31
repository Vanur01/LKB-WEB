import React from 'react';

export default function CancellationPolicy() {
  return (
    <div className="bg-white py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Cancellation Policy</h1>
          <p className="text-lg text-gray-600">Our guidelines for order cancellations</p>
        </div>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Order Cancellation</h2>
            <p className="mb-4">
              At LKB, we understand that plans can change. Our cancellation policy is designed to be fair to all parties while maintaining our quality of service.
            </p>
            
            <div className="bg-orange-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-medium text-orange-900 mb-3">Online Orders</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Orders can be cancelled <strong>within 30 minutes</strong> of placing them, provided food preparation has not yet begun.</li>
                <li>To cancel an order, please contact our customer service team immediately via phone.</li>
                <li>Once an order enters the preparation phase, cancellations cannot be processed.</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-medium text-orange-900 mb-3">Pre-Orders & Catering</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Pre-orders and catering services may be cancelled up to <strong>1 hours</strong> before the scheduled delivery/pickup time.</li>
                <li>Cancellations made less than 1 hours before the scheduled time may be subject to a <strong>25% cancellation fee</strong>.</li>
              </ul>
            </div>
            
            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-orange-900 mb-3">Reservations</h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Table reservations can be cancelled up to <strong>2 hours</strong> before the reserved time without penalty.</li>
                <li>No-shows or late cancellations may affect future reservation privileges.</li>
                <li>For private events or large group bookings, cancellations must be made <strong>4 hours</strong> in advance.</li>
              </ul>
            </div>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Special Circumstances</h2>
            <p className="mb-4">
              We recognize that unexpected situations can arise. In cases of emergency, severe weather conditions, or other extenuating circumstances, our cancellation policy may be adjusted accordingly.
            </p>
            <p>
              Please contact our customer support team to discuss your situation, and we will do our best to accommodate your needs.
            </p>
          </section>
          
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Information</h2>
            <p className="mb-4">
              For any questions or concerns regarding our cancellation policy, please contact us:
            </p>
            <ul className="list-none pl-0 space-y-2 text-gray-700">
              <li><strong>Phone:</strong>                          +91 - 7008203600</li>
              <li><strong>Email:</strong>                          support@lkb-solutions.com
</li>
              <li><strong>Hours:</strong> Monday - Saturday, 8:00 AM - 10:00 PM / Sunday - 07PM-12PM</li>
            </ul>
            <p className="mt-6 text-sm text-gray-500">
              This policy was last updated on July 15, 2025.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
