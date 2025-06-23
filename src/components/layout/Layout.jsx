import Navbar from './Navbar';
import Footer from './Footer';
import PageTransition from './PageTransition';

export default function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <PageTransition>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
}
