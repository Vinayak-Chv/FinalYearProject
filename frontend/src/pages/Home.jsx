import Hero from "../components/Hero";
import Browse from "../components/Browse";

const Home = () => {
  return (
    <div className='py-4 md:py-12 space-y-12 md:space-y-20'>
      <Hero />
      <Browse />
    </div>
  );
};

export default Home;
