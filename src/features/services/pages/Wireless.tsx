import ContentSection from "../../../components/content/ContentSection";
import HeroSection from "../../../components/hero/HeroSection";

function Wireless() {
  return (
    <div className="w-full min-h-screen">
      <HeroSection
        title="Wireless"
        description="AST se dedica a romper las barreras físicas mediante la provisión de redes inalámbricas a la industria acuicultora en las regiones X y XI. Brindan acceso a internet de alta velocidad en zonas aisladas y remotas, y pueden ampliar redes privadas existentes. La empresa también ofrece la integración de diversas tecnologías como conexión satelital, telefonía IP y televigilancia, adaptándose a las necesidades de sus clientes."
        buttonText="Ver video"
        buttonLink="#"
        images={[
          "img/services/wireless/image01.png",
          "img/services/wireless/image02.png",
          "img/services/wireless/image03.png",
    
        ]}
        altText="Wireless"
        onButtonClick={() => {
          console.log("Ver video clicked");
        }}
      />
      <section className="w-full bg-primary-100 py-2 h-28 flex justify-center items-center">
        <div className=" flex justify-center items-center">
          <img src="AST-Logo-white.png" alt="AST Logo" className="h-20" />
          <div className="h-10 w-0.5 bg-white mx-10"></div>
          <h4 className="font-black text-3xl">SATELITAL</h4>
        </div>
      </section>
      <section className="max-w-7xl mx-auto w-full py-10">
        <div className="flex flex-col gap-10 justify-center items-center w-full">
          <ContentSection
            title="Romper las barreras físicas"
            description={
              <>
                AST provee de soluciones de conectividad basadas en redes
                inalámbricas operando en estándares 802.11abgn-Airmax, esto en
                la industria acuicultora que operan tanto en la región X como en
                la XI. Damos cobertura a una extensa área geográfica en zonas
                costeras remotas que no pueden ser atendidas por ISP
                convencionales. Contamos con una gran infraestructura, con
                enlaces funcionando hasta más de 10 años en forma continua,
                monitoreados y bajo permanente renovación tecnológica para
                adaptarse a los estándares de comunicación actuales.
              </>
            }
            images={["img/services/wireless/image02.png"]}
            altText="Equipamiento"
            layout="text-left"
            className="mt-10 h-full"
            autoSlide={false}
          />

          <ContentSection
            title=""
            description={
              <>
                Asistimos a nuestros clientes de diversas formas, ya sea
                ampliamos redes privadas o entregando acceso a Internet de alta
                velocidad en zonas aisladas, generando según sea requerido,
                soluciones integradas de redes inalámbricas, conexión satelital,
                telefonía IP, televigilancia, etc. De esta manera la
                versatilidad de las conexiones inalámbricas nos ha permitido
                establecer enlaces, por ejemplo, para combinar conexiones
                SatLink autónomas en tierra que se comunican vÌa WiFi con
                instalaciones flotantes de insuficiente estabilidad para
                soportar una antena satelital. Nuestra gran experiencia nos da
                la confianza de proveer comunicaciones bajo cualquier condición
                o distancia.
              </>
            }
            images={["img/services/wireless/image03.png"]}
            altText="wireless"
            layout="text-right"
            className="mt-10 h-full"
            autoSlide={false}
          />
        </div>
      </section>
      <section className="relative h-100 mt-50">
        <div
          className="absolute left-0 -top-0  w-full h-100  bg-bg-400 "
          style={{
            clipPath: "ellipse(100% 100% at 50% 100%)",
          }}
        ></div>
        <div className="relative -top-30 z-10 w-full max-w-6xl mx-auto h-full flex flex-col justify-center items-center text-center text-white px-5">
          <div className="flex justify-center items-center gap-10 w-full py-10 text-black">
            <article className="relative shadow-lg bg-white rounded-2xl   w-full  mb-4 flex flex-col justify-center items-center gap-5 py-20">
              <img
                src="/public/svg/services/satelital/cell_tower.svg"
                alt="Starlink Conexión"
                className="absolute -top-18 w-30 h-30"
              />
              <p className="max-w-4xl text-lg leading-6">
                A medida las redes inalámbricas se propagan y popularizan, el
                medio se satura, para esto AST constantemente debe monitoriar y
                renovar tecnología para mantener su calidad de servicio.
                Extendemos redes a alta velocidad en en las portadoras
                inalámbricas, obteniendo tasas de transferencia de hasta 800
                mbps. Bajo este esquema podemos ofrecer tanto priorización de
                voz o video como incluso filtrado de paquetes de datos, si
                llegara a ser requerido para proteger sus redes de abusos.
                Podemos comunicar puntos muy remotos con calidad equivalente una
                red cableada estándar, soportando entre otros conexión a VPN,
                priorización de códecs a criterio del cliente e incluso acceso a
                Internet banda ancha en zonas remotas sin factibilidad técnica
                para ISP convencionales.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Wireless;
