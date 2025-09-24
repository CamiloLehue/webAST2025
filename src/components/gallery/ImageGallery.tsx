import { useState } from "react";

interface ImageGalleryProps {
  images: string[];
  title: string;
  description: string;
  buttonText?: string;
  buttonViewMore?: string;
  onButtonClickViewMore?: () => void;
  onButtonClick?: () => void;
  altText?: string;
}

function ImageGallery({
  images,
  title,
  description,
  buttonText = "Solicitar",
  buttonViewMore,
  onButtonClick,
  onButtonClickViewMore,
  altText = "Gallery Image",
}: ImageGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    }
  };

  const handleButtonClickViewMore = () => {
    if (onButtonClickViewMore) {
      onButtonClickViewMore();
    }
  };

  return (
    <div className="grid grid-cols-2 gap-10 my-10 h-full">
      <div className="w-full h-full flex flex-col">
        <div className="overflow-hidden rounded-2xl min-h-100 max-h-100">
          <img
            draggable={false}
            src={images[selectedImageIndex] || images[0]}
            alt={altText}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        </div>
        <div className="relative mt-4 grid grid-cols-4 gap-4 overflow-x-scroll p-1">
          {images.slice(0, 4).map((image, index) => (
            <img
              key={index}
              draggable={false}
              src={image}
              alt={`${altText} ${index + 1}`}
              className={`h-30 rounded-lg cursor-pointer transition-all duration-300 ${
                selectedImageIndex === index
                  ? "ring ring-primary-100 opacity-100"
                  : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => handleThumbnailClick(index)}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col justify-between items-center gap-5 pt-10">
        <div className="w-full flex flex-col gap-5">
          <h4 className="text-4xl font-black">{title}</h4>
          <p className="text-lg font-light leading-6 text-left">
            {description}
          </p>
        </div>
        <div className="w-full h-20 flex justify-center items-center gap-5">
          {buttonViewMore && (
            <button
              onClick={handleButtonClickViewMore}
              className="flex justify-center items-center text-white-100 hover:text-primary-100 hover:bg-primary-100/5 transition-colors duration-300 font-medium border px-4 py-1 w-full rounded"
            >
              {buttonViewMore}
            </button>
          )}
          <button
            onClick={handleButtonClick}
            className="flex justify-center items-center text-white-100 hover:text-primary-100 hover:bg-primary-100/5 transition-colors duration-300 font-medium border px-4 py-1 w-full rounded"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageGallery;
