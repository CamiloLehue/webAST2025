import { TbMailFilled, TbPhoneFilled } from "react-icons/tb";
import HeroSection from "../../../components/hero/HeroSection";
import ContentSection from "../../../components/content/ContentSection";

function Datacenter() {
  return (
    <div className="w-full min-h-screen">
      <HeroSection
        title="Datacenter"
        description="Nuestro servicio de Datacenter ofrece infraestructura tecnológica de alta disponibilidad, seguridad y escalabilidad para alojar y gestionar los datos críticos de tu empresa. Contamos con sistemas avanzados de respaldo, monitoreo 24/7, control de acceso y redundancia eléctrica, garantizando la continuidad operativa y la protección de tu información. Nuestro equipo de expertos te acompaña en la migración, administración y optimización de tus recursos, permitiendo que tu negocio crezca con total confianza y eficiencia."
        buttonText="Ver video"
        buttonLink="#"
        images={[
          "img/services/datacenter/hero.jpg",
          "img/services/datacenter/image01.png",
          "img/services/datacenter/image02.png",
          "img/services/datacenter/image03.png",
        ]}
        altText="Datacenter"
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
            title="Equipamiento"
            description={
              <>
                El equipamiento de nuestros Datacenter ha sido cuidadosamente
                seleccionado para ofrecer un{" "}
                <span className="text-red-500 font-bold">
                  rendimiento de vanguardia{" "}
                </span>{" "}
                y garantizar una alta disponibilidad de los servicios,
                manteniendo un{" "}
                <span className="text-red-500 font-bold">
                  consumo energético eficiente
                </span>
                . Utilizamos servidores Mac y Dell PowerEdge R740xd , que
                optimizan tanto el rendimiento como el consumo de energía,
                alojando no solo la información, sino también los diversos
                servicios digitales de la empresa, como sitios web. Además,
                incorporamos{" "}
                <span className="text-red-500 font-bold">GPU Tesla V100</span>{" "}
                para procesar grandes volúmenes de datos y realizar tareas de
                <span className="text-red-500 font-bold">
                  {" "}
                  inteligencia artificial (IA)
                </span>
                . Nuestros sistemas de enfriamiento por agua ambiental
                aprovechan las condiciones climáticas locales, maximizando la
                eficiencia energética y reduciendo el consumo durante el proceso
                de refrigeración.
              </>
            }
            images={["img/services/datacenter/image01.png"]}
            altText="Equipamiento"
            layout="text-left"
            className="mt-10 h-full"
            autoSlide={false}
          />

          <div className=" w-full h-40 grid grid-cols-12 gap-5 text-white">
            <article className="col-span-2 h-38  rounded-2xl flex flex-col justify-center items-center ">
              <img
                src="svg/services/datacenter/Datacenter.svg"
                alt=""
                className="w-full h-full"
              />
            </article>
            <article className="col-span-2 h-35 bg-primary-100 rounded-2xl flex flex-col justify-center items-center">
              <h4 className="text-6xl font-black">12TB</h4>
              <p className="text-xl">de RAM</p>
            </article>
            <article className="col-span-3 h-35 bg-primary-100 rounded-2xl flex flex-col justify-center items-center">
              <h4 className="text-6xl font-black">1200TB</h4>
              <p className="text-xl">de Almacenamiento</p>
            </article>
            <article className="col-span-5 h-35 bg-primary-100 rounded-2xl flex flex-col justify-center items-center">
              <h4 className="text-6xl font-black">500Ghz</h4>
              <p className="text-xl">de poder de procesamiento</p>
            </article>
          </div>

          <ContentSection
            title="IA"
            description="La inteligencia artificial (IA) está integrada en todos los aspectos de la operación de nuestro Datacenter, permitiendo una gestión eficiente y precisa de los recursos. Gracias a la IA, podemos optimizar dinámicamente el uso de los recursos, garantizando que los servidores y sistemas operen con máxima eficiencia y mínimo consumo de energía. Además, la IA predice posibles fallos o sobrecargas en el sistema, lo que nos permite tomar medidas preventivas antes de que ocurra un problema. La automatización y el control inteligente ajustan en tiempo real las condiciones operativas del Datacenter y el software operativo en esta, gestionando aspectos como temperatura, uso de energía y distribución de cargas de trabajo."
            images={["img/services/datacenter/image02.png"]}
            altText="IA"
            layout="text-right"
            className="mt-10 h-full"
            autoSlide={false}
          />

          <div className=" w-full h-40 grid grid-cols-12 gap-5 text-white">
            <article className="col-span-5 h-35 bg-primary-100 rounded-2xl flex flex-col justify-center items-center">
              <h4 className="text-6xl font-black">112 TFLOPS</h4>
              <p className="text-xl">Poder de cálculo en IA</p>
            </article>
            <article className="col-span-5 h-35 bg-primary-100 rounded-2xl flex flex-col justify-center items-center">
              <h4 className="text-6xl font-black">32x Más rápido</h4>
              <p className="text-xl">En entrenamiento que una CPU</p>
            </article>
            <article className="col-span-2 h-38  rounded-2xl flex flex-col justify-center items-center ">
              <img
                src="svg/services/datacenter/brillos.svg"
                alt=""
                className="w-full h-full"
              />
            </article>
          </div>

          <ContentSection
            title="INFRAESTRUCTURA"
            description="La infraestructura de nuestros Datacenter ha sido cuidadosamente diseñada para garantizar la seguridad, fiabilidad y eficiencia operativa. Están ubicados en terrenos elevados y de fácil acceso, lo que protege nuestras instalaciones de riesgos climáticos y desastres naturales. La estructura en hormigón reforzado asegura estabilidad y resistencia, mientras que los sistemas de seguridad avanzada, como cerco eléctrico, cámaras de videovigilancia, acceso biométrico y protección contra incendios, resguardan la integridad de los datos. Además, contamos con un diseño térmico optimizado que utiliza sistemas de enfriamiento avanzado para maximizar la eficiencia energética y minimizar el consumo, contribuyendo a la sostenibilidad de las operaciones."
            images={["img/services/datacenter/image03.png"]}
            altText="Infraestructura"
            layout="text-top"
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

export default Datacenter;
