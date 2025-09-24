import { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface ContentSectionProps {
  title: string;
  description: string | React.ReactNode;
  images: string[];
  altText?: string;
  layout?: "text-left" | "text-right" | "text-top";
  className?: string;
  autoSlide?: boolean;
  slideInterval?: number;
}

function ContentSection({
  title,
  description,
  images,
  altText = "Content Image",
  layout = "text-left",
  className = "",
  autoSlide = true,
  slideInterval = 5000,
}: ContentSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (images.length > 1 && autoSlide) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
      }, slideInterval);

      return () => clearInterval(interval);
    }
  }, [images.length, autoSlide, slideInterval]);

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

  const renderImageGallery = () => (
    <div className="relative w-full h-full overflow-hidden rounded-2xl">
      <img
        draggable={false}
        src={images[currentImageIndex]}
        alt={altText}
        className="w-full object-cover scale-110 transition-transform duration-300"
      />
      
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-300"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-colors duration-300"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
          
          <div className="absolute bottom-4 right-4 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  const renderTextContent = () => (
    <div className="flex flex-col justify-center items-start gap-5">
      <h4 className="text-3xl font-black">{title}</h4>
      <div className="text-lg font-semibold leading-6">{description}</div>
    </div>
  );

  const renderLayout = () => {
    switch (layout) {
      case "text-right":
        return (
          <div className={`grid grid-cols-2 gap-8 ${className}`}>
            <div className="w-full h-full">
              {renderImageGallery()}
            </div>
            {renderTextContent()}
          </div>
        );
      
      case "text-top":
        return (
          <div className={`flex flex-col gap-8 ${className}`}>
            {renderTextContent()}
            <div className="w-full h-full">
              {renderImageGallery()}
            </div>
          </div>
        );
      
      case "text-left":
      default:
        return (
          <div className={`grid grid-cols-2 gap-8 ${className}`}>
            {renderTextContent()}
            <div className="w-full h-full">
              {renderImageGallery()}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full">
      {renderLayout()}
    </div>
  );
}

export default ContentSection;