import React from 'react';

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Privacy Policy</h1>
        <p className="text-gray-700 mb-4">
          Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website [Your Website URL], including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the “Site”). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Collection of Your Information</h2>
        <p className="text-gray-700 mb-4">
          We may collect information about you in a variety of ways. The information we may collect on the Site includes:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
          <li>
            <strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.
          </li>
          <li>
            <strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Use of Your Information</h2>
        <p className="text-gray-700 mb-4">
          Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
          <li>Create and manage your account.</li>
          <li>Email you regarding your account or order.</li>
          <li>Enable user-to-user communications.</li>
          <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
          <li>Generate a personal profile about you to make your future visits to the Site more personalized.</li>
          <li>Increase the efficiency and operation of the Site.</li>
          <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
          <li>Notify you of updates to the Site.</li>
          <li>Offer new products, services, mobile applications, and/or recommendations to you.</li>
          <li>Perform other business activities as needed.</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Disclosure of Your Information</h2>
        <p className="text-gray-700 mb-4">
          We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
          <li>
            <strong>By Law or to Protect Rights:</strong> If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
          </li>
          <li>
            <strong>Third-Party Service Providers:</strong> We may share your information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services, customer service, and marketing assistance.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Security of Your Information</h2>
        <p className="text-gray-700 mb-4">
          We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Contact Us</h2>
        <p className="text-gray-700 mb-4">
          If you have questions or comments about this Privacy Policy, please contact us at: [Your Contact Email or Address]
        </p>
      </div>
    </div>
  );
};

export default PrivacyPage;