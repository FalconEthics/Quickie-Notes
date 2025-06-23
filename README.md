<a name="readme-top"></a>
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![GNU License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/FalconEthics/quickie-notes">
    <img src="./public/icon.png" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">Quickie Notes</h3>

  <p align="center">
    A modern, lightweight note-taking app built with React 19 and Firebase
    <br />
    <a href="https://github.com/FalconEthics/quickie-notes"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="https://quickie-notes.vercel.app">View Demo</a>
    ·
    <a href="https://github.com/FalconEthics/quickie-notes/issues">Report Bug</a>
    ·
    <a href="https://github.com/FalconEthics/quickie-notes/issues">Request Feature</a>
  </p>
</div>

## About The Project

[![Quickie Notes Screenshot][product-screenshot]](https://quickie-notes.vercel.app)

Quickie Notes is a modern note-taking application that allows users to quickly jot down thoughts, create to-do lists, and organize ideas. With a clean, intuitive interface and seamless cloud synchronization, your notes are accessible anywhere, anytime.

Key Features:

- Clean, intuitive user interface with dark/light theme support
- Real-time note synchronization across devices
- Markdown support for rich text formatting
- User authentication and note privacy
- Responsive design that works on desktop and mobile

### Project Story

This app has an interesting history! It was originally my final project when I was attending the full-stack bootcamp from London App Brewery in 2022. As part of my recent initiative to consolidate my GitHub presence and modernize my older projects, I decided to completely rewrite this application.

The original version was built with React 16, Firebase, webpack, Node.js, and Bootstrap. This new version represents a complete overhaul using the latest web technologies:
- React 19 with the new React Compiler
- Firebase SDK 11
- Vite + SWC build tooling
- Bun as the JavaScript runtime
- TailwindCSS for styling

This rewrite process has been illuminating, showing how dramatically front-end development has evolved in just a few years and how much more productive these modern tools can make developers.

### Major Technical Improvements

The rewrite showcases several significant improvements in React and its ecosystem:

1. **React 19 `use()` API**: The new `use()` hook has dramatically simplified data fetching and state management. Instead of chaining multiple `useState` and `useEffect` hooks, we can now handle asynchronous operations more elegantly.

2. **React Compiler**: The new React compiler has automated many optimization patterns, resulting in better performance without requiring manual memoization everywhere.

3. **Server Components & Streaming**: Although not fully implemented in this project, the architecture is ready for these features which provide improved loading states and better user experience.

4. **Simplified State Management**: Context API improvements have reduced boilerplate and made state management clearer.

5. **Build System**: Moving from webpack to Vite has drastically improved development experience with near-instant hot module replacement and faster builds.

6. **TypeScript Support**: While the original project used JavaScript only, this version has improved type safety through TypeScript integration.

### Built With

* [![React][React.js]][React-url]
* [![Firebase][Firebase]][Firebase-url]
* [![Vite][Vite]][Vite-url]
* [![Tailwind][Tailwind.css]][Tailwind-url]
* [![Bun][Bun]][Bun-url]

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Bun
  ```sh
  curl -fsSL https://bun.sh/install | bash
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/FalconEthics/quickie-notes.git
   ```
2. Install packages
   ```sh
   bun install
   ```
3. Create a `.env` file with your Firebase configuration
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```
4. Start the development server
   ```sh
   bun run dev
   ```

## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

[![LinkedIn][linkedin-badge]][linkedin-url]
[![Portfolio][portfolio-badge]][portfolio-url]
[![Instagram][instagram-badge]][instagram-url]
[![Gmail][gmail-badge]][gmail-url]

Soumik Das - Feel free to reach out!

Project Link: [https://github.com/FalconEthics/quickie-notes](https://github.com/FalconEthics/quickie-notes)

Live Demo: [https://quickie-notes.vercel.app](https://quickie-notes.vercel.app)

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/FalconEthics/quickie-notes.svg?style=for-the-badge
[contributors-url]: https://github.com/FalconEthics/quickie-notes/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/FalconEthics/quickie-notes.svg?style=for-the-badge
[forks-url]: https://github.com/FalconEthics/quickie-notes/network/members
[stars-shield]: https://img.shields.io/github/stars/FalconEthics/quickie-notes.svg?style=for-the-badge
[stars-url]: https://github.com/FalconEthics/quickie-notes/stargazers
[issues-shield]: https://img.shields.io/github/issues/FalconEthics/quickie-notes.svg?style=for-the-badge
[issues-url]: https://github.com/FalconEthics/quickie-notes/issues
[license-shield]: https://img.shields.io/github/license/FalconEthics/quickie-notes.svg?style=for-the-badge
[license-url]: https://github.com/FalconEthics/quickie-notes/blob/main/LICENSE
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/soumik-das-profile/
[product-screenshot]: ./public/screenshot.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Firebase]: https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white
[Firebase-url]: https://firebase.google.com/
[Vite]: https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Tailwind.css]: https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Bun]: https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white
[Bun-url]: https://bun.sh/
[linkedin-badge]: https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white
[linkedin-url]: https://www.linkedin.com/in/soumik-das-profile/
[portfolio-badge]: https://img.shields.io/badge/Portfolio-255E63?style=for-the-badge&logo=About.me&logoColor=white
[portfolio-url]: https://mrsoumikdas.com/
[instagram-badge]: https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white
[instagram-url]: https://www.instagram.com/account.soumik.das/
[gmail-badge]: https://img.shields.io/badge/Gmail-D14836?style=for-the-badge&logo=gmail&logoColor=white
[gmail-url]: mailto:mail2soumikdas@gmail.com
