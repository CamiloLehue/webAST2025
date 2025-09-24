import { TbMailFilled, TbPhoneFilled } from "react-icons/tb";
import HeroSection from "../../../components/hero/HeroSection";
import ContentSection from "../../../components/content/ContentSection";

function EmpresaSustentable() {
  return (
    <div className="w-full min-h-screen">
      <HeroSection
        title="Empresa Sustentable"
        description="Impulsamos proyectos de energía limpia y sostenible mediante soluciones integrales: sistemas fotovoltaicos de alta eficiencia, planes de ahorro personalizados, respaldo y monitorización avanzada, e iluminación LED de última generación. Acompañamos a nuestros clientes en cada etapa para optimizar sus recursos y garantizar la mejor rentabilidad de su inversión."
        buttonText="Ver video"
        buttonLink="#"
        images={[
          "img/services/datacenter/image01.png",
          "img/services/datacenter/image02.png",
          "img/services/datacenter/image03.png",
        ]}
        altText="Empresa Sustentable"
        onButtonClick={() => {
          console.log("Ver video clicked");
        }}
      />
      <section className="w-full bg-primary-100 py-2 h-28 flex justify-center items-center">
        <div className=" flex justify-center items-center">
          <img src="AST-Logo-white.png" alt="AST Logo" className="h-20" />
          <div className="h-10 w-0.5 bg-white mx-10"></div>
          <h4 className="font-black text-3xl">
            <span className="text-white">DATA</span>CENTER
          </h4>
        </div>
      </section>
      <section className="max-w-7xl mx-auto w-full py-10">
        <div className="flex flex-col gap-10 justify-center items-center w-full">
          <ContentSection
            title="Energía limpia e inagotable en sus manos"
            description={
              <>
                Nos destacamos por ir{" "}
                <span className="font-bold">
                  más allá de la venta de un producto
                </span>{" "}
                y vemos la optimización de los sistemas completos usando
                diferentes tecnologías. Esto genera el mejor retorno para la
                inversión de nuestros clientes. Vamos de la mano con nuestros
                clientes y sus proyectos para alcanzar los objetivos y mejorar
                el rendimiento de su sistema.
              </>
            }
            images={["img/services/empresa-sustentable/image02.jpg"]}
            altText="Equipamiento"
            layout="text-left"
            className="mt-10 h-full"
            autoSlide={false}
          />

          <div
            className=" w-full flex h-150  gap-5 text-black bg-[#FFFEF1] rounded-2xl border-t border-t-white"
            style={{
              boxShadow:
                "rgba(50, 50, 93, 0.15) 0px 3px 6px -12px inset, rgba(0, 0, 0, 0.2) 0px 6px 36px -6px inset",
            }}
          >
            <div className="grid grid-cols-2 w-full h-full p-10">
              <div className="rounded-2xl bg overflow-hidden  flex justify-center items-center">
                <img
                  draggable={false}
                  src={"img/services/empresa-sustentable/image01.jpg"}
                  alt={"Planes de ahorro personalizados"}
                  className="w-full object-cover h-full "
                />
              </div>
              <div className="flex flex-col justify-start items-start gap-5 ps-10">
                <h5 className="font-black text-4xl">Paneles Fotovoltaicos</h5>
                <p className="text-lg  leading-6">
                  Ofrecemos proyectos de instalación de paneles solares,
                  trabajando con equipos de alta calidad y garantizando máxima
                  eficiencia.
                </p>
                <div className="relative flex flex-row justify-start items-center mt-5">
                  <div className="w-30 h-full">
                    <img
                      src="img/services/empresa-sustentable/iconCasa.png"
                      alt="Paneles Fotovoltaicos"
                    />
                  </div>
                  <div className="w-full px-5">
                    <p className="text-lg leading-6">
                      <span className="font-bold">Ahorro Residencial:</span>
                      Atendemos cada caso con un plan de ahorro personalizado.
                      Tras un diagnóstico del consumo energético, proponemos
                      soluciones completas que incluyen la instalación de
                      paneles solares y mejoras como el cambio del sistema de
                      iluminación.
                    </p>
                  </div>
                </div>
                <div className="relative flex flex-row justify-start items-center mt-5">
                  <div className="w-30 h-full">
                    <img
                      src="img/services/empresa-sustentable/iconTorre.png"
                      alt="Paneles Fotovoltaicos"
                    />
                  </div>
                  <div className="w-full px-5">
                    <p className="text-lg leading-6">
                      <span className="font-bold">Comercial / Industrial:</span>
                      Creamos soluciones a la medida para optimizar el uso de
                      recursos naturales, maximizando el ahorro. Adaptamos
                      nuestros sistemas a distintos espacios como
                      estacionamientos, oficinas y plantas industriales, según
                      las necesidades del cliente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ContentSection
            title="Respaldo y monitorización"
            description={
              <>
                Como la totalidad de nuestros controladores de carga, la función
                principal es{" "}
                <span className="font-bold">
                  proteger las baterías contra sobrecargas
                </span>
                , pero también incorpora muchas funciones que le ayudaran a
                monitorear mejor el desempeño de su sistema solar. Se dispone de
                variados modelos según su necesidad. Existen modelos con
                indicadores de LED, y{" "}
                <span className="font-bold">los más sofisticados </span>con el
                display LCD incorporado que permiten controlar el nivel de carga
                y la corriente solar para ver el nivel de potencia que está
                consiguiendo.
              </>
            }
            images={["img/services/empresa-sustentable/image03.png"]}
            altText="Equipamiento"
            layout="text-left"
            className="mt-10 h-full"
            autoSlide={false}
          />
          <ContentSection
            title="Iluminación Led"
            description={
              <>
                Seguimos investigando y renovándonos constantemente puesto que
                tecnológicamente los avances son rápidos y obligan a estar
                alerta continuamente a las novedades. Nuestro ADN de
                investigación siempre está alerta y pensando en desarrollar
                nuevas tecnologías que ahora apoyen a nuestros clientes en
                soluciones mas ecológicas y de máxima rentabilidad. Gracias a
                estos últimos avances podemos hoy afirmar que este es el momento
                para decidirse y utilizar la iluminación led, nosotros te
                aconsejaremos e informaremos que iluminación led es la más
                adecuada para tu tipo de negocio, tienda, oficina, talleres,
                etc.
              </>
            }
            images={["img/services/empresa-sustentable/image04.png"]}
            altText="Equipamiento"
            layout="text-right"
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

export default EmpresaSustentable;
