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
import { SlEnvolope, SlPhone } from "react-icons/sl";

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
        ${isSmallDevice ? "h-auto " : "py-12 pb-54"}
        `}
      >
        {isSmallDevice ? (
          <div className="relative object-cover border-b-8 border-b-primary-100">
            <img
              src={homeData.heroSection.backgroundImage}
              alt={homeData.heroSection.title}
            />
            <div className="absolute bottom-0 left-0 h-1/2 w-full bg-gradient-to-t from-bg-400"></div>
            <div className="absolute z-10 w-full pb-30 top-[50%] -translate-y-1/2 left-[50%] transform -translate-x-1/2 p-5 flex flex-col justify-center items-center ">
              <h2 className="text-2xl font-bold text-white ">
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
        <div
          className={` ${
            isSmallDevice
              ? "flex flex-col items-center justify-between gap-8 w-100 mx-auto mt-10"
              : "grid grid-cols-2 gap-20 max-w-7xl mx-auto "
          }  `}
        >
          <SlideInLeft>
            <div className="flex items-center justify-center flex-1">
              <img
                src={homeData.iaSection.image}
                alt={homeData.iaSection.title}
                className={`${
                  isSmallDevice ? "w-full" : "w-150"
                } object-cover rounded-2xl shadow-lg`}
              />
            </div>
          </SlideInLeft>

          <SlideInRight>
            <div className="flex-1 flex flex-col gap-8 justify-evenly h-full">
              <div className="flex flex-col gap-4 h-full">
                <h2 className="text-4xl font-bold text-primary-100">
                  {homeData.iaSection.title}
                </h2>
                <p className="text-xl text-balance">
                  {homeData.iaSection.description}
                </p>
              </div>
              <div className="flex justify-center items-center">
                {homeData.iaSection.buttonLink && (
                  <a
                    href={homeData.iaSection.buttonLink}
                    className="border border-primary-100 text-primary-100 px-10 py-2 rounded-lg hover:bg-primary-100/90 hover:text-white transition-colors duration-300 w-full flex justify-center items-center"
                  >
                    {homeData.iaSection.buttonText || "Ver más"}
                  </a>
                )}
              </div>
            </div>
          </SlideInRight>
        </div>

        <FadeInSection>
          <div
            className={`max-w-7xl mx-auto flex flex-col gap-4 text-center  rounded-2xl ${
              isSmallDevice ? " w-100 mt-10" : "  my-20"
            }`}
          >
            <h2 className="text-4xl font-bold text-primary-100">
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
                  isSmallDevice ? "w-full h-64" : "w-full h-150"
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
      <section id="news" className="relative bg-primary-100">
        <FadeInSection>
          <div
            className={` text-center ${
              isSmallDevice ? "py-12 w-100 px-5 my-5" : "py-24 max-w-7xl mx-auto flex flex-col"
            }`}
          >
            <Lastnews />
          </div>
        </FadeInSection>
      </section>

      <section id="clients" className="relative min-w-screen  ">
        <FadeInSection>
          <div
            className={` mx-auto flex flex-col gap-4 text-center ${
              isSmallDevice ? "py-12 w-100 " : "py-24"
            }`}
          >
            <ClientsCarousel />
          </div>
        </FadeInSection>
      </section>

      <section
        id="contacto"
        className={`relative  text-bg-400 ${isSmallDevice ? "py-12" : "py-24"}`}
      >
        <div
          className="absolute left-0 -bottom-0 w-full h-120"
          style={{
            backgroundColor: "#ff3030",
            clipPath: "ellipse(100% 100% at 50% 100%)",
          }}
        ></div>
        <FadeInSection>
          <div
            className={`  rounded-2xl py-10 mx-auto flex flex-col gap-4 text-center bg-white
          ${isSmallDevice ? "w-100 max-w-3xl" : "max-w-7xl"}
          `}
          >
            <h2 className="text-4xl font-bold text-primary-100">
              {homeData.contactSection.title}
            </h2>
            <div
              className={` ${
                isSmallDevice ? "flex flex-col" : "grid grid-cols-2"
              } gap-8 justify-center items-center mt-8 w-full p-5 h-80`}
            >
              <div className="flex items-center flex-col justify-center gap-6 bg-white-100  rounded-2xl h-full py-5 w-full">
                <SlPhone className="text-7xl text-primary-100" />
                <div className="flex flex-col items-start">
                  <p className="text-balance text-center">
                    Llámenos al{" "}
                    <span className="text-primary-100">
                      {homeData.contactSection.contactInfo.phone1}
                    </span>{" "}
                    ||{" "}
                    {homeData.contactSection.contactInfo.phone2 && (
                      <span className="text-primary-100">
                        {homeData.contactSection.contactInfo.phone2}
                      </span>
                    )}
                    . Nuestros expertos estan preparados para aclarar sus dudas.
                  </p>
                </div>
              </div>
              <div className="flex items-center flex-col justify-center gap-6 bg-white-100  rounded-2xl h-full py-5 w-full">
                <SlEnvolope className="text-7xl text-primary-100" />
                <div className="flex flex-col items-start">
                  <p className="text-balance text-center">
                    Puede contactarse con nosotros en nuestro email{" "}
                    <span className="text-primary-100">
                      {homeData.contactSection.contactInfo.email}
                    </span>
                    . Nuestros expertos le proporcionaran mas información
                    detallada.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              {homeData.contactSection.contactInfo.schedule && (
                <p className="text-sm mt-4 bg-white rounded-2xl px-10 py-2 text-bg-300 shadow-xl">
                  {homeData.contactSection.contactInfo.schedule}
                </p>
              )}
            </div>
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}

export default EditableHome;
