import ContentSection from "../../../components/content/ContentSection";
import HeroSection from "../../../components/hero/HeroSection";

function Satelital() {
  return (
    <div className="w-full min-h-screen">
      <HeroSection
        title="Satelital"
        description="En la actualidad, la oferta de conexión a Internet vía satélite ha crecido de forma exponencial. AST, comprometida en entregar soluciones de calidad a la industria y a los sectores más exigentes, utiliza la red satelital Starlink para llevar Internet de alta velocidad y baja latencia a cualquier lugar, incluso en entornos donde otras tecnologías no llegan."
        buttonText="Ver video"
        buttonLink="#"
        images={[
          "img/services/satelital/image01.jpg",
          "img/services/satelital/image02.jpg",
          "img/services/satelital/image03.jpg",
          "img/services/satelital/image04.jpg",
          "img/services/satelital/image05.jpg",
        ]}
        altText="Satelital"
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
            title="Internet Satelital"
            description={
              <>
                En condiciones extremas o de difícil acceso, el servicio de
                Internet satelital es el último eslabón de las comunicaciones.
                En AST entendemos la responsabilidad que esto implica, y por
                ello nuestro compromiso es entregar siempre una respuesta rápida
                y eficaz ante cualquier incidencia, sello que nos distingue en
                la industria. Antes de llegar a su empresa, la conexión pasa por
                la infraestructura de AST, donde aplicamos protocolos de
                seguridad, redes privadas (VPN) y monitoreo especializado. De
                esta manera, su organización recibe una conexión rápida, segura
                y confiable, adaptada a los requerimientos de cada operación.
              </>
            }
            images={["img/services/satelital/image04.jpg"]}
            altText="Equipamiento"
            layout="text-right"
            className="mt-10 h-full"
            autoSlide={false}
          />

          <div>
            <img
              src="/public/svg/services/satelital/starlink.svg"
              alt="Starlink Conexión"
            />
          </div>

          <ContentSection
            title="Starlink"
            description={
              <>
                Starlink marca un cambio de paradigma frente a los satélites
                geoestacionarios tradicionales. Mientras que estos últimos
                orbitan a más de 36.000 km de la Tierra, los satélites Starlink
                operan a apenas 550 km de altura. Esta diferencia permite
                reducir la latencia de más de 600 ms a valores entre 25 y 60 ms,
                acercando la experiencia a la de una red terrestre de fibra
                óptica. Actualmente, la red está conformada por más de 8.000
                satélites en operación, cifra que aumenta de manera constante,
                lo que asegura una cobertura prácticamente global y creciente
                estabilidad del servicio.
              </>
            }
            images={["img/services/satelital/image02.jpg"]}
            altText="Equipamiento"
            layout="text-left"
            className="mt-10 h-full"
            autoSlide={false}
          />

          <div>
            <img
              src="/public/svg/services/satelital/rendimiento.svg"
              alt="Starlink Conexión"
            />
          </div>
          <ContentSection
            title="En Constante Evolución"
            description={
              <>
                Durante años, AST entregó conectividad satelital a través de
                sistemas geoestacionarios como Hispasat e Inmarsat, que
                mantuvieron comunicadas a zonas remotas y operaciones marítimas,
                aunque con limitaciones de velocidad y alta latencia propias de
                esa tecnología. Con la llegada de Starlink, dimos un paso
                decisivo en nuestra historia: pasamos de conexiones básicas a
                servicios de alta velocidad, baja latencia y cobertura global,
                reafirmando nuestro compromiso de mantenernos siempre a la
                vanguardia e integrar las últimas tecnologías al servicio de la
                industria.
              </>
            }
            images={["img/services/satelital/image05.jpg"]}
            altText="Equipamiento"
            layout="text-right"
            className="mt-10 h-full"
            autoSlide={false}
          />
        </div>
      </section>
      <section className="relative h-130 mt-50">
        <div
          className="absolute left-0 -top-0  w-full h-130  bg-bg-400 "
          style={{
            clipPath: "ellipse(100% 100% at 50% 100%)",
          }}
        ></div>
        <div className="relative -top-30 z-10 w-full max-w-6xl mx-auto h-full flex flex-col justify-center items-center text-center text-white px-5">
          <div className="flex justify-center items-center gap-10 w-full py-10 text-black">
            <article className="relative shadow-lg bg-white rounded-2xl h-160 w-full  mb-4 flex flex-col justify-center items-center gap-5 p-10">
              <h3 className="font-black text-5xl">
                Conéctate donde otros no llegan
              </h3>
              <img
                src="/public/svg/services/satelital/world.svg"
                alt="Starlink Conexión"
                className="w-100 h-100"
              />
              <p className="max-w-2xl">
                En condiciones muy aisladas el servicio de Internet por satélite
                es el ultimo eslabón de las comunicaciones, por lo mismo sabemos
                que este es critico y vital su disponibilidad. AST entiende esta
                responsabilidad y confianza, por esto que nuestro compromiso ha
                sido siempre de disponer de una respuesta rápida y eficaz frente
                a toda incidencia, sello que nos ha distinguido en la industria.
              </p>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Satelital;
