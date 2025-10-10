import { TbMailFilled, TbPhoneFilled } from "react-icons/tb";
import { useBreakpoints } from "../../../context/ProviderBreakpoints";
import Lastnews from "../../news/components/Lastnews";
import ClientsCarousel from "../../about/components/ClientsCarousel";
import CardNav from "../components/CardNav";
import {
  FadeInSection,
  SlideInLeft,
  SlideInRight,
} from "../../../components/animations";
import { useHomeManagement } from "../../admin/home-management/hooks/useHomeManagement";
import Slider from "../../../components/slider/Slider";

function EditableHome() {
  const { isSmallDevice } = useBreakpoints();
  const { homeData, loading, error } = useHomeManagement();

  // Si está cargando o hay error, mostrar el Home estático
  if (loading || error || !homeData || !homeData.isPublished) {
    // Fallback al Home estático importando dinámicamente
    return null; // Se manejará desde main.tsx
  }

  return (
    <div className="relative overflow-hidden min-w-screen">
      <section
        id="slider"
        className={`relative flex justify-start items-start w-full bg-bg-400
        ${isSmallDevice ? "h-auto" : "py-12 pb-54"}
        `}
      >
        {isSmallDevice ? (
          <div className="relative object-cover border-b-8 border-b-primary-100">
            <img
              src={homeData.heroSection.backgroundImage}
              alt={homeData.heroSection.title}
            />
            <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-bg-400"></div>
            <div className="absolute z-10 pb-30 top-[70%] -translate-y-1/2 left-[50%] transform -translate-x-1/2 p-5 flex flex-col justify-center items-center ">
              <h2 className="text-5xl font-bold text-white ">
                {homeData.heroSection.title}
              </h2>
              <p className="text-white text-center text-balance">
                {homeData.heroSection.description}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="absolute -top-40 -right-20 bg-primary-100 blur-3xl w-125 h-130 rounded-full opacity-40"></div>
            <div className="absolute -bottom-20 -left-20 bg-primary-100 blur-3xl w-130 h-130 rounded-full opacity-30"></div>
            {homeData.sliderSection &&
            homeData.sliderSection.slides &&
            homeData.sliderSection.slides.length > 0 ? (
              <Slider
                slides={homeData.sliderSection.slides}
                autoplay={homeData.sliderSection.autoplay}
                interval={homeData.sliderSection.interval}
              />
            ) : (
              <div className="relative w-full h-96 flex items-center justify-center">
                <img
                  src={homeData.heroSection.backgroundImage}
                  alt={homeData.heroSection.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </>
        )}
      </section>

      {!isSmallDevice && (
        <section id="cardNav" className="relative h-20 ">
          <div
            className="absolute left-0 -top-20 w-full h-90 bg-white-100 "
            style={{
              clipPath: "ellipse(100% 100% at 50% 100%)",
            }}
          ></div>
          <div className="container mx-auto relative z-10 -top-35">
            <CardNav />
          </div>
        </section>
      )}

      <section id="wiseIA" className="relative min-w-screen">
        {/* <FadeInSection>
          <div
            className={`container mx-auto flex flex-col gap-4 text-center ${
              isSmallDevice ? "py-12" : "py-24"
            }`}
          >
            <h2 className="text-5xl font-bold">{homeData.iaSection.title}</h2>
            <p className="text-lg text-balance">
              {homeData.iaSection.description}
            </p>
          </div>
        </FadeInSection> */}

        <div
          className={`max-w-7xl mx-auto  ${
            isSmallDevice
              ? "flex flex-col items-center justify-between gap-8"
              : "grid grid-cols-2 gap-20"
          }  `}
        >
          <SlideInLeft>
            <div className="flex items-center justify-center flex-1">
              <img
                src={homeData.iaSection.image}
                alt={homeData.iaSection.title}
                className={`${
                  isSmallDevice ? "w-full" : "w-150"
                } object-cover rounded-lg shadow-lg`}
              />
            </div>
          </SlideInLeft>

          <SlideInRight>
            <div className="flex-1 flex flex-col gap-8 justify-evenly h-full">
              <div className="flex flex-col gap-4 h-full">
                <h3 className="text-3xl font-bold text-primary-100">
                  {homeData.iaSection.title}
                </h3>
                <p className="text-xl text-balance">
                  {homeData.iaSection.description}
                </p>
              </div>
              {homeData.iaSection.buttonLink && (
                <a
                  href={homeData.iaSection.buttonLink}
                  className="bg-primary-100 text-white-100 px-10 py-2 rounded-lg hover:bg-primary-200 transition-colors duration-300 w-fit"
                >
                  {homeData.iaSection.buttonText || "Ver más"}
                </a>
              )}
            </div>
          </SlideInRight>
        </div>

        <FadeInSection>
          <div
            className={`container mx-auto flex flex-col gap-4 text-center ${
              isSmallDevice ? "py-12" : "py-24"
            }`}
          >
            <h2 className="text-5xl font-bold">
              {homeData.videoSection.title}
            </h2>
            {homeData.videoSection.description && (
              <p className="text-lg text-balance">
                {homeData.videoSection.description}
              </p>
            )}
            <div className="flex justify-center items-center">
              <iframe
                className={`${
                  isSmallDevice ? "w-full h-64" : "w-200 h-100"
                } rounded-lg shadow-lg`}
                src={homeData.videoSection.videoUrl}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </FadeInSection>
      </section>

      <section id="clients" className="relative min-w-screen ">
        <FadeInSection>
          <div
            className={` mx-auto flex flex-col gap-4 text-center ${
              isSmallDevice ? "py-12" : "py-24"
            }`}
          >
            <h2 className="text-5xl font-bold text-white-100">
              Nuestros Clientes
            </h2>
            <p className="text-lg text-white-100 text-balance">
              Conoce a nuestros clientes y descubre cómo les hemos ayudado a
              alcanzar sus objetivos.
            </p>
            <ClientsCarousel />
          </div>
        </FadeInSection>
      </section>

      <section id="news" className="relative bg-primary-100">
        <FadeInSection>
          <div
            className={`container mx-auto flex flex-col gap-4 text-center ${
              isSmallDevice ? "py-12" : "py-24"
            }`}
          >
            <Lastnews />
          </div>
        </FadeInSection>
      </section>

      <section
        id="contacto"
        className={`relative  text-bg-400 ${isSmallDevice ? "py-12" : "py-24"}`}
      >
        <FadeInSection>
          <div className="container mx-auto flex flex-col gap-4 text-center">
            <h2 className="text-5xl font-bold">
              {homeData.contactSection.title}
            </h2>
            <p className="text-lg text-balance">
              Si tienes alguna pregunta, no dudes en contactarnos.
            </p>
            <div
              className={`flex ${
                isSmallDevice ? "flex-col" : "flex-row"
              } gap-8 justify-center items-center mt-8`}
            >
              <div className="flex items-center gap-4">
                <TbPhoneFilled className="text-4xl" />
                <div className="flex flex-col items-start">
                  <span className="text-lg font-bold">Teléfono</span>
                  <span className="text-sm">
                    {homeData.contactSection.contactInfo.phone1}
                  </span>
                  {homeData.contactSection.contactInfo.phone2 && (
                    <span className="text-sm">
                      {homeData.contactSection.contactInfo.phone2}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <TbMailFilled className="text-4xl" />
                <div className="flex flex-col items-start">
                  <span className="text-lg font-bold">Email</span>
                  <span className="text-sm">
                    {homeData.contactSection.contactInfo.email}
                  </span>
                </div>
              </div>
            </div>
            {homeData.contactSection.contactInfo.schedule && (
              <p className="text-sm mt-4">
                {homeData.contactSection.contactInfo.schedule}
              </p>
            )}
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}

export default EditableHome;
