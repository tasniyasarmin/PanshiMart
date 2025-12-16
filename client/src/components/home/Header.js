import { motion } from "framer-motion";
import image1 from "../../assets/images/header/1.jpg";
import image2 from "../../assets/images/header/2.jpg";
import image3 from "../../assets/images/header/3.jpg";
import image4 from "../../assets/images/header/4.jpg";
import image5 from "../../assets/images/header/5.jpg";

const Header = ({ children }) => {
  const categoryImages = {
    clothing: image1,
    footwear: image2,
    electronics: image3,
    accessories: image4,
    "home & kitchen": image5,
  };

  let text = "";

  if (typeof children === "string") {
    text = children;
  } else if (Array.isArray(children)) {
    text = children.join(" ");
  }

  const normalizedText = text.toLowerCase();

  console.log("Header Text:", normalizedText);

  const matchedKey = Object.keys(categoryImages).find((key) =>
    normalizedText.includes(key)
  );

  const bgImage = categoryImages[matchedKey] || image1;

  return (
    <motion.header
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="header"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="header-cover">
        <div className="my-container flex-y h-[300px]">
          <h1
            className="header-heading"
            style={{ textShadow: "2px 2px 10px rgba(0,0,0,0.7)" }}
          >
            {children}
          </h1>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
