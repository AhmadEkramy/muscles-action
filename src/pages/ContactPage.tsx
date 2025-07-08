import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CONTACTS = [
  {
    label: 'WhatsApp',
    value: '+201016407640',
    href: 'https://wa.me/201016407640',
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#25D366" fillOpacity="0.1"/><path d="M20 10a10 10 0 0 0-8.66 15.07l-1.1 4.03a1 1 0 0 0 1.22 1.22l4.03-1.1A10 10 0 1 0 20 10Zm-6.67 15.56.77-2.84a1 1 0 0 0-.13-.82A8 8 0 1 1 20 28a8 8 0 0 1-4.1-1.13 1 1 0 0 0-.82-.13l-2.84.77Zm8.97-4.1c-.14-.07-.82-.4-.95-.45-.13-.05-.23-.07-.33.07-.1.13-.38.45-.47.54-.09.09-.17.1-.31.03-.14-.07-.59-.22-1.13-.7-.42-.37-.7-.82-.78-.96-.08-.14-.01-.22.06-.29.07-.07.14-.17.21-.25.07-.08.09-.14.14-.23.05-.09.02-.17-.01-.24-.03-.07-.33-.8-.45-1.1-.12-.29-.24-.25-.33-.25-.09 0-.17-.01-.27-.01-.1 0-.24.03-.37.17-.13.13-.5.49-.5 1.2 0 .71.51 1.39.58 1.48.07.09 1 1.53 2.43 2.09.34.15.6.24.8.31.34.11.65.1.89.06.27-.04.82-.33.94-.65.12-.32.12-.6.08-.66-.04-.06-.13-.09-.27-.16Z" fill="#25D366"/></svg>
    )
  },
  {
    label: 'Email',
    value: 'elitesupps101@gmail.com',
    href: 'mailto:elitesupps101@gmail.com',
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#1877F2" fillOpacity="0.1"/><path d="M12 15.5A2.5 2.5 0 0 1 14.5 13h11A2.5 2.5 0 0 1 28 15.5v9A2.5 2.5 0 0 1 25.5 27h-11A2.5 2.5 0 0 1 12 24.5v-9Zm2.5-.5a.5.5 0 0 0-.5.5v.2l7 4.67 7-4.67v-.2a.5.5 0 0 0-.5-.5h-11Zm11.5 2.3-6.6 4.4a1 1 0 0 1-1.1 0l-6.6-4.4V24.5a.5.5 0 0 0 .5.5h11a.5.5 0 0 0 .5-.5V17.3Z" fill="#1877F2"/></svg>
    )
  },
  {
    label: 'Location',
    value: 'Dakahlia, Egypt',
    href: 'https://goo.gl/maps/2Qw1Qw1Qw1Qw1Qw1A',
    icon: (
      <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="20" fill="#FF4D4F" fillOpacity="0.1"/><path d="M20 12a6 6 0 0 0-6 6c0 4.2 5.4 9.54 5.63 9.76a1 1 0 0 0 1.37 0C20.6 27.54 26 22.2 26 18a6 6 0 0 0-6-6Zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4Z" fill="#FF4D4F"/></svg>
    )
  }
];

const ContactPage = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Header />
      <main className="flex-1 container mx-auto py-8 sm:py-16 px-2 sm:px-4 flex flex-col items-center">
        <h1 className="text-3xl sm:text-5xl font-extrabold text-yellow-400 text-center mb-2">Contact Us</h1>
        <div className="w-16 sm:w-24 h-1 bg-yellow-400 rounded mx-auto mb-8 sm:mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8 w-full max-w-5xl">
          {CONTACTS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-2xl shadow border border-gray-200 flex flex-col items-center p-6 sm:p-10 transition hover:shadow-lg hover:-translate-y-1 text-center"
            >
              <div className="mb-6">{item.icon}</div>
              <div className="text-xl font-bold mb-2">{item.label}</div>
              <div className="text-gray-500 text-lg">{item.value}</div>
            </a>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage; 