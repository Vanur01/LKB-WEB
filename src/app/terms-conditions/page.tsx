"use client";

import React from "react";
import Link from "next/link";

export default function TermsConditionsPage() {
  return (
    <div className="bg-zinc-50 py-12 px-4 sm:px-6 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <div className="h-1 w-20 bg-orange-500 mx-auto"></div>
        </div>

        <div className="prose prose-zinc max-w-none">
          <p className="text-lg text-zinc-700 mb-6">
            Last Updated: July 12, 2025
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            1. Agreement to Terms
          </h2>
          <p className="text-zinc-700 mb-4">
            Welcome to LKB Foods. These Terms and Conditions ("Terms") govern
            your access to and use of the LKB Foods website, mobile application,
            and services (collectively, the "Services"). By accessing or using
            our Services, you agree to be bound by these Terms. If you do not
            agree to these Terms, please do not use our Services.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            2. Eligibility
          </h2>
          <p className="text-zinc-700 mb-4">
            You must be at least 18 years old to use our Services. By using our
            Services, you represent and warrant that you are at least 18 years
            old and have the legal capacity to enter into a binding agreement.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            3. Account Registration
          </h2>
          <p className="text-zinc-700 mb-4">
            To access certain features of our Services, you may need to create
            an account. When you register for an account, you agree to provide
            accurate, current, and complete information and to update this
            information to maintain its accuracy. You are responsible for
            maintaining the confidentiality of your account credentials and for
            all activities that occur under your account. You agree to notify us
            immediately of any unauthorized use of your account.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            4. Ordering and Payment
          </h2>
          <p className="text-zinc-700 mb-2">
            By placing an order through our Services, you agree to the
            following:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-zinc-700">
            <li>
              You are responsible for providing accurate delivery information.
            </li>
            <li>
              Menu items, prices, and availability are subject to change without
              notice.
            </li>
            <li>
              We reserve the right to refuse or cancel any order at our
              discretion.
            </li>
            <li>Payment must be made at the time of ordering.</li>
            <li>
              All payments are processed securely through our payment
              processors.
            </li>
            <li>Applicable taxes will be added to your order total.</li>
            <li>Delivery charges are ₹30 per order.</li>
          </ul>
          <p className="text-zinc-700 mb-4">
            ✅ FSSAI Certificate submitted successfully.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            5. Delivery
          </h2>
          <p className="text-zinc-700 mb-4">
            Delivery times are estimates and may vary based on factors including
            but not limited to order volume, weather conditions, and traffic. We
            will make reasonable efforts to deliver your order within the
            estimated timeframe but cannot guarantee specific delivery times.
          </p>
          <p className="text-zinc-700 mb-4">
            Estimated delivery time is typically between 30 to 60 minutes
            depending on your location and order volume. Orders placed during
            peak hours may take slightly longer.
          </p>
          <p className="text-zinc-700 mb-4">
            For hostel deliveries, you must be available to receive your order
            at the specified location. If you are not available, our delivery
            personnel may leave your order at a safe location at the delivery
            address or return it to our restaurant, at our discretion.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            6. Cancellations and Refunds
          </h2>
          <p className="text-zinc-700 mb-4">
            Once an order has been placed, cancellations are subject to our
            cancellation policy. Cancellations may be accepted if the order has
            not yet been prepared. Refunds, when applicable, will be processed
            through the original payment method.
          </p>
          <p className="text-zinc-700 mb-4">
            If you are dissatisfied with your order due to quality issues,
            please contact our customer service team within 30 minutes of
            delivery, and we will address your concerns appropriately.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            7. Prohibited Conduct
          </h2>
          <p className="text-zinc-700 mb-2">You agree not to:</p>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-zinc-700">
            <li>Use our Services for any illegal purpose.</li>
            <li>Attempt to gain unauthorized access to our systems.</li>
            <li>Interfere with or disrupt our Services or servers.</li>
            <li>Impersonate any person or entity.</li>
            <li>Harass, abuse, or harm another person through our Services.</li>
            <li>
              Use our Services to send spam, unsolicited bulk communications, or
              malware.
            </li>
            <li>Attempt to reverse engineer our software or systems.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            8. Intellectual Property
          </h2>
          <p className="text-zinc-700 mb-4">
            All content on our Services, including but not limited to text,
            graphics, logos, icons, images, audio clips, and software, is the
            property of LKB Foods or our licensors and is protected by
            copyright, trademark, and other intellectual property laws. You may
            not reproduce, distribute, modify, display, prepare derivative works
            based on, or otherwise use any of our content without our prior
            written consent.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            9. Limitation of Liability
          </h2>
          <p className="text-zinc-700 mb-4">
            To the maximum extent permitted by law, LKB Foods shall not be
            liable for any indirect, incidental, special, consequential, or
            punitive damages, including without limitation, loss of profits,
            data, use, goodwill, or other intangible losses, resulting from your
            access to or use of or inability to access or use the Services.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            10. Indemnification
          </h2>
          <p className="text-zinc-700 mb-4">
            You agree to indemnify, defend, and hold harmless LKB Foods and our
            officers, directors, employees, agents, and affiliates from and
            against any and all claims, liabilities, damages, losses, costs,
            expenses, or fees (including reasonable attorneys' fees) that such
            parties may incur as a result of or arising from your violation of
            these Terms.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            11. Modifications to Terms
          </h2>
          <p className="text-zinc-700 mb-4">
            We may modify these Terms at any time by posting the revised Terms
            on our website or within our mobile application. Your continued use
            of our Services after any such changes constitutes your acceptance
            of the new Terms.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            12. Governing Law
          </h2>
          <p className="text-zinc-700 mb-4">
            These Terms shall be governed by and construed in accordance with
            the laws of the State of California, without regard to its conflict
            of law principles. Any disputes arising under or related to these
            Terms shall be subject to the exclusive jurisdiction of the courts
            located in San Francisco, California.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            13. Severability
          </h2>
          <p className="text-zinc-700 mb-4">
            If any provision of these Terms is found to be unenforceable or
            invalid, that provision shall be limited or eliminated to the
            minimum extent necessary so that these Terms shall otherwise remain
            in full force and effect and enforceable.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            14. Contact Information
          </h2>
          <p className="text-zinc-700 mb-4">
            If you have any questions about these Terms, please contact us at:
          </p>
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-6">
            <p className="text-zinc-700 mb-2">
              Email: support@lkb-solutions.com
            </p>
            <p className="text-zinc-700 mb-2">Phone: +91 - 7008203600</p>
            <p className="text-zinc-700">
              Address: Jatani IIT, Arugul, M/S NESTLE CORNER, IIT BBS, SBS
              Complex, near ROB, Jatani, Khordha, Orissa-752050
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-zinc-200">
          <Link
            href="/"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
