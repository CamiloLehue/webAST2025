import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router";

function Wisensor() {
  return (
    <div className="w-full min-h-screen">
      <section className=" bg-bg-400 flex flex-row justify-center items-center h-130 overflow-hidden border-t border-t-bg-200 border-b-4 border-primary-100 ">
        <div className="grid grid-cols-4 gap-5 w-full">
          <div className="col-span-2 w-full h-full flex justify-center  items-center">
            <article className="flex flex-col items-end justify-center w-full">
              <div className="max-w-2xl h-full flex flex-col gap-5">
                <h2 className="text-white text-5xl font-bold">Wisensor</h2>
                <p className="text-white-100 text-lg">
                  Wisensor es una plataforma desarrollada por AST con el
                  objetivo de integrar diversos datos relevantes de la industria
                  salmonera en Chile, ofreciendo una vista unificada y
                  optimizada para mejorar la gestión y operación de los centros
                  de cultivo. A través de esta plataforma, se visualizan y
                  gestionan datos importantes relacionados con las condiciones
                  ambientales y operativas de las jaulas balsas, mallas de
                  contención y otros factores clave.
                </p>
              </div>
              <div className="w-full max-w-sm mt-5 mx-auto ">
                <Link
                  to={`#`}
                  className="inline-flex items-center text-primary-100 hover:text-white-100 transition-colors duration-300 font-medium border px-4  py-1 w-max"
                >
                  Ver video
                  <FiArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </article>
          </div>
          <div className="relative col-span-2 w-full h-full overflow-hidden">
            <img
              draggable={false}
              src={"img/services/wisensor/hero.jpg"}
              alt={"Servicios"}
              className="w-full object-cover  "
            />
            <div className="absolute left-0 top-0 bg-gradient-to-r from-bg-400 to-transparent h-full w-1/3"></div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Wisensor;
