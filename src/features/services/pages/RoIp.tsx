import ContentSection from "../../../components/content/ContentSection";
import HeroSection from "../../../components/hero/HeroSection";

function RoIp() {
  return (
    <div className="w-full min-h-screen">
      <HeroSection
        title="RoIP"
        description="Ofrecemos una administración integral para industrias como la construcción, seguridad y energía a través de drones autónomos. Integramos tecnología de vanguardia con una estación de acoplamiento (DOCK) robusta y automatizada que permite optimizar las operaciones diarias, mejorar la seguridad y garantizar una supervisión continua y eficiente 24/7."
        buttonText="Ver video"
        buttonLink="#"
        images={["img/services/drones/image01.png"]}
        altText="RoIP"
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
            title="Aplicaciones"
            description={
              <>
                Los Drones se centran en la inspección y mantenimiento de
                infraestructuras críticas. Se utilizan para la revisión
                detallada de líneas de alta tensión, permitiendo verificar el
                estado de componentes como aisladores para prevenir fallos y
                asegurar el correcto funcionamiento de la red eléctrica. De
                manera similar, se emplean para la inspección de equipo
                industrial y maquinaria pesada, donde se puede monitorear la
                temperatura y operación de los activos, reduciendo
                significativamente los riesgos asociados al trabajo humano en
                altura o con elementos peligrosos.
              </>
            }
            images={["img/services/drones/image02.png"]}
            altText="Aplicaciones"
            layout="text-right"
            className="mt-10 h-full"
            autoSlide={false}
          />
          <div className="w-full grid grid-cols-4 gap-5 h-110">
            <article className="w-full h-full bg-white hover:bg-gradient-to-tl hover:from-amber-100 hover:to-white transition-colors duration-300 rounded-2xl shadow-lg flex flex-col justify-start items-center p-5">
              <img
                draggable={false}
                src="svg/services/drones/bateria.svg"
                alt="bateria"
              />
              <h4 className="font-bold text-xl text-center">
                Batería de Respaldo Integrada
              </h4>
              <p className="text-center mt-5">
                En caso de un corte de energía inesperado, el Dock puede seguir
                funcionando por más de cinco horas con una batería de respaldo,
                dándole tiempo al dron para regresar y aterrizar.
              </p>
            </article>
            <article className="w-full h-full bg-white hover:bg-gradient-to-tl hover:from-amber-100 hover:to-white transition-colors duration-300 rounded-2xl shadow-lg flex flex-col justify-start items-center p-5">
              <img
                draggable={false}
                src="svg/services/drones/alertas.svg"
                alt="Alertas"
              />
              <h4 className="font-bold text-xl text-center">Alertas</h4>
              <p className="text-center mt-5">
                En condiciones anormales, como vientos fuertes o lluvias
                intensas, FlightHub 2 activa automáticamente alertas para
                proteger la misión y el equipo.
              </p>
            </article>
            <article className="w-full h-full bg-white hover:bg-gradient-to-tl hover:from-amber-100 hover:to-white transition-colors duration-300 rounded-2xl shadow-lg flex flex-col justify-start items-center p-5">
              <img
                draggable={false}
                src="svg/services/drones/rutas.svg"
                alt="Planificación de Rutas"
              />
              <h4 className="font-bold text-xl text-center">
                Planificación de Rutas
              </h4>
              <p className="text-center mt-5">
                Es posible crear misiones de vuelo directamente desde una
                computadora remota y obtener una vista previa de los resultados
                para asegurar la seguridad de la ruta.
              </p>
            </article>
            <article className="w-full h-full bg-white hover:bg-gradient-to-tl hover:from-amber-100 hover:to-white transition-colors duration-300 rounded-2xl shadow-lg flex flex-col justify-start items-center p-5">
              <img
                draggable={false}
                src="svg/services/drones/nave.svg"
                alt="Despegue Rápido"
              />
              <h4 className="font-bold text-xl text-center">Despegue Rápido</h4>
              <p className="text-center mt-5">
                El sistema integra antenas duales RTK para una ubicación precisa
                y puede realizar una inspección completa de la hélice y despegar
                en solo 45 segundos.
              </p>
            </article>
          </div>

          <ContentSection
            title="Seguridad"
            description={
              <>
                Los drones ofrecen una solución robusta para la vigilancia
                perimetral 24/7. Al integrarse con sistemas de radar, pueden
                responder de forma automática e inmediata a las alertas de
                intrusión, cubriendo tramos extensos y permitiendo una rápida
                respuesta ante actividades sospechosas. Esta automatización
                evita la necesidad de patrullajes humanos en zonas de conflicto
                o de alto riesgo, garantizando una protección continua y
                eficiente.
              </>
            }
            images={["img/services/drones/image03.png"]}
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

export default RoIp;
