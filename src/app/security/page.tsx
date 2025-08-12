import React from 'react';

const SecurityPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Security at LanguageHelp</h1>
        <p className="text-gray-700 mb-4">
          At LanguageHelp, security is our top priority. We are committed to protecting your data and ensuring the integrity and confidentiality of your communications. Our comprehensive security framework is built on industry best practices and continuous improvement.
        </p>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Data Encryption</h2>
        <p className="text-700 mb-4">
          We utilize strong encryption protocols to safeguard your data both in transit and at rest.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
          <li>
            <strong>TLS/SSL:</strong> All communications between your device and our servers are encrypted using Transport Layer Security (TLS) and Secure Sockets Layer (SSL) to prevent eavesdropping and tampering.
          </li>
          <li>
            <strong>AES-256:</strong> Data stored on our servers is encrypted using Advanced Encryption Standard (AES-256), a robust encryption algorithm.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Secure Infrastructure</h2>
        <p className="text-gray-700 mb-4">
          Our infrastructure is designed with security in mind, leveraging leading cloud providers and implementing strict access controls.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
          <li>
            <strong>Cloud Security:</strong> We host our services on secure, reputable cloud platforms that adhere to global security standards and certifications.
          </li>
          <li>
            <strong>Access Control:</strong> Access to production systems and sensitive data is strictly controlled and monitored, with multi-factor authentication (MFA) and least privilege principles enforced.
          </li>
          <li>
            <strong>Regular Backups:</strong> Data is regularly backed up to ensure business continuity and disaster recovery capabilities.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Application Security</h2>
        <p className="text-gray-700 mb-4">
          We follow secure development lifecycle practices to minimize vulnerabilities in our applications.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
          <li>
            <strong>Code Reviews:</strong> All code changes undergo rigorous security reviews.
          </li>
          <li>
            <strong>Vulnerability Scanning:</strong> Our applications are regularly scanned for vulnerabilities using automated tools and manual penetration testing.
          </li>
          <li>
            <strong>Security Updates:</strong> We promptly apply security patches and updates to all systems and software.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Incident Response</h2>
        <p className="text-gray-700 mb-4">
          We have a dedicated incident response team and a well-defined process to address security incidents swiftly and effectively.
        </p>
        <ul className="list-disc list-inside text-gray-700 mb-4 ml-4">
          <li>
            <strong>Monitoring and Alerting:</strong> Our systems are continuously monitored for suspicious activities, with automated alerts in place for potential threats.
          </li>
          <li>
            <strong>Response Plan:</strong> In the event of a security incident, we follow a detailed response plan to contain, eradicate, recover, and learn from the incident.
          </li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Contact Our Security Team</h2>
        <p className="text-gray-700 mb-4">
          If you have any security concerns or discover a potential vulnerability, please contact us immediately at: [Your Security Contact Email]
        </p>
      </div>
    </div>
  );
};

export default SecurityPage;