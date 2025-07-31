import React from "react";

export default function RefundPolicy() {
  return (
    <div className="bg-white py-12 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Refund Policy
          </h1>
          <p className="text-lg text-gray-600">
            Our guidelines for order refunds and payments
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Refund Eligibility
            </h2>
            <p className="mb-6">
              At LKB, customer satisfaction is our priority. We have established
              the following guidelines regarding refunds to ensure a fair and
              transparent process:
            </p>

            <div className="bg-orange-50 p-6 rounded-lg mb-6">
              <h3 className="text-xl font-medium text-orange-900 mb-3">
                Valid Reasons for Refund
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  <strong>Incorrect Order:</strong> If you received items
                  different from what you ordered.
                </li>
                <li>
                  <strong>Missing Items:</strong> If any items are missing from
                  your delivered order.
                </li>
                <li>
                  <strong>Food Quality Issues:</strong> If the food quality does
                  not meet our standards (must be reported within 30 minutes of
                  delivery).
                </li>
                <li>
                  <strong>Delayed Delivery:</strong> If your order is delivered
                  with a significant delay (over 60 minutes from the promised
                  time).
                </li>
                <li>
                  <strong>Order Cancellation:</strong> If your order was
                  cancelled but you were charged.
                </li>
              </ul>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <h3 className="text-xl font-medium text-orange-900 mb-3">
                Conditions for Refund
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  All refund requests must be submitted within{" "}
                  <strong>24 hours</strong> of the order delivery.
                </li>
                <li>
                  Photographic evidence may be required in cases related to food
                  quality or incorrect items.
                </li>
                <li>
                  For significant issues, our customer service team may request
                  additional information to process your refund.
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Refund Process
            </h2>
            <p className="mb-4">
              Once a refund request is approved, the following process applies:
            </p>
            <div className="bg-orange-50 p-6 rounded-lg mb-6">
              <p className="mb-3">
                Please note that all refunds are processed{" "}
                <strong>exclusively through Original payment method</strong>.
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  You will need to provide a valid Original ID where you would
                  like to receive your refund.
                </li>
                <li>
                  Refunds via Original are typically processed within{" "}
                  <strong>1–3 business days</strong> after approval.
                </li>
              </ul>
            </div>
            <p className="mb-4">
              The exact timing of when the refund appears in your account
              depends on your Original provider's processing times.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Partial Refunds
            </h2>
            <p className="mb-4">In some cases, we may issue partial refunds:</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>When only certain items in your order were affected.</li>
              <li>
                When delivery was delayed but the food quality remained
                acceptable.
              </li>
              <li>
                For catering orders where only a portion of the order had
                issues.
              </li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Cancellation and Refund Policy
            </h2>
            <div className="bg-orange-50 p-6 rounded-lg">
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  Orders can be cancelled within <strong>15 minutes</strong> of
                  placement for a full refund.
                </li>
                <li>
                  Cancellations after 15 minutes or once food preparation has
                  started will not be accepted.
                </li>
                <li>
                  Full refunds will be issued within{" "}
                  <strong>24–48 hours</strong> if the delivered order is
                  incorrect, damaged, or not up to standard.
                </li>
                <li>
                  <strong>Cash refunds are not available</strong>; all refunds
                  will be credited to the original payment method within{" "}
                  <strong>3–5 working days</strong>.
                </li>
                <li>
                  To request a cancellation or refund, contact us at{" "}
                  <strong>support@lkb-solutions.com</strong>.
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              Shipping (Delivery) Policy
            </h2>
            <div className="bg-orange-50 p-6 rounded-lg">
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>
                  We provide food delivery exclusively within the IIT
                  Bhubaneswar campus premises.
                </li>
                <li>
                  Orders are delivered within <strong>45–60 minutes</strong>,
                  depending on the campus location.
                </li>
                <li>
                  Shipping starts approximately{" "}
                  <strong>30 minutes after the order is placed</strong>.
                </li>
                <li>
                  A delivery charge of <strong>₹30</strong> applies to all
                  orders within the campus.
                </li>
                <li>
                  Please provide accurate hostel/building name and room number
                  at the time of order to ensure timely delivery.
                </li>
                <li>
                  Delivery hours: <strong>10 AM to 9 PM</strong> daily.
                </li>
                <li>
                  For any delivery issues, contact us at:
                  <br />
                  Email:{" "}
                  <a
                    href="mailto:support@lkb.solutions.com"
                    className="text-blue-600 underline"
                  >
                    support@lkb.solutions.com
                  </a>
                  <br />
                  Mobile:{" "}
                  <a href="tel:7008203600" className="text-blue-600 underline">
                    7008203600
                  </a>
                </li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              How to Request a Refund
            </h2>
            <p className="mb-4">
              To request a refund, you can contact our customer support team
              directly:
            </p>
            <ul className="list-none pl-0 space-y-2 text-gray-700">
              <li>
                <strong>Phone:</strong> +91 - 7008203600
              </li>
              <li>
                <strong>Email:</strong> support@lkb-solutions.com
              </li>
              <li>
                <strong>Hours:</strong> Monday - Saturday, 8:00 AM - 10:00 PM /
                Sunday - 07PM–12PM
              </li>
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
