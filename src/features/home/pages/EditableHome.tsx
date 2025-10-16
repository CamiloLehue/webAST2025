import { useEffect } from "react";
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
import { notifyContentReady } from "../../../utils/contentLoadingEvents";

function EditableHome() {
  const { isSmallDevice } = useBreakpoints();
  const { homeData, loading, error } = useHomeManagement();

  useEffect(() => {
    if (!loading && homeData && homeData.isPublished) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          notifyContentReady();
        });
      });
    }
  }, [loading, homeData]);

  if (loading) {
    return null;
  }

  // Si hay error o no hay datos o no está publicado, mostrar el Home estático
  if (error || !homeData || !homeData.isPublished) {
    return null;
  }

  return (
    <div
      className="relative overflow-hidden min-w-screen"
      data-content-ready="true"
    >
      <section
        id="slider"
        className={`relative flex justify-start items-start w-full bg-bg-400
        ${isSmallDevice ? "h-auto " : "py-12 pb-54 min-h-[825px]"}
        `}
      >
        {isSmallDevice ? (
          <div className="relative object-cover border-b-8 border-b-primary-100">
            <img
              src={homeData.heroSection.backgroundImage}
              alt={homeData.heroSection.title}
              data-critical="true"
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
        <section id="cardNav" className="relative h-20  ">
          <div
            className="absolute left-0 -top-20 w-full h-90 bg-white-100 "
            style={{
              clipPath: "ellipse(100% 100% at 50% 100%)",
            }}
          ></div>
          <div className="container mx-auto relative z-10 -top-30">
            <CardNav />
          </div>
        </section>
      )}

      <section id="wiseIA" className="relative min-w-screen bg-white-100  py-5">
        <div
          className={` ${
            isSmallDevice
              ? "flex flex-col items-center justify-center  w-100 mx-auto mt-10 px-5"
              : "grid grid-cols-2  max-w-7xl mx-auto border border-dashed border-zinc-300 p-1 "
          }  `}
        >
          <SlideInLeft>
            <div className="group flex items-center justify-center flex-1  overflow-hidden">
              <img
                src={homeData.iaSection.image}
                alt={homeData.iaSection.title}
                className={`${
                  isSmallDevice ? "w-full" : "w-150  h-full"
                } object-cover scale-120  shadow-lg group-hover:scale-110 transition-all duration-300`}
              />
            </div>
          </SlideInLeft>

          <SlideInRight>
            <div className="relative flex-1 flex flex-col h-full bg-white  p-5">
              <div className="absolute right-10 top-20 h-30 w-20 rounded-full blur-3xl  bg-gradient-to-br from-primary-100/60 to-white"></div>
              <div className="absolute left-10 bottom-20 h-50 w-50 rounded-full blur-3xl  bg-gradient-to-br from-purple-400/40 to-white"></div>
              <div className="relative flex flex-col items-start gap-4 border-b border-bg-300/10 pb-2">
                <h2 className="text-4xl font-bold text-primary-100 bg-white-100 rounded-xl py-2 px-4">
                  {homeData.iaSection.title}
                </h2>
              </div>
              <div className="relative h-full p-5 ">
                <p className="text-lg text-balance font-light">
                  {homeData.iaSection.description}
                </p>
              </div>
              <div className="relative flex justify-center items-center">
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
            className={`max-w-7xl mx-auto flex flex-col items-center gap-4 text-center  rounded-2xl ${
              isSmallDevice ? "w-100 mt-10 p-5" : "  mt-5"
            }`}
          >
            <div className="bg-white px-5 py-2 my-5 rounded-xl">
              <h2 className="text-4xl font-bold text-primary-100">
                {homeData.videoSection.title}
              </h2>
            </div>
            {homeData.videoSection.description && (
              <p className="text-lg text-balance">
                {homeData.videoSection.description}
              </p>
            )}
            <div className="border border-dashed border-zinc-300 w-full p-1">
              <div className="flex justify-center items-center w-full  bg-bg-100 p-3 border-t border-t-white shadow-xl">
                <iframe
                  className={`${
                    isSmallDevice ? "w-full h-64 " : "w-full h-150"
                  } rounded-2xl `}
                  src={homeData.videoSection.videoUrl}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </FadeInSection>
      </section>
      <section id="news" className="relative bg-primary-100 overflow-hidden">
        <div className="absolute  bottom-10 w-100   left-[50%] blur-3xl -translate-x-1/2 h-40 bg-orange-300  rounded-full"></div>
        <FadeInSection>
          <div
            className={` text-center ${
              isSmallDevice ? "py-12 w-100 px-5 my-5" : "py-10 flex flex-col"
            }`}
          >
            <Lastnews />
          </div>
        </FadeInSection>
      </section>

      <section id="clients" className="relative min-w-screen bg-white ">
        <FadeInSection>
          <div
            className={` mx-auto flex flex-col gap-4 text-center ${
              isSmallDevice ? "py-12 w-100 " : "py-10"
            }`}
          >
            <ClientsCarousel />
          </div>
        </FadeInSection>
      </section>

      <section
        id="contacto"
        className={`relative w-full  text-bg-400 bg-white ${
          isSmallDevice ? "py-12" : "py-24"
        }`}
      >
        <div
          className="absolute left-0 -bottom-0 w-full h-120"
          style={{
            backgroundColor: "#ff3030",
            clipPath: "ellipse(100% 100% at 50% 100%)",
          }}
        ></div>
        
        <div className="absolute  bottom-10 w-100   left-[50%] blur-3xl -translate-x-1/2 h-40 bg-orange-300  rounded-full"></div>
        <FadeInSection>
          <div
            className={`relative  rounded-2xl py-10 mx-auto flex flex-col items-center gap-4 text-center bg-gradient-to-t from-white backdrop-blur-xl border border-white-100
          ${isSmallDevice ? "w-100 max-w-3xl" : "max-w-7xl"}
          `}
          >
            <div className="bg-white/30 border border-white px-5 py-2 rounded-xl">
              <h2 className="text-4xl font-bold text-primary-100">
                {homeData.contactSection.title}
              </h2>
            </div>
            <div
              className={` ${
                isSmallDevice ? "flex flex-col" : "grid grid-cols-2"
              } gap-8 justify-center items-center mt-8 w-full p-5 `}
            >
              <div className="flex items-center flex-col justify-center gap-10   rounded-2xl h-full py-5 w-full">
                <div className="rounded-full p-0.5 bg-gradient-to-bl from-orange-500 to-primary-100 border-t border-t-orange-300">
                  <div className="rounded-full p-5 ">
                    <SlPhone className="text-5xl text-white-100" />
                  </div>
                </div>
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
              <div className="flex items-center flex-col justify-center gap-10   rounded-2xl h-full py-5 w-full">
                <div className="rounded-full p-0.5 bg-gradient-to-bl from-orange-500 to-primary-100 border-t border-t-orange-300">
                  <div className="rounded-full p-5 ">
                    <SlEnvolope className="text-5xl text-white-100" />
                  </div>
                </div>
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
                <div className="bg-primary-100 rounded-2xl px-10 py-2 shadow border-t-2 border-t-orange-400">
                  <p className="text-sm  text-white ">
                    {homeData.contactSection.contactInfo.schedule}
                  </p>
                </div>
              )}
            </div>
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}

export default EditableHome;
