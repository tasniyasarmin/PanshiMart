// src/components/common/AppImage.jsx
const FALLBACK = "https://via.placeholder.com/400x400?text=No+Image";

const AppImage = ({
  src,
  alt = "image",
  className = "",
  localBase = "/images",
}) => {
  if (!src) {
    return <img src={FALLBACK} alt={alt} className={className} />;
  }

  const isFullUrl = /^https?:\/\//i.test(src);
  const isAbsolutePath = src.startsWith("/");

  let finalSrc = src;

  if (isFullUrl) {
    finalSrc = src; // Cloudinary etc.
  } else if (isAbsolutePath) {
    finalSrc = src; // already like "/images/foo.jpg"
  } else {
    // plain filename "foo.jpg"
    finalSrc = `${localBase}/${src.replace(/^\/+/, "")}`;
  }

  return (
    <img
      src={finalSrc}
      alt={alt}
      className={className}
      onError={(e) => {
        e.currentTarget.src = FALLBACK;
      }}
    />
  );
};

export default AppImage;
