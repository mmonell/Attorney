import React from 'react';
    import Header from '../components/Header';
    import Footer from '../components/Footer';
    import { useRouter } from 'next/router';
    import { MessageSquare, Phone, Video, Linkedin } from 'lucide-react';
    

const attorney = {
  name: 'Rosie Tejada',
  title: 'Criminal Defense Attorney',
  location: 'Orlando, FL',
  phone: '(555) 123-4567',
  email: 'rosie.tejada@lawfirm.com',
  zoom: 'https://zoom.us/j/1234567890',
  bio: `Rosie Tejada is an experienced criminal defense attorney with a proven track record of defending clients in high-stakes cases. She is dedicated to providing compassionate, strategic, and effective legal representation.`,
  photo: '/images/rosietejada.jpeg',
};

const Contact: React.FC = () => {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main className="pt-16">
        <section className="py-16 px-4">
          <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-2xl shadow-lg p-8 flex flex-col items-center">
            <img
              src={attorney.photo}
              alt={attorney.name}
              className="w-32 h-32 rounded-full border-4 border-white shadow mb-4 object-cover"
            />
            <h1 className="text-3xl font-bold text-white mb-1">{attorney.name}</h1>
            <div className="text-blue-400 text-lg font-medium mb-2">{attorney.title}</div>
            <div className="text-white/70 mb-4 flex items-center gap-2">
              <span>{attorney.location}</span>
            </div>
            <p className="text-white/80 text-center mb-6">{attorney.bio}</p>
            <div className="flex gap-6 mb-6">
              <a href={`tel:${attorney.phone.replace(/[^\d]/g, '')}`} className="flex flex-col items-center group">
                <span className="bg-blue-600 group-hover:bg-blue-700 text-white p-4 rounded-full shadow-lg mb-2 transition-all">
                  <Phone className="w-6 h-6" />
                </span>
                <span className="text-xs text-white/70">Call</span>
              </a>
              <button
                onClick={() => router.push('/secure-messages')}
                className="flex flex-col items-center group focus:outline-none"
              >
                <span className="bg-blue-600 group-hover:bg-blue-700 text-white p-4 rounded-full shadow-lg mb-2 transition-all">
                  <MessageSquare className="w-6 h-6" />
                </span>
                <span className="text-xs text-white/70">Message</span>
              </button>
              <a
                href={attorney.zoom}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center group"
              >
                <span className="bg-blue-600 group-hover:bg-blue-700 text-white p-4 rounded-full shadow-lg mb-2 transition-all">
                  <Video className="w-6 h-6" />
                </span>
                <span className="text-xs text-white/70">Video</span>
              </a>
            </div>
            <div className="w-full border-t border-white/10 pt-6 mt-4 text-center">
              <div className="text-white/80 text-sm">Email: <a href={`mailto:${attorney.email}`} className="underline text-blue-300 hover:text-blue-400">{attorney.email}</a></div>
              <div className="text-white/80 text-sm mt-1">Phone: <a href={`tel:${attorney.phone.replace(/[^\d]/g, '')}`} className="underline text-blue-300 hover:text-blue-400">{attorney.phone}</a></div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
    
    export default Contact;