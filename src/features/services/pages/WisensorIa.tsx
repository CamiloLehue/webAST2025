import { TbMailFilled, TbPhoneFilled } from "react-icons/tb";
import ContentSection from "../../../components/content/ContentSection";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { useReducedMotion } from "../../../hooks/useReducedMotion";

function WisensorIa() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const { shouldReduceMotion } = useReducedMotion();

  return (
    <div className="w-full min-h-screen">
      <section className="relative h-screen">
        <img
          src="img/services/wisensoria/hero.png"
          alt="hero"
          className=" object-cover w-full h-full"
        />
        <div className="w-full h-full absolute top-0 left-0 bg-black/40 flex flex-col justify-center items-center text-center px-5">
          <div className="relative -top-0 w-full max-w-7xl mx-auto h-full flex flex-col justify-center items-start text-center px-5">
            <h1 className="text-5xl font-bold text-white mb-5">
              Bienvenido a WisensorIA
            </h1>
            <p className="text-lg text-white text-left max-w-3xl">
              WisensorIA integra una infraestructura avanzada de IoT con
              capacidades de inteligencia artificial (IA) para optimizar la
              eficiencia en la gestión de datos en la industria salmonera. Este
              sistema se basa en una red de sensores inteligentes que recogen
              datos de diversas fuentes, permitiendo una recopilación eficiente
              de información ambiental y operativa. La IA aplicada a estos datos
              no solo predice posibles riesgos y problemas, sino que también
              permite tomar decisiones proactivas para mejorar la productividad
              y la sostenibilidad en los centros de cultivo.
            </p>
            <div className="max-w-3xl flex gap-5 items-center mt-8">
              <button className="bg-bg-400/30 border border-white/50 hover:bg-primary-100 text-white font-bold py-3 px-6 rounded-full mt-5 flex items-center gap-2">
                Ir a Wisensor IA
              </button>
              <button className="bg-bg-400/30 border border-white/50 hover:bg-primary-100 text-white font-bold py-3 px-6 rounded-full mt-5 flex items-center gap-2">
                Ver Video
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="max-w-7xl mx-auto w-full py-10">
        <div className="flex flex-col gap-10 justify-center items-center w-full">
          <h2 className="text-5xl font-bold text-center">
            Todo en el mismo lugar
          </h2>
          <motion.div
            ref={ref}
            className="w-full h-150 flex justify-center items-center relative"
            initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.8 }}
            animate={
              shouldReduceMotion 
                ? undefined 
                : (isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 })
            }
            transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
          >
            {/* Ícono central - visible inicialmente, se oculta cuando está en vista */}
            <motion.img
              src="svg/services/wisensoria/IconoCentral.svg"
              alt="icono central"
              className="w-auto h-auto max-w-full max-h-full object-contain"
              initial={shouldReduceMotion ? undefined : { opacity: 1, scale: 1 }}
              animate={
                shouldReduceMotion 
                  ? undefined 
                  : (isInView
                      ? {
                          opacity: 0,
                          scale: 0.5,
                          transition: { duration: 0.3, ease: "easeInOut" },
                        }
                      : {
                          opacity: 1,
                          scale: 1,
                          transition: { duration: 0.3, ease: "easeOut" },
                        })
              }
            />

            {/* Íconos completos - ocultos inicialmente, aparecen con efecto de expansión rápida */}
            <motion.img
              src="svg/services/wisensoria/Iconos.svg"
              alt="iconos completos"
              className="absolute inset-0 w-full h-full object-contain"
              initial={shouldReduceMotion ? undefined : { opacity: 0, scale: 0.3 }}
              animate={
                shouldReduceMotion 
                  ? undefined 
                  : (isInView
                      ? {
                          opacity: 1,
                          scale: 1,
                          transition: {
                            duration: 0.4,
                            delay: 0.2,
                            ease: "easeOut",
                            type: "spring",
                            stiffness: 200,
                            damping: 20,
                          },
                        }
                      : {
                          opacity: 0,
                          scale: 0.3,
                          transition: { duration: 0.2, ease: "easeIn" },
                        })
              }
            />
          </motion.div>
          <div className="flex flex-col gap-5 justify-center items-center">
            <p className="text-lg text-center max-w-4xl ">
              La plataforma permite integrar datos de diversas fuentes, creando
              una red conectada que facilita el monitoreo en tiempo real de las
              condiciones de los centros de cultivo. Esto incluye variables como
              el estado de las jaulas balsas, la corriente marina y otros
              parámetros críticos para la operación.{" "}
            </p>
            <div className="max-w-sm w-full h-1 bg-primary-100 mt-5"></div>
          </div>
          <ContentSection
            title="Bot Agente de IA"
            description={
              <>
                El chatbox de{" "}
                <span className="text-primary-100 font-bold">WisensorIA</span>,
                potenciado por inteligencia artificial, permite consultar datos
                en tiempo real con respuestas inmediatas y precisas. Además,
                cuenta con una vista interactiva del mapa, donde los usuarios
                pueden visualizar el clima y obtener representaciones gráficas
                de los datos. La IA optimiza la interacción, proporcionando
                respuestas más inteligentes y relevantes según las consultas
                realizadas.
              </>
            }
            images={["img/services/wisensoria/image01.png"]}
            altText="Bot Agente de IA"
            layout="text-right"
            className="mt-10 h-full"
            autoSlide={false}
          />

          <div>
            <h4 className="font-semibold text-5xl">
              Funcionalidades del Chatbot
            </h4>
            <img src="svg/services/wisensoria/banner.svg" alt="banner" />
          </div>

          <ContentSection
            title="Mantente al tanto de todo"
            description={
              <>
                <span className="text-primary-100 font-bold">WisensorIA</span>{" "}
                también ofrece alertas configurables que permiten una respuesta
                rápida ante cualquier evento inesperado. Estas notificaciones
                mejoran la gestión operativa y aseguran que los usuarios estén
                informados de cualquier variación relevante, optimizando la toma
                de decisiones y minimizando riesgos.
              </>
            }
            images={["img/services/wisensoria/image02.png"]}
            altText="wisensoria"
            layout="text-left"
            className="mt-10 h-full"
            autoSlide={false}
          />
          <ContentSection
            title="Visualiza tus Datos de Manera Gráfica"
            description={
              <>
                Con{" "}
                <span className="text-primary-100 font-bold">WisensorIA</span>,
                accede a datos en tiempo real y visualízalos de manera clara a
                través de gráficos interactivos, facilitando la toma de
                decisiones y el monitoreo eficiente de los centros de cultivo.
                Ademas, con tan solo solicitarlo a través del Chatbox de IA
                podrás obtener un gráfico de lo que necesites. Toda la
                información tras un solo mensaje.
              </>
            }
            images={["img/services/wisensoria/image04.png"]}
            altText="Visualiza tus Datos de Manera Gráfica"
            layout="text-right"
            className="mt-10 h-full"
            autoSlide={false}
          />
          <ContentSection
            title="Ve más allá"
            description={
              <>
                Con la integración de IA, Wisensor no solo mejora la eficiencia
                de las operaciones, sino que también permite adaptarse
                rápidamente a los cambios del entorno, lo que resulta en una
                mayor productividad, sostenibilidad y competitividad para las
                empresas salmoneras.
              </>
            }
            images={["img/services/wisensoria/image03.png"]}
            altText="Ve más allá"
            layout="text-left"
            className="mt-10 h-full"
            autoSlide={false}
          />
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

export default WisensorIa;
