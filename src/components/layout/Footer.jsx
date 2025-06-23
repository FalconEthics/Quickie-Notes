import React from 'react';

export default function Footer() {

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 py-4 px-6 mt-auto transition-colors duration-300">
      <div className="container mx-auto text-center">
        <a
          href="https://mrsoumikdas.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
        >
          © 2022 Soumik Das. All rights reserved.
        </a>
      </div>
    </footer>
  );
}
