import ContentSection from "../../../components/content/ContentSection";
import ImageGallery from "../../../components/gallery/ImageGallery";
import HeroSection from "../../../components/hero/HeroSection";

function NetworkIp() {
  return (
    <div className="w-full min-h-screen">
      <HeroSection
        title="Network IP"
        description="Ofrecemos soluciones integrales de seguridad y tele-vigilancia, adaptadas a cada entorno productivo y bajo los más altos estándares de calidad. Desde cámaras ópticas, térmicas e infrarrojas hasta sistemas de radar IP y monitoreo remoto, integramos tecnología avanzada para garantizar control, confiabilidad y protección en cualquier condición, incluso en los entornos más exigentes."
        buttonText="Ver video"
        buttonLink="#"
        images={[
          "img/services/seguridad/hero.png",
          "img/services/seguridad/cam.png",
          "img/services/seguridad/cam2.png",
          "img/services/seguridad/cam3.png",
        ]}
        altText="Network IP"
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
            title="Servicios IP"
            description={
              <>
                Nuestra compañía en su experiencia ha realizado análisis de
                múltiples tecnologías de telecomunicaciones concentrando su
                atención en las líneas inalámbricas, routes y telefonía IP, cada
                una de estas ramas provee una enormidad de soluciones, sin
                embargo nos hemos concentrado y detenido en aquellos equipos que
                han demostrado poseer una muy alta ventaja en relación
                costo/beneficio.
              </>
            }
            images={["img/services/satelital/image04.jpg"]}
            altText="Equipamiento"
            layout="text-left"
            className="mt-10 h-full"
            autoSlide={false}
          />

          <ContentSection
            title=""
            description={
              <>
                Entregamos soporte a asesoría en soluciones de telefonía IP, con
                centrales y variados teléfonos en base a software Asterisk con
                equipamiento sobre protocolo SIP Voip. Para control y trafico de
                data, nos hemos especializado en el uso de Routerboards, equipos
                de gran potencia y multiproposito, sin con esto signifique
                elevados costos. A la hora de definir o mejorar su plataforma de
                comunicaciones y telefonía, AST podrá su total apoyo en
                asesorarlo en su decisión.
              </>
            }
            images={["img/services/satelital/image02.jpg"]}
            altText="Equipamiento"
            layout="text-right"
            className="mt-10 h-full"
            autoSlide={false}
          />
        </div>
      </section>
      <section className="relative mt-40">
        <div
          className="absolute left-0 -top-20  w-full h-150  bg-bg-400 "
          style={{
            clipPath: "ellipse(100% 100% at 50% 100%)",
          }}
        ></div>
        <div className="relative bg-bg-400 z-10 w-full  h-full flex flex-col justify-start items-center text-center text-white px-5">
          <div className="max-w-7xl mx-auto w-full">
            <nav className="rounded-full overflow-hidden flex justify-center items-center border border-white/20  max-w-2xl mx-auto ">
              <ul className="flex flex-row justify-center items-center bg-primary-100">
                <li className="py-5 px-15">
                  <a href="#equipamiento" className="text-2xl font-bold">
                    Equipamiento de red
                  </a>
                </li>
                <li className="py-5 px-15 bg-bg-300">
                  <a href="#servicio" className="text-2xl font-bold">
                    Servicio de instalación
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="max-w-7xl mx-auto w-full py-10 flex flex-col gap-10 ">
            <div id="equipamiento">
              <ImageGallery
                images={[
                  "img/services/seguridad/cam3.png",
                  "img/services/seguridad/cam.png",
                  "img/services/seguridad/cam2.png",
                  "img/services/seguridad/hero.png",
                ]}
                title="Equipamiento de Red"
                description="Routing, QoS, VPN, VLAN, WiFi, NAT, Firewall, entre otros son los tantos servicios que a diario debemos confiar en nuestro equipamiento de red, frente a esto y a la cada vez superior demanda de procesos, confíe en soluciones Routerboard la mejor ecuación costo/beneficio, estamos para apoyarlo."
                buttonText="Solicitar"
                altText="Equipamiento de Red"
                onButtonClick={() => {
                  console.log("Solicitar Equipamiento de Red");
                }}
              />
            </div>
            <div id="servicio">
              <ImageGallery
                images={[
                  "img/services/seguridad/cam3.png",
                  "img/services/seguridad/cam.png",
                  "img/services/seguridad/cam2.png",
                  "img/services/seguridad/hero.png",
                ]}
                title="Servicios de Instalación"
                description="Para sus proyectos de implementación telefonía IP, video seguridad, troncales de Fibra Optica o enrutamiento, tenemos el mejor equipo de profesionales para ayudarle siempre con el mejor estándar de servicio y calidad."
                buttonText="Solicitar"
                altText="Servicios de Instalación"
                onButtonClick={() => {
                  console.log("Solicitar Servicios de Instalación");
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default NetworkIp;
