import { useProducts } from '../Context/productContext'
import { TbTargetArrow } from "react-icons/tb";
import { FaHandshake } from "react-icons/fa";
import { BiSolidHappy } from "react-icons/bi";

const About = () => {
  const { products } = useProducts()

  const menCount = products.filter(p => p.gender?.toLowerCase() === "men").length
  const womenCount = products.filter(p => p.gender?.toLowerCase() === "women").length
  const boysCount = products.filter(p => p.gender?.toLowerCase() === "boys").length
  const girlsCount = products.filter(p => p.gender?.toLowerCase() === "girls").length
  const totalProducts = products.length

  return (
    <div className='max-w-6xl mx-auto px-4 py-12 space-y-15'>

      {/* Hero Section */}
      <div className='text-center'>
        <h1 className='text-5xl font-bold text-text-primary mb-4'>About Thread & Trend</h1>
        <p className='text-xl text-text-secondary max-w-3xl mx-auto'>
          Connecting you with skilled Tailors and Fashion Designer
        </p>
      </div>

      {/* Story Section */}
      <div className='grid md:grid-cols-2 gap-12 items-center'>
        <div>
          <h2 className='text-3xl font-semibold text-primary mb-6'>My Thoughts</h2>
          <p className='text-text-secondary leading-relaxed mb-4'>
            Fashion Hub was developed as my final year project with the goal of solving a real-world problem
            in the fashion industry. I noticed that many customers struggle to find reliable tailors and
            fashion designers, while skilled professionals often lack a proper platform to showcase their
            work and connect with clients. This inspired me to create a system that makes the process simple,
            transparent, and efficient.
          </p>
          <p className='text-text-secondary leading-relaxed'>
            Though there are many websites out there which is similar to my project but they just provide it
            individually not a combined version. This version is easy for the users to explore/connect the Tailors and
            Fashion Designers in a single platform. This project reflects my understanding
            of full-stack development, user experience design, and building practical digital solutions
            that address real community challenges.
          </p>
        </div>
        <div className='bg-accent-light p-8 rounded-lg'>
          <h3 className='text-2xl font-bold text-primary-dark mb-4'>My Mission</h3>
          <p className='text-text-secondary italic'>
            "To make custom clothing accessible to everyone while empowering local tailors and
            designers to showcase their talent to the world."
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <h2 className='text-3xl md:text-4xl font-bold text-primary text-center mb-10 relative inline-block after:content-[""] after:block after:w-20 after:h-1 after:bg-primary after:mx-auto after:mt-3'>
        Platform Statistics
      </h2>

      <div className='grid md:grid-cols-2 lg:grid-cols-5 gap-6'>
        {/* Total Products */}
        <div className='bg-white p-6 rounded-lg shadow-md text-center cursor-pointer group'>
          <div className='aboutStats text-4xl font-bold text-primary mb-2'>{totalProducts}+</div>
          <div className='text-text-secondary'>Total Designs</div>
        </div>

        {/* Men */}
        <div className='bg-white p-6 rounded-lg shadow-md text-center cursor-pointer group'>
          <div className='aboutStats text-4xl font-bold text-primary mb-2'>{menCount}+</div>
          <div className='text-text-secondary'>Men's wear</div>
        </div>

        {/* Women */}
        <div className='bg-white p-6 rounded-lg shadow-md text-center cursor-pointer group'>
          <div className='aboutStats text-4xl font-bold text-primary mb-2'>{womenCount}+</div>
          <div className='text-text-secondary'>Women's wear</div>
        </div>

        {/* Boys */}
        <div className='bg-white p-6 rounded-lg shadow-md text-center cursor-pointer group'>
          <div className='aboutStats text-4xl font-bold text-primary mb-2'>{boysCount}+</div>
          <div className='text-text-secondary'>Boys wear</div>
        </div>

        {/* Girls */}
        <div className='bg-white p-6 rounded-lg shadow-md text-center cursor-pointer group'>
          <div className='aboutStats text-4xl font-bold text-primary mb-2'>{girlsCount}+</div>
          <div className='text-text-secondary'>Girls wear</div>
        </div>
      </div>


      {/*Values Section */}
      <h2 className='text-3xl md:text-4xl font-bold text-primary text-center relative inline-block after:content-[""] after:block after:w-20 after:h-1 after:bg-primary after:mx-auto after:mt-3'>
        Our Core Values
      </h2>
      <div className='grid md:grid-cols-3 gap-4'>
        <div className='group cursor-pointer text-center p-6 flex justify-center items-center flex-col bg-neutral-200 rounded-3xl transition-all duration-300 hover:shadow-lg'>
          <div className='text-5xl mb-4 transition-transform duration-500 group-hover:rotate-12'>
            <TbTargetArrow />
          </div>
          <h3 className='text-xl font-semibold mb-2'>Quality First</h3>
          <p className='text-text-secondary'>Every design meets our quality standards</p>
        </div>

        <div className='group cursor-pointer text-center p-6 flex justify-center items-center flex-col bg-neutral-200 rounded-3xl transition-all duration-300 hover:shadow-lg'>
          <div className='text-5xl mb-4 group-hover:animate-pulse'>
            <FaHandshake />
          </div>
          <h3 className='text-xl font-semibold mb-2'>Trusted Platform</h3>
          <p className='text-text-secondary'>Verified professionals, schedule consultations</p>
        </div>

        <div className='group cursor-pointer text-center p-6 flex justify-center items-center flex-col bg-neutral-200 rounded-3xl transition-all duration-300 hover:shadow-lg'>
          <div className='text-5xl mb-4 group-hover:animate-bounce'>
            <BiSolidHappy />
          </div>
          <h3 className='text-xl font-semibold mb-2'>Custom Made</h3>
          <p className='text-text-secondary'>Perfect fit, your style and your choice</p>
        </div>
      </div>
    </div>
  )
}

export default About