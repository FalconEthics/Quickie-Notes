import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 py-4 px-6 mt-auto">
      <div className="container mx-auto text-center">
        <a
          href="https://mrsoumikdas.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 hover:text-blue-500 transition-colors"
        >
          © {currentYear} Soumik Das. All rights reserved.
        </a>
      </div>
    </footer>
  );
}
