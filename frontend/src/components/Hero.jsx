import HeroSection from '../assets/Hero.jpg'

const Hero = () => {
  return (
    <main className='py-4 md:py-12'>
      <div className='flex justify-between gap-4 items-center rounded-2xl p-2'>
        { /* Left Side */}
        <div className='order-1 md:order-2'>
          <div className='h-65 sm:h-80 md:h-105 w-90 overflow-hidden rounded-2xl'><img src={HeroSection} alt="Tailors and Fashion Designer at work" className='h-full w-full object-cover' /></div>
        </div>

        { /* Right Side */}
        <div className="order-1 md:order-2 space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
            Your Perfect{' '} <br />
            <span className="text-primary">Custom Outfit</span><br />{' '}
            Awaits
          </h1>

          <p className="text-lg text-text-secondary">
            Connect with skilled tailors and fashion designers.
            Get custom-made clothes that fit perfectly and reflect your style.
          </p>
        </div>
      </div>
    </main>
  );
};

export default Hero;