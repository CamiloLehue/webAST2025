import ContentSection from "../../../components/content/ContentSection";
import HeroSection from "../../../components/hero/HeroSection";

function IoT() {
  return (
    <div className="w-full min-h-screen">
      <HeroSection
        title="IoT (Internet of things)"
        description="En AST, nos especializamos en soluciones tecnológicas de vanguardia que transforman datos en acciones inteligentes. Con foco en IoT (Internet de las Cosas), ofrecemos plataformas que integran sensores, conectividad y análisis, para que las empresas puedan monitorear sus operaciones, anticipar riesgos y optimizar recursos. Nuestro compromiso es proveer sistemas confiables, escalables y adaptados a las necesidades reales del cliente."
        buttonText="Ver video"
        buttonLink="#"
        images={["img/services/drones/image01.png"]}
        altText="IoT (Internet of things)"
        onButtonClick={() => {
          console.log("Ver video clicked");
        }}
      />
      <section className="w-full bg-primary-100 py-2 h-28 flex justify-center items-center">
        <div className=" flex justify-center items-center">
          <img src="AST-Logo-white.png" alt="AST Logo" className="h-20" />
          <div className="h-10 w-0.5 bg-white mx-10"></div>
          <h4 className="font-black text-3xl">SEGURIDAD</h4>
        </div>
      </section>
      <section className="max-w-7xl mx-auto w-full py-10">
        <div className="flex flex-col gap-10 justify-center items-center w-full">
          <ContentSection
            title="Telemetría y analítica multiparamétrica"
            description={
              <>
                Integramos sensores propios y de terceros para capturar datos
                críticos y transformarlos en información accesible y efectiva.
                Nuestro sistema de monitorización remota multiparamétrica
                permite registrar y visualizar, en simultáneo, múltiples
                variables desde uno o varios centros de control. Entre los
                parámetros que podemos monitorear:
              </>
            }
            images={["img/services/drones/image02.png"]}
            altText="Aplicaciones"
            layout="text-right"
            className="mt-10 h-full"
            autoSlide={false}
          />
          <div className="w-full  gap-5">
            <h2 className="text-5xl font-bold">Sensores integrados</h2>
            <img src="svg/services/iot/sensores.svg" alt="sensores" />
          </div>

          <ContentSection
            title="Conectividad robusta con LoRaWAN"
            description={
              <>
                Adoptamos la tecnología LoRaWAN (Long Range Wide Area Network),
                un estándar global ideal para IoT, garantizando que nuestras
                soluciones sean compatibles, seguras y preparadas para el
                futuro.
              </>
            }
            images={["img/services/iot/image01.png"]}
            altText="Seguridad"
            layout="text-left"
            className="mt-10 h-full"
            autoSlide={false}
          />
          <ContentSection
            title="Estación de Acoplamiento"
            description={
              <>
                Nuestra solución tecnológica se basa en el DOCK, una estación de
                acoplamiento y carga automatizada, compacta y robusta, diseñada
                para operar en entornos hostiles gracias a su certificación IP55
                y sensores climáticos integrados. Este sistema es la base para
                los drones Matrice 3D y 3TD; el primero está equipado con
                cámaras de alta precisión para mapeo, mientras que el segundo
                añade una cámara infrarroja para inspecciones térmicas y de
                seguridad. Ambas aeronaves cuentan con un sistema
                omnidireccional de detección de obstáculos para garantizar la
                máxima seguridad en cada misión.
              </>
            }
            images={["img/services/drones/image04.png"]}
            altText="Estación de Acoplamiento"
            layout="text-right"
            className="mt-10 h-full"
            autoSlide={false}
          />
          <ContentSection
            title="Siempre en funcionamiento"
            description={
              <>
                La autonomía y eficiencia del sistema se garantizan mediante un
                ciclo de operación continua 24/7. El DOCK cuenta con un sistema
                de carga rápida que recarga la batería del dron en solo 32
                minutos y una batería de respaldo interna para casos de cortes
                de energía. Toda la operación es 100% automática y se gestiona
                de forma remota a través de la plataforma en la nube FlightHub
                2, que permite crear, ejecutar y supervisar misiones de vuelo
                complejas, asegurando la calidad y precisión de los datos
                recopilados.
              </>
            }
            images={["img/services/drones/image05.png"]}
            altText="Siempre en funcionamiento"
            layout="text-left"
            className="mt-10 h-full"
            autoSlide={false}
          />
        </div>
      </section>
    </div>
  );
}

export default IoT;
