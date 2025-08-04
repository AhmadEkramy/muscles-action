

const Hero = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        muted
        loop
        playsInline
      >
        <source src="/viedo.mp4" type="video/mp4" />
        {/* Fallback message if video doesn't load */}
        <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
          <p className="text-white text-lg">Video not available</p>
        </div>
      </video>

      {/* Optional overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20 z-10"></div>
    </section>
  );
};

export default Hero;