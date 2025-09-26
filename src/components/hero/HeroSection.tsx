import { useState, useEffect } from "react";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router";
import { motion } from "motion/react";
import { FadeInSection, SlideInLeft, SlideInRight } from "../animations";
import MarkdownContent from "../content/MarkdownContent";

interface HeroSectionProps {
  title: string;
  description: string;
  buttonText?: string;
  buttonLink?: string;
  images: string[];
  altText?: string;
  onButtonClick?: () => void;
}

function HeroSection({
  title,
  description,
  buttonText = "Ver video",
  buttonLink = "#",
  images,
  altText = "Hero Image",
  onButtonClick,
}: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [images.length]);

  const nextImage = () => {
    setCurrentImageIndex(
      currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
    );
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  return (
    <section className="bg-bg-400 flex flex-row justify-center items-center h-130 overflow-hidden border-t border-t-bg-200 border-b-4 border-primary-100">
      <div className="grid grid-cols-4 gap-5 w-full">
        <SlideInLeft className="col-span-2 w-full h-full flex justify-center items-center">
          <article className="flex flex-col items-end justify-center w-full">
            <div className="max-w-2xl h-full flex flex-col gap-5">
              <FadeInSection delay={0.2}>
                <h2 className="text-white text-5xl font-bold">{title}</h2>
              </FadeInSection>
              <FadeInSection delay={0.4}>
                <div className="text-white-100 text-lg">
                  <MarkdownContent 
                    content={description} 
                    className="prose prose-lg max-w-none text-inherit"
                  />
                </div>
              </FadeInSection>
            </div>
            <FadeInSection delay={0.6} className="w-full max-w-sm mt-5 mx-auto">
              <Link
                to={buttonLink}
                className="inline-flex items-center text-primary-100 hover:text-white-100 transition-colors duration-300 font-medium border px-4 py-1 w-max"
                onClick={handleButtonClick}
              >
                {buttonText}
                <FiArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </FadeInSection>
          </article>
        </SlideInLeft>
        <SlideInRight className="relative col-span-2 w-full h-full overflow-hidden">
          <motion.img
            draggable={false}
            src={images[currentImageIndex]}
            alt={altText}
            className="w-full object-cover"
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
          <div className="absolute left-0 top-0 bg-gradient-to-r from-bg-400 to-transparent h-full w-1/3"></div>

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-300"
              >
                <FiChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-300"
              >
                <FiChevronRight className="w-6 h-6" />
              </button>

              <div className="absolute bottom-4 right-4 flex space-x-2 z-20">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      index === currentImageIndex
                        ? "bg-primary-100"
                        : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </SlideInRight>
      </div>
    </section>
  );
}

export default HeroSection;
