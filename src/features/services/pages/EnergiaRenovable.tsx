import { FiArrowRight } from "react-icons/fi";
import { TbChevronDown, TbMailFilled, TbPhoneFilled } from "react-icons/tb";
import { Link } from "react-router";

function EnergiaRenovable() {
  return (
    <div className="w-full min-h-screen">
      <section className=" bg-bg-400 flex flex-row justify-center items-center h-130 overflow-hidden border-t border-t-bg-200 border-b-4 border-primary-100 ">
        <div className="grid grid-cols-4 gap-5 w-full">
          <div className="col-span-2 w-full h-full flex justify-center  items-center">
            <article className="flex flex-col items-end justify-center w-full">
              <div className="max-w-2xl h-full flex flex-col gap-5">
                <h2 className="text-white text-5xl font-bold">Energia Renovable</h2>
                <p className="text-white-100 text-lg">
                  Energia Renovable es una plataforma desarrollada por AST con el
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
      <section className="w-full bg-primary-100 py-2 h-28 flex justify-center items-center">
        <div className=" flex justify-center items-center">
          <img src="AST-Logo-white.png" alt="AST Logo" className="h-20" />
          <div className="h-10 w-0.5 bg-white mx-10"></div>
          <h4 className="font-black text-3xl">
            <span className="text-white">WI</span>SENSOR
          </h4>
        </div>
      </section>
      <section className="max-w-7xl mx-auto w-full py-10 ">
        <div className="flex flex-col justify-center items-center w-full ">
          <h2 className="text-3xl font-bold text-primary-100">
            Los principales objetivos de la plataforma incluyen:
          </h2>
          <div className="grid grid-cols-2 gap-8 mt-10 h-full">
            <div className="flex flex-col justify-center items-center gap-5">
              <p className="text-lg font-semibold leading-6">
                <span className="text-primary-100">
                  Integración de Datos de Sensores:
                </span>{" "}
                Wisensor permite la integración de datos de diversos sensores
                instalados en los centros de cultivo, como los pasadores de
                carga y correntómetros, que proporcionan información crítica
                sobre la fuerza recibida por las jaulas y las corrientes
                marinas.
              </p>
              <p className="text-lg font-semibold leading-6">
                <span className="text-primary-100">
                  Monitoreo del Estado de las Jaulas y Mallas:
                </span>{" "}
                La plataforma ofrece una visualización en tiempo real del estado
                de las mallas loberas y de contención, junto con la
                geolocalización y los detalles específicos de los eventos
                observados, como cortes o daños en las mallas y la presencia de
                mortalidad en las jaulas.
              </p>
            </div>
            <div className="w-full h-full">
              <img
                draggable={false}
                src={"img/services/wisensor/hero.jpg"}
                alt={"Servicios"}
                className="w-full h-90 object-cover aspect-square rounded-2xl  "
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5 mt-10">
          <article className="h-25 rounded-2xl flex justify-between gap-2 ps-10 items-center bg-primary-100">
            <div className="w-20 h-20 flex justify-center items-center">
              <img src="/public/svg/services/wisensor/nubes.svg" alt="" />
            </div>
            <div className="flex-1 flex flex-col w-full text-white ">
              <h3 className="text-2xl text-nowrap font-bold leading-4 ">
                Monitoreo continuo
              </h3>
              <p className="text-lg">de condiciones ambientales.</p>
            </div>
          </article>
          <article className="h-25 rounded-2xl flex justify-between gap-2 ps-10 items-center bg-primary-100">
            <div className="w-20 h-20 flex justify-center items-center">
              <img
                src="/public/svg/services/wisensor/Tecnologias IoT.svg"
                alt=""
              />
            </div>
            <div className="flex-1 flex flex-col w-full text-white ">
              <h3 className="text-2xl text-nowrap font-bold leading-4 ">
                Tecnología IoT
              </h3>
              <p className="text-lg">para datos en tiempo real.</p>
            </div>
          </article>
          <article className="h-25 rounded-2xl flex justify-between gap-2 ps-10 items-center bg-primary-100">
            <div className="w-20 h-20 flex justify-center items-center">
              <img src="/public/svg/services/wisensor/Pez.svg" alt="" />
            </div>
            <div className="flex-1 flex flex-col w-full text-white ">
              <h3 className="text-2xl text-nowrap font-bold leading-4 ">
                Gestión eficiente
              </h3>
              <p className="text-lg">de la biomasa acuática.</p>
            </div>
          </article>
        </div>
        <div className="grid grid-cols-2 gap-8 mt-10 h-full">
          <div className="w-full h-full overflow-hidden rounded-2xl">
            <img
              draggable={false}
              src={"img/services/wisensor/wisensor-app2.png"}
              alt={"Servicios"}
              className="w-full h-90 object-cover aspect-square rounded-2xl scale-110 "
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-5">
            <p className="text-lg font-semibold leading-6">
              <span className="text-primary-100">Streaming de Video:</span>{" "}
              Wisensor permite la visualización en tiempo real y posterior de
              los datos de video de drones submarinos, brindando una herramienta
              completa para monitorear el estado de las estructuras en el fondo
              marino.
            </p>
            <p className="text-lg font-semibold leading-6">
              <span className="text-primary-100">Alertas y Alarmas:</span> A
              través de la plataforma, se generan alarmas basadas en los
              parámetros sensados, lo que permite a los operadores identificar
              rápidamente situaciones críticas, como sobrecargas en las jaulas o
              condiciones peligrosas en el entorno acuático.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-5 mt-10">
          <article className="h-25 rounded-2xl flex justify-between gap-2 ps-10 items-center bg-primary-100">
            <div className="w-20 h-20 flex justify-center items-center">
              <img src="/public/svg/services/wisensor/tren.svg" alt="" />
            </div>
            <div className="flex-1 flex flex-col w-full text-white ">
              <h3 className="text-2xl text-nowrap font-bold leading-4 ">
                Gestión optimizada
              </h3>
              <p className="text-lg">del transporte logístico.</p>
            </div>
          </article>
          <article className="h-25 rounded-2xl flex justify-between gap-2 ps-10 items-center bg-primary-100">
            <div className="w-20 h-20 flex justify-center items-center">
              <img src="/public/svg/services/wisensor/escudo.svg" alt="" />
            </div>
            <div className="flex-1 flex flex-col w-full text-white ">
              <h3 className="text-2xl text-nowrap font-bold leading-4 ">
                Protección
              </h3>
              <p className="text-lg">y vigilancia avanzada.</p>
            </div>
          </article>
          <article className="h-25 rounded-2xl flex justify-between gap-2 ps-10 items-center bg-primary-100">
            <div className="w-20 h-20 flex justify-center items-center">
              <img src="/public/svg/services/wisensor/Jaula.svg" alt="" />
            </div>
            <div className="flex-1 flex flex-col w-full text-white ">
              <h3 className="text-2xl text-nowrap font-bold leading-4 ">
                Jaulas automatizadas
              </h3>
              <p className="text-lg">para monitoreo constante.</p>
            </div>
          </article>
        </div>
        <div className="grid grid-cols-2 gap-8 mt-10 h-full">
          <div className="flex flex-col justify-center items-center gap-5">
            <p className="text-lg font-semibold leading-6">
              <span className="text-primary-100">
                Integración de Datos de Sensores:
              </span>{" "}
              Wisensor permite la integración de datos de diversos sensores
              instalados en los centros de cultivo, como los pasadores de carga
              y correntómetros, que proporcionan información crítica sobre la
              fuerza recibida por las jaulas y las corrientes marinas.
            </p>
            <p className="text-lg font-semibold leading-6">
              <span className="text-primary-100">
                Monitoreo del Estado de las Jaulas y Mallas:
              </span>{" "}
              La plataforma ofrece una visualización en tiempo real del estado
              de las mallas loberas y de contención, junto con la
              geolocalización y los detalles específicos de los eventos
              observados, como cortes o daños en las mallas y la presencia de
              mortalidad en las jaulas.
            </p>
          </div>
          <div className="w-full h-full rounded-2xl overflow-hidden">
            <img
              draggable={false}
              src={"img/services/wisensor/wisensor-app.png"}
              alt={"Servicios"}
              className="w-full h-90 object-cover aspect-square rounded-2xl scale-110"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center items-center mt-20">
          <div className=" border-t-2 border-bg-300/10 px-10 py-5 rounded-t-2xl  flex justify-center items-center gap-1 ">
            <TbChevronDown
              className="text-primary-100 text-2xl animate-bounce"
              style={{
                animationDuration: "1.5s",
              }}
            />
            <h3 className="text-2xl font-bold text-primary-100">
              Puedes ver un video demostrativo aquí
            </h3>
            <TbChevronDown
              className="text-primary-100 text-2xl animate-bounce"
              style={{
                animationDuration: "1.5s",
              }}
            />
          </div>
          <div className="w-full h-120 bg-black rounded-2xl overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/fI-tzs7NnNE?si=HCiO3OqtZgFZsa4r"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            ></iframe>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-8 mt-10 h-full">
          <div className="relative w-full h-full">
            <img
              draggable={false}
              src={"img/services/wisensor/aplicaciones.png"}
              alt={"Servicios"}
              className="w-full h-90 object-cover aspect-square rounded-2xl  "
            />
            <img
              draggable={false}
              src={"img/services/wisensor/Wisensor.png"}
              alt={"Servicios"}
              className="relative w-[50%] mx-auto -top-8  "
            />
          </div>
          <div className="flex flex-col justify-center items-center gap-5">
            <p className="text-lg font-semibold leading-6">
              <span className="text-primary-100">Wisensor </span> es la
              herramienta ideal para la industria salmonera chilena, pues
              permite centralizar los datos clave de las operaciones en una sola
              interfaz, facilitando el monitoreo continuo y mejorando la
              eficiencia y sostenibilidad de la producción.
            </p>
          </div>
        </div>
        <div className="w-full flex justify-center items-center gap-8 mt-10 h-full">
          <div className="relative w-full h-full">
            <img
              draggable={false}
              src={"img/services/wisensor/Artboard.png"}
              alt={"Servicios"}
              className="w-full h-full object-cover rounded-2xl  "
            />
          </div>
        </div>
      </section>
      <section className="relative h-130">
        <div
          className="absolute left-0 -top-0  w-full h-130  bg-primary-100 "
          style={{
            clipPath: "ellipse(100% 100% at 50% 100%)",
          }}
        ></div>
        <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex flex-col justify-center items-center text-center text-white px-5">
          <h1 className="text-center text-5xl font-bold mt-20">
            ¿Tienes dudas? Contáctanos{" "}
          </h1>
          <div className="grid grid-cols-2 gap-10 w-full py-10 text-black">
            <article className=" bg-white rounded-2xl h-80  border border-dashed border-bg-300/10  mb-4 flex flex-col justify-center items-center gap-5">
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
                . Nuestros expertos están a su disposición 09:30 - 19:30 de
                lunes a viernes.
              </p>
            </article>
            <article className=" bg-white rounded-2xl h-80 border border-dashed border-bg-300/10 rounded-2lg mb-4 flex flex-col justify-center items-center gap-5">
              <TbMailFilled className="text-8xl text-primary-100" />
              <p className="text-center text-xl max-w-xl">
                Puede contactarse con nosotros en nuestro email{" "}
                <span className="text-primary-100 font-semibold">
                  ventas@ast.cl.
                </span>
                Nuestros expertos están a su disposición 09:30 - 19:30 de lunes
                a viernes.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default EnergiaRenovable;
