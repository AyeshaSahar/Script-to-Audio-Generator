
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Audio from '@/components/Audio';

export default function Home() {
  return (
    <div className="flex flex-col justify-between bg-white min-h-screen">      
      <Header />
      <Audio />
      <Footer />
    </div>
  );
}
