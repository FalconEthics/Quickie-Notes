import { FaLinkedin, FaInstagram, FaGlobe, FaEnvelope, FaGithub, FaExclamationTriangle } from 'react-icons/fa';
import Layout from '../components/layout/Layout';

export default function About() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="bg-white dark:bg-[#181818] rounded-lg shadow-md overflow-hidden transition-colors duration-300">
          {/* Header */}
          <div className="bg-yellow-500 dark:bg-yellow-600 p-6 text-white text-center">
            <h1 className="text-2xl font-bold mb-2">About Quickie Notes</h1>
            <p className="text-yellow-100">Learn more about this project</p>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Important Notice */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 rounded-lg mb-6">
              <div className="flex items-start">
                <FaExclamationTriangle className="text-amber-500 dark:text-amber-400 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-2">
                    Project Application Notice
                  </h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm leading-relaxed">
                    This is a project application, not a production app. It's designed for demonstration and learning purposes. 
                    Please do not share any personal or sensitive information while using this application.
                  </p>
                </div>
              </div>
            </div>

            {/* Project Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                About This Project
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                Quickie Notes is a modern note-taking application built with React 19 and Firebase. 
                This project showcases modern web development practices and the latest React features.
              </p>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Originally created as a bootcamp project in 2022, it has been completely rewritten using 
                cutting-edge technologies including React 19, Firebase SDK 11, Vite, and TailwindCSS.
              </p>
            </div>

            {/* Developer Info */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Developer
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Created by <span className="font-medium text-gray-800 dark:text-gray-200">Soumik Das</span>
              </p>
              
              {/* Social Links */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <a
                  href="https://www.linkedin.com/in/soumik-das-profile/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#393B41] transition-colors group"
                >
                  <FaLinkedin className="text-blue-600 dark:text-blue-400 mr-3 text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">LinkedIn</span>
                </a>

                <a
                  href="https://mrsoumikdas.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#393B41] transition-colors group"
                >
                  <FaGlobe className="text-purple-600 dark:text-purple-400 mr-3 text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Portfolio</span>
                </a>

                <a
                  href="https://github.com/FalconEthics/quickie-notes"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#393B41] transition-colors group"
                >
                  <FaGithub className="text-gray-800 dark:text-gray-300 mr-3 text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">GitHub</span>
                </a>

                <a
                  href="https://www.instagram.com/account.soumik.das/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#393B41] transition-colors group"
                >
                  <FaInstagram className="text-pink-600 dark:text-pink-400 mr-3 text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">Instagram</span>
                </a>

                <a
                  href="mailto:mail2soumikdas@gmail.com"
                  className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-[#393B41] transition-colors group md:col-span-2"
                >
                  <FaEnvelope className="text-red-600 dark:text-red-400 mr-3 text-lg group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 dark:text-gray-300 text-sm">mail2soumikdas@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">
                Built With
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                <div className="bg-gray-50 dark:bg-[#393B41] p-2 rounded text-center text-gray-700 dark:text-gray-300">
                  React 19
                </div>
                <div className="bg-gray-50 dark:bg-[#393B41] p-2 rounded text-center text-gray-700 dark:text-gray-300">
                  Firebase
                </div>
                <div className="bg-gray-50 dark:bg-[#393B41] p-2 rounded text-center text-gray-700 dark:text-gray-300">
                  Vite
                </div>
                <div className="bg-gray-50 dark:bg-[#393B41] p-2 rounded text-center text-gray-700 dark:text-gray-300">
                  TailwindCSS
                </div>
                <div className="bg-gray-50 dark:bg-[#393B41] p-2 rounded text-center text-gray-700 dark:text-gray-300">
                  Bun
                </div>
                <div className="bg-gray-50 dark:bg-[#393B41] p-2 rounded text-center text-gray-700 dark:text-gray-300">
                  Framer Motion
                </div>
              </div>
            </div>

            {/* Copyright */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-6 text-center">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Copyright © 2022 - Soumik Das. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}