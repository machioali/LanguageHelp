import React from 'react';

const CompliancePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Compliance</h1>
        <p className="text-gray-700 mb-4">
          At LanguageHelp, we are committed to maintaining the highest standards of compliance and regulatory adherence. Our services are designed to meet stringent industry requirements, ensuring data security, privacy, and ethical practices.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Data Security and Privacy</h2>
        <p className="text-gray-700 mb-4">
          We implement robust security measures to protect your data. All information transmitted through our platforms is encrypted, and we adhere to strict access control protocols. Our privacy practices are in line with global data protection regulations.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
          <li>
            <strong>GDPR Compliance:</strong> We comply with the General Data Protection Regulation (GDPR) regarding the collection, processing, and storage of personal data for individuals within the European Union.
          </li>
          <li>
            <strong>HIPAA Compliance:</strong> For healthcare-related services, we adhere to the Health Insurance Portability and Accountability Act (HIPAA) standards to ensure the confidentiality and security of protected health information (PHI).
          </li>
          <li>
            <strong>Data Encryption:</strong> All data in transit and at rest is protected using industry-standard encryption protocols.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Industry Standards and Certifications</h2>
        <p className="text-gray-700 mb-4">
          We continuously work to meet and exceed industry best practices. Our commitment to quality and compliance is reflected in our operational procedures and technological infrastructure.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
          <li>
            <strong>ISO 27001:</strong> We are working towards ISO 27001 certification for information security management systems.
          </li>
          <li>
            <strong>Regular Audits:</strong> Our systems and processes undergo regular internal and external audits to ensure ongoing compliance and identify areas for improvement.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Ethical Guidelines</h2>
        <p className="text-gray-700 mb-4">
          Our team operates under a strict code of ethics, ensuring professionalism, impartiality, and confidentiality in all interactions.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
          <li>
            <strong>Interpreter Code of Conduct:</strong> Our interpreters adhere to a professional code of conduct that emphasizes accuracy, confidentiality, and cultural sensitivity.
          </li>
          <li>
            <strong>Transparency:</strong> We are transparent about our data handling practices and service delivery.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Contact for Compliance Inquiries</h2>
        <p className="text-gray-700 mb-4">
          For any questions or concerns regarding our compliance practices, please contact our compliance officer at: [Your Compliance Contact Email]
        </p>
      </div>
    </div>
  );
};

export default CompliancePage;