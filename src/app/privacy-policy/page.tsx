"use client";

import React from "react";
import Link from "next/link";

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-zinc-50 py-12 px-4 sm:px-6 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-2xl shadow-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <div className="h-1 w-20 bg-orange-500 mx-auto"></div>
        </div>

        <div className="prose prose-zinc max-w-none">
          <p className="text-lg text-zinc-700 mb-6">
            Last Updated: July 12, 2025
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            1. Introduction
          </h2>
          <p className="text-zinc-700 mb-4">
            At LKB Foods ("we," "our," or "us"), we respect your privacy and are
            committed to protecting your personal information. This Privacy
            Policy explains how we collect, use, disclose, and safeguard your
            information when you visit our website, use our mobile application,
            or order food through our services.
          </p>
          <p className="text-zinc-700 mb-4">
            Please read this Privacy Policy carefully. By accessing or using our
            services, you acknowledge that you have read, understood, and agree
            to be bound by all the terms of this Privacy Policy.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            2. Information We Collect
          </h2>
          <p className="text-zinc-700 mb-2">
            We may collect the following types of information:
          </p>
          <h3 className="text-xl font-medium text-zinc-900 mt-4 mb-2">
            2.1 Personal Information
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-zinc-700">
            <li>
              Contact information (name, email address, phone number, delivery
              address)
            </li>
            <li>Account information (username, password)</li>
            <li>
              Payment information (credit card details, transaction history)
            </li>
            <li>Hostel and room information for delivery purposes</li>
            <li>Preferences and dietary requirements</li>
            <li>Communications with our customer service team</li>
          </ul>

          <h3 className="text-xl font-medium text-zinc-900 mt-4 mb-2">
            2.2 Technical Information
          </h3>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-zinc-700">
            <li>Device information (IP address, browser type, device type)</li>
            <li>
              Usage data (pages visited, time spent on pages, links clicked)
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            3. How We Use Your Information
          </h2>
          <p className="text-zinc-700 mb-2">
            We use the information we collect for various purposes, including:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-zinc-700">
            <li>Processing and delivering your food orders</li>
            <li>Managing your account and providing customer support</li>
            <li>Sending order confirmations, updates, and receipts</li>
            <li>Personalizing your experience and recommendations</li>
            <li>Improving our services, website, and mobile application</li>
            <li>Processing payments and preventing fraud</li>
            <li>
              Marketing and promotional communications (with your consent)
            </li>
            <li>Complying with legal obligations</li>
          </ul>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            4. Sharing Your Information
          </h2>
          <p className="text-zinc-700 mb-2">
            We may share your information with:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-zinc-700">
            <li>Delivery personnel to fulfill your orders</li>
            <li>Payment processors to complete transactions</li>
            <li>Service providers who perform services on our behalf</li>
            <li>Marketing partners (with your consent)</li>
            <li>
              Law enforcement or regulatory authorities when required by law
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            5. Data Security
          </h2>
          <p className="text-zinc-700 mb-4">
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            accidental loss, alteration, disclosure, or destruction. However, no
            method of transmission over the internet or electronic storage is
            100% secure, so we cannot guarantee absolute security.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            6. Your Rights
          </h2>
          <p className="text-zinc-700 mb-2">
            Depending on your location, you may have the right to:
          </p>
          <ul className="list-disc pl-6 mb-4 space-y-2 text-zinc-700">
            <li>Access personal information we hold about you</li>
            <li>Correct inaccuracies in your personal information</li>
            <li>Delete your personal information</li>
            <li>Restrict or object to our use of your personal information</li>
            <li>Withdraw consent (where processing is based on consent)</li>
            <li>Data portability</li>
          </ul>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            7. Cookies and Tracking Technologies
          </h2>
          <p className="text-zinc-700 mb-4">
            We use cookies and similar tracking technologies to enhance your
            experience on our platform, analyze usage patterns, and deliver
            personalized content. You can control cookies through your browser
            settings, but disabling certain cookies may limit your ability to
            use some features of our services.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            8. Children's Privacy
          </h2>
          <p className="text-zinc-700 mb-4">
            Our services are not directed to children under 18 years of age. We
            do not knowingly collect personal information from children. If you
            believe we have inadvertently collected information from a child,
            please contact us immediately.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            9. Changes to This Privacy Policy
          </h2>
          <p className="text-zinc-700 mb-4">
            We may update this Privacy Policy from time to time. The updated
            version will be indicated by an updated "Last Updated" date. We
            encourage you to review this Privacy Policy periodically to stay
            informed about how we are protecting your information.
          </p>

          <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">
            10. Contact Us
          </h2>
          <p className="text-zinc-700 mb-4">
            If you have questions or concerns about this Privacy Policy or our
            privacy practices, please contact us at:
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
