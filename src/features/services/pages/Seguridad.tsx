import ImageGallery from "../../../components/gallery/ImageGallery";
import HeroSection from "../../../components/hero/HeroSection";

function Seguridad() {
  return (
    <div className="w-full min-h-screen">
      <HeroSection
        title="Seguridad"
        description="Ofrecemos soluciones integrales de seguridad y tele-vigilancia, adaptadas a cada entorno productivo y bajo los más altos estándares de calidad. Desde cámaras ópticas, térmicas e infrarrojas hasta sistemas de radar IP y monitoreo remoto, integramos tecnología avanzada para garantizar control, confiabilidad y protección en cualquier condición, incluso en los entornos más exigentes."
        buttonText="Ver video"
        buttonLink="#"
        images={[
          "img/services/seguridad/hero.png",
          "img/services/seguridad/cam.png",
          "img/services/seguridad/cam2.png",
          "img/services/seguridad/cam3.png",
        ]}
        altText="Seguridad"
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
      <section className="max-w-7xl mx-auto w-full py-10 ">
        <div className="flex flex-col justify-center items-center w-full ">
          <h2 className="text-4xl font-bold ">Seguridad</h2>
          <div className="grid grid-cols-2 gap-8 mt-10 h-full">
            <div className="flex flex-col justify-center items-start gap-5">
              <h4 className="text-3xl font-black">Estar presente</h4>
              <p className="text-lg font-semibold leading-6">
                No hay duda que su capital está mayoritariamente bajo el agua,
                pero no por ello podemos descuidar lo que pasa sobre ella. Por
                eso nuestros sistemas integrados de tele vigilancia ya operan en
                centros de engorda en agua mar, tanto desde tierra como en
                pontones flotantes, también en pisciculturas, embarcaciones de
                transporte, plantas de proceso y oficinas. Y nuestros esfuerzo
                en investigación y desarrollo no termina ahí, por lo que ya
                estamos integrando soluciones para cubrir otros eslabones de la
                cadena productiva.
              </p>
            </div>
            <div className="w-full h-full">
              <img
                draggable={false}
                src={"img/services/seguridad/cam.png"}
                alt={"Servicios"}
                className="w-full h-90 object-cover aspect-square rounded-2xl  "
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-10 h-full">
          <div className="w-full h-full overflow-hidden rounded-2xl">
            <img
              draggable={false}
              src={"img/services/seguridad/cam2.png"}
              alt={"Servicios"}
              className="w-full h-90 object-cover aspect-square rounded-2xl scale-110 "
            />
          </div>
          <div className="flex flex-col justify-center items-start gap-5">
            <h4 className="text-3xl font-black">Personalizable</h4>
            <p className="text-lg font-semibold leading-6">
              Nuestra ventaja radica esque somos los únicos capaces de ofrecer
              como único proveedor la solución completa bajo el más elevado
              standar de calidad para cada caso, desde la cámara más adecuada
              para sus requerimientos, pasando por la red que la comunica y
              controla, hasta la conexión satelital o inalámbrica que la publica
              a los puntos finales deseados, sin olvidar grabación, respaldo en
              alta calidad y compresión.
            </p>
          </div>
        </div>
        <div className="relative z-10 flex justify-center items-center gap-5 mt-20">
          <article className="pb-15 max-w-4xl w-full rounded-2xl flex flex-col  justify-center items-center gap-2  bg-white">
            <div className="relative -top-10 w-30 h-20 flex flex-col justify-center items-center">
              <img src={"img/services/seguridad/campana.png"} alt="" />
            </div>
            <div className="flex-1 flex flex-col w-full ">
              <p className="text-lg  leading-6 px-10 text-center">
                Esté donde esté puede recibir alertas instantáneas generadas
                automáticamente como mensaje de texto, y en sólo algunos
                segundos ver directamente qué está pasando a cientos o quizás
                miles de kilómetros de distancia. Al rededor del mundo un
                terminal iPhone®, IPod®, o IPad®, puede marcar la diferencia, y
                no sólo para ver, usted también podrá controlar cada cámara
                activar zoom y movimiento e incluso grabar secuencia de video
                sobre la marcha para no perder ningún detalle de acción.
              </p>
            </div>
          </article>
        </div>
      </section>
      <section className="relative ">
        <div
          className="absolute left-0 -top-50  w-full h-150  bg-bg-400 "
          style={{
            clipPath: "ellipse(100% 100% at 50% 100%)",
          }}
        ></div>
        <div className="relative bg-bg-400 z-10 w-full  h-full flex flex-col justify-start items-center text-center text-white px-5">
          <div className="max-w-7xl mx-auto w-full">
            <nav className="rounded-full overflow-hidden flex justify-center items-center border border-white/20  max-w-6xl mx-auto ">
              <ul className="flex flex-row justify-center items-center bg-primary-100">
                <li className="py-5 px-15">
                  <a href="#sistema" className="text-2xl font-bold">
                    Sistema de iluminación IR
                  </a>
                </li>
                <li className="py-5 px-15 bg-bg-300">
                  <a href="#camaras" className="text-2xl font-bold">
                    Vigilancia Remota Termal
                  </a>
                </li>
                <li className="py-5 px-15">
                  <a href="#vigilancia" className="text-2xl font-bold">
                    Vigilancia Radar IP
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <div className="max-w-7xl mx-auto w-full py-10 flex flex-col gap-10 ">
            <div id="sistema">
              <ImageGallery
                images={[
                  "img/services/seguridad/cam3.png",
                  "img/services/seguridad/cam.png",
                  "img/services/seguridad/cam2.png",
                  "img/services/seguridad/hero.png",
                ]}
                title="Sistema de Iluminación IR"
                description="De la serie RAYMAX diseñado específicamente para aplicaciones de larga distancia, ofrecen una excelente imagen de noche con una mejor salida óptica y sobresaliente fiabilidad. Los focos proporcionan un rendimiento de clase mundial, una larga vida y cero mantenimiento. Nuestros focos de iluminación pueden ser aplicados para todo tipo de condición en instalaciones de cero luz de hasta 1.000 metros. (3.280 pies). Este sistema de Iluminación, más cámaras de alta sensibilidad Infrarroja, son el conjunto perfecto en condiciones de plena oscuridad, logrando imágenes en HD en el proceso de identificación de amenazas"
                buttonText="Solicitar"
                altText="Sistema de Iluminación IR"
                onButtonClick={() => {
                  console.log("Solicitar Sistema de Iluminación IR");
                }}
              />
            </div>
            <div id="camaras">
              <ImageGallery
                images={[
                  "img/services/seguridad/cam3.png",
                  "img/services/seguridad/cam.png",
                  "img/services/seguridad/cam2.png",
                  "img/services/seguridad/hero.png",
                ]}
                title="Vigilancia Remota Termal"
                description="Porque la seguridad puede ser llevada aun a peores condiciones que superan otras tecnologías como es ausencia de iluminación, clima adverso o largas distancias, para estas situaciones hemos implantado soluciones de imagen Termal, que pueden detectar actividad bajo toda condición.
                Nuestra tecnología consiste en utilización de cámaras Duales (Óptico Termales), que nos dan capacidad de visión en 360º tanto de día como noche."
                buttonText="Solicitar"
                buttonViewMore="Ver más"
                altText="Vigilancia Remota Termal"
                onButtonClick={() => {
                  console.log("Solicitar Vigilancia Remota Termal");
                }}
                onButtonClickViewMore={() => {
                  console.log("Ver más Vigilancia Remota Termal");
                }}
              />
            </div>
            <div id="vigilancia">
              <ImageGallery
                images={[
                  "img/services/seguridad/cam3.png",
                  "img/services/seguridad/cam.png",
                  "img/services/seguridad/cam2.png",
                  "img/services/seguridad/hero.png",
                ]}
                title="Vigilancia Radar IP"
                description="AST incorpora el radar SpotterRF, líder en detección compacta de largo alcance, capaz de operar en condiciones adversas como oscuridad o mal clima. Cubre áreas desde 3 hasta más de 233 acres, superando la vigilancia tradicional en perímetros.
                Junto con los servidores NetworkedIO y cámaras PTZ, ofrece una solución de seguridad inteligente, eficiente y automatizada. Con solo 1 kg de peso, 10W de consumo y 15Kbps de ancho de banda, es ideal para zonas con limitaciones energéticas o de conectividad.
                Aplicable en sectores comerciales y militares, como subestaciones, oleoductos, costas y zonas sensibles."
                buttonText="Solicitar"
                buttonViewMore="Ver más"
                altText="Vigilancia Radar IP"
                onButtonClick={() => {
                  console.log("Solicitar Vigilancia Radar IP");
                }}
                onButtonClickViewMore={() => {
                  console.log("Ver más Vigilancia Radar IP");
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Seguridad;
