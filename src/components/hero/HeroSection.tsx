import { useState, useEffect } from "react";
import { FiArrowRight, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router";
import { motion } from "motion/react";
import MarkdownContent from "../content/MarkdownContent";
import { useBreakpoints } from "../../context/ProviderBreakpoints";

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
  buttonText = "",
  buttonLink = "#",
  images,
  altText = "Hero Image",
  onButtonClick,
}: HeroSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isSmallDevice } = useBreakpoints();
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
    <section
      className={`bg-bg-400 min-w-screen flex flex-row justify-center items-center 
        overflow-hidden border-t border-t-bg-200 border-b-4 border-primary-100
        ${isSmallDevice ? "h-auto " : " h-130"}
        `}
    >
      <div
        className={` gap-5 w-full bg-bg-400
        ${isSmallDevice ? "flex flex-col-reverse pb-10 " : "grid grid-cols-4"}`}
      >
        <motion.div
          className="col-span-2 w-full h-full flex justify-center items-center"
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <article className="flex flex-col items-end justify-center w-full">
            <div
              className={`max-w-2xl h-full flex flex-col gap-5
              ${isSmallDevice ? "px-4 text-center items-center" : ""}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.7,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <h2 className="text-white text-5xl font-bold">{title}</h2>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.9,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <div className="text-white-100 text-lg">
                  <MarkdownContent
                    content={description}
                    className="prose prose-lg max-w-none text-inherit"
                  />
                </div>
              </motion.div>
            </div>
            {buttonText && (
              <motion.div
                className="w-full max-w-sm mt-5 mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 1.1,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                <Link
                  to={buttonLink}
                  className="inline-flex items-center text-primary-100 hover:text-white-100 transition-colors duration-300 font-medium border px-4 py-1 w-max"
                  onClick={handleButtonClick}
                >
                  {buttonText}
                  <FiArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </motion.div>
            )}
          </article>
        </motion.div>
        <motion.div
          className="relative col-span-2 w-full h-full overflow-hidden"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.img
            draggable={false}
            src={images[currentImageIndex]}
            alt={altText}
            className="w-full object-cover"
            key={currentImageIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
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
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
