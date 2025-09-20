import { TbMailFilled, TbPhoneFilled } from "react-icons/tb";
import Slider from "../../../components/slider/Slider";
import { useBreakpoints } from "../../../context/ProviderBreakpoints";
import Lastnews from "../../news/components/Lastnews";
import ClientsCarousel from "../../about/components/ClientsCarousel";
import CardNav from "../components/CardNav";

function Home() {
  const { isSmallDevice } = useBreakpoints();
  return (
    <div className="relative overflow-hidden">
      <section
        id="slider"
        className={`relative flex justify-start items-start  w-full  bg-bg-400
        ${isSmallDevice ? "h-auto" : "py-12 pb-54"}
        `}
      >
        {isSmallDevice ? (
          <div className="relative object-cover">
            <img src="slider/slider04.JPG" alt="Bienvenido a AST" />
          </div>
        ) : (
          <>
            <div className="absolute -top-40 -right-20 bg-primary-100 blur-3xl w-125 h-130 rounded-full opacity-40"></div>
            <div className="absolute -bottom-20 -left-20 bg-primary-100 blur-3xl w-130 h-130 rounded-full opacity-30"></div>
            <Slider />
          </>
        )}
      </section>
      <section id="cardNav" className="relative h-20 ">
        <div
          className="absolute left-0 -top-20  w-full h-90  bg-white-100 "
          style={{
            clipPath: "ellipse(100% 100% at 50% 100%)",
          }}
        ></div>
        <div className="relative  -top-33">
          <CardNav />
        </div>
      </section>
      <section id="aboutUs" className="relative w-full space-y-9 py-10">
        <div className="max-w-7xl mx-auto grid grid-cols-2 gap-10  border border-dashed border-bg-300/10 rounded-2xl  ">
          <div className="min-h-100">
            <img
              src="slider/slider01.JPG"
              alt=""
              className="rounded-2xl hover:shadow-lg transition-shadow duration-300"
            />
          </div>
          <div className="flex flex-col justify-start pt-10 gap-4">
            <h3 className="font-bold text-primary-100 text-3xl">
              Implementamos IA
            </h3>
            <p className="text-2xl">
              En AST Networks estamos incorporando inteligencia artificial para
              potenciar nuestras soluciones de monitoreo, automatización y
              análisis de datos. Esta evolución nos permitirá anticipar riesgos,
              optimizar procesos y entregar decisiones más inteligentes en
              tiempo real.
            </p>
            <button className="bg-primary-100 hover:bg-primary-100/80 text-white px-6 py-3 rounded-full w-40 hover:bg-primary-200 transition">
              Ver más
            </button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto  flex flex-col justify-center items-center">
          <div className=" border-t-2 border-bg-300/10 px-10 py-5 rounded-t-2xl ">
            <h3 className="text-2xl font-bold text-primary-100">
              Puedes ver más sobre nosotros aquí
            </h3>
          </div>
          <div className="w-full h-120 bg-black rounded-2xl"></div>
        </div>
      </section>
      <section id="lastNews" className="relative w-full py-15 bg-primary-100">
        <Lastnews />
      </section>
      <section id="contact">
        <div className="grid grid-cols-2 gap-10 max-w-7xl mx-auto py-10">
          <article className=" bg-white h-80 border border-dashed border-bg-300/10 rounded-2xl mb-4 flex flex-col justify-center items-center gap-5">
            <TbPhoneFilled className="text-8xl text-primary-100" />

            <p className="text-center text-xl max-w-lg">
              Llámenos al{" "}
              <span className="text-primary-100 font-semibold">
                +56 2 3366 3478
              </span>{" "}
              ||{" "}
              <span className="text-primary-100 font-semibold">
                +56 2 3366 3478
              </span>{" "}
              . Nuestros expertos están a su disposición 09:30 - 19:30 de lunes
              a viernes.
            </p>
          </article>
          <article className=" bg-white h-80 border border-dashed border-bg-300/10 rounded-2lg mb-4 flex flex-col justify-center items-center gap-5">
            <TbMailFilled className="text-8xl text-primary-100" />
            <p className="text-center text-xl max-w-xl">
              Puede contactarse con nosotros en nuestro email{" "}
              <span className="text-primary-100 font-semibold">
                ventas@ast.cl.
              </span>
              Nuestros expertos están a su disposición 09:30 - 19:30 de lunes a
              viernes.
            </p>
          </article>
        </div>
      </section>
      <ClientsCarousel />
    </div>
  );
}

export default Home;
