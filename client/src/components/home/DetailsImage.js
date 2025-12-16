const DetailsImage = ({ image }) => {
  if (!image) return null;

  // Detect Cloudinary or any full URL
  const isFullUrl = /^https?:\/\//i.test(image);

  // Final src
  const src = isFullUrl ? image : `/images/${image}`;

  return (
    <div className="w-full sm:w-6/12 p-1">
      <img src={src} alt="product" className="w-full h-auto object-cover" />
    </div>
  );
};

export default DetailsImage;
