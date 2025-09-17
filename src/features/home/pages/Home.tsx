import Slider from "../../../components/slider/Slider";

function Home() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative flex justify-start items-start pt-10 w-full h-screen bg-bg-400">
        <div className="absolute -top-40 -right-20 bg-primary-100 blur-3xl w-130 h-130 rounded-full opacity-30"></div>
        <div className="absolute -bottom-20 -left-20 bg-primary-100 blur-3xl w-130 h-130 rounded-full opacity-30"></div>
        <Slider />
      </section>
    </div>
  );
}

export default Home;
