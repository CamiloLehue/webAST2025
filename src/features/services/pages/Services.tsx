import { TbMailFilled, TbPhoneFilled } from "react-icons/tb";
import { useMenuNavItems } from "../../../layouts/hooks/useMenuNavItems";
import { useState, useEffect } from "react";

// Datos de ejemplo para cada servicio
const servicesData = {
  "/wisensor": {
    title: "Wisensor",
    description:
      "Tecnología avanzada de sensores inalámbricos para monitoreo en tiempo real de parámetros ambientales y operacionales en acuicultura. Soluciones IoT que optimizan la productividad y sostenibilidad de las operaciones acuícolas.",
    image: "img/inicio/ia-wisensor.jpg",
    href: "/wisensor",
  },
  "/seguridad": {
    title: "Seguridad",
    description:
      "Sistemas integrales de seguridad y videovigilancia con tecnología de vanguardia. Protección 24/7 para instalaciones industriales, centros de cultivo y infraestructuras críticas con monitoreo remoto.",
    image: "img/services/hero-services.jpg",
    href: "/seguridad",
  },
  "/datacenter": {
    title: "Datacenter",
    description:
      "Infraestructura de centros de datos robusta y confiable. Servicios de hosting, colocation y cloud computing con alta disponibilidad y seguridad para respaldar las operaciones críticas de su empresa.",
    image: "img/services/hero-services.jpg",
    href: "/datacenter",
  },
  "/energia-renovable": {
    title: "Energía Renovable",
    description:
      "Soluciones energéticas sustentables mediante paneles solares, sistemas eólicos y tecnologías limpias. Reducción de costos operacionales y huella de carbono con sistemas de energía renovable eficientes.",
    image: "img/services/hero-services.jpg",
    href: "/energia-renovable",
  },
  "/satelital": {
    title: "Satelital",
    description:
      "Comunicaciones satelitales de alta velocidad para conectividad en zonas remotas. Internet satelital confiable para centros de cultivo, embarcaciones y ubicaciones donde la conectividad tradicional es limitada.",
    image: "img/services/hero-services.jpg",
    href: "/satelital",
  },
  "/wireless": {
    title: "Wireless",
    description:
      "Redes inalámbricas de alta capacidad y largo alcance. Conectividad wireless robusta para entornos industriales y marítimos con equipos certificados para condiciones extremas.",
    image: "img/services/hero-services.jpg",
    href: "/wireless",
  },
  "/wisensor-ia": {
    title: "Wisensor IA",
    description:
      "Inteligencia artificial aplicada a sensores para análisis predictivo y automatización. Machine learning para optimizar procesos, predecir mantenimientos y mejorar la eficiencia operacional.",
    image: "img/inicio/ia-wisensor.jpg",
    href: "/wisensor-ia",
  },
};

function Services() {
  const { menuItems } = useMenuNavItems();
  const subServices = menuItems.some((item) => item.path === "/servicios")
    ? menuItems.find((item) => item.path === "/servicios")?.submenu || []
    : [];

  const [activeServiceIndex, setActiveServiceIndex] = useState(0);

  // Efecto para cambio automático cada 3 segundos
  useEffect(() => {
    if (subServices.length === 0) return;

    const interval = setInterval(() => {
      setActiveServiceIndex(
        (prevIndex) => (prevIndex + 1) % subServices.length
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [subServices.length]);

  // Obtener el servicio activo
  const activeService = subServices[activeServiceIndex];
  const activeServiceData = activeService
    ? servicesData[activeService.path as keyof typeof servicesData]
    : null;
  return (
    <div className="w-full min-h-screen ">
      <section className=" bg-bg-400 flex flex-row justify-center items-center h-130 overflow-hidden border-t border-t-bg-200 border-b-4 border-primary-100 ">
        <div className="grid grid-cols-4 gap-5">
          <div className="col-start-2 w-full h-full flex flex-col justify-center">
            <article>
              <div className="w-full h-full flex flex-col gap-5">
                <h2 className="text-white text-4xl font-semibold">
                  Nuestros Servicios
                </h2>
                <p className="text-white-100 text-xl">
                  En AST Networks integramos tecnología y experiencia para
                  entregar soluciones innovadoras en acuicultura, seguridad y
                  telecomunicaciones, con un enfoque en eficiencia,
                  sustentabilidad y alto estándar técnico.
                </p>
              </div>
            </article>
          </div>
          <div className="relative col-span-2 w-full h-full overflow-hidden">
            <img
              draggable={false}
              src={"img/services/hero-services.jpg"}
              alt={"Servicios"}
              className="w-full object-cover  "
            />
            <div className="absolute left-0 top-0 bg-gradient-to-r from-bg-400 to-transparent h-full w-1/3"></div>
          </div>
        </div>
      </section>
      <section className="w-full ">
        <div className="relative flex justify-center items-center -top-10">
          <nav className="bg-white h-20 rounded-full overflow-hidden flex justify-center items-center">
            <ul className="flex flex-row justify-center items-center ">
              {subServices.map((item, index) => (
                <li
                  key={item.path}
                  className={`px-7 cursor-pointer transition-all duration-300 ${
                    index === activeServiceIndex
                      ? "text-white font-semibold bg-primary-100 py-7"
                      : "text-bg-300 hover:text-primary-100"
                  }`}
                  onClick={() => setActiveServiceIndex(index)}
                >
                  {item.title}
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="w-full max-w-7xl mx-auto pb-10 h-120">
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col justify-center p-5">
              <h3 className="text-4xl font-bold transition-all duration-500">
                {activeServiceData?.title || "Selecciona un servicio"}
              </h3>
              <p className="text-lg text-bg-300 mt-5 transition-all duration-500">
                {activeServiceData?.description ||
                  "Descripción del servicio seleccionado aparecerá aquí."}
              </p>
              <button
                onClick={() => {
                  if (activeServiceData) {
                    window.location.href = activeServiceData.href;
                  }
                }}
                className="mt-15 bg-primary-100 text-white w-40 px-5 py-3 rounded-lg hover:bg-primary-100/80 transition-colors"
              >
                Ver más
              </button>
            </div>

            <div className="transition-all duration-500">
              <img
                src={
                  activeServiceData?.image || "img/services/hero-services.jpg"
                }
                alt={activeServiceData?.title || "Servicio"}
                className="rounded-2xl w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="relative h-130 ">
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

export default Services;
