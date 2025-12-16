import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Link } from "react-router-dom";
import { useAllCategoriesQuery } from "../../store/services/categoryService";
import Spinner from "../Spinner";

const Slider = () => {
  const { data, isFetching } = useAllCategoriesQuery();

  const categoryImageMap = {
    clothing: 1,
    footwear: 2,
    electronics: 3,
    accessories: 4,
    "home & kitchen": 5,
  };

  // 1. Filter the categories here
  const sliderCategories = data?.categories?.filter((cat) =>
    [
      "clothing",
      "footwear",
      "electronics",
      "accessories",
      "home & kitchen",
    ].includes(cat.name.toLowerCase())
  );

  if (isFetching) {
    return (
      <div className="my-container h-[70vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ dynamicBullets: true }}
      loop={true}
      autoplay={{
        delay: 3000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      className="mySwiper"
    >
      {/* 2. Use 'sliderCategories' here, NOT 'categories' */}
      {sliderCategories &&
        sliderCategories.length > 0 &&
        sliderCategories.map((cat) => {
          const imgNumber = categoryImageMap[cat.name.toLowerCase()] || 1;

          return (
            <SwiperSlide className="slide" key={cat._id}>
              <div className="slide-img">
                <img
                  src={`/images/slider/${imgNumber}.jpg`}
                  className="w-full h-full object-cover"
                  alt={cat.name}
                />
              </div>

              <div className="absolute inset-0 w-full h-full bg-black/50">
                <div className="my-container h-[70vh] flex flex-col items-center justify-center">
                  <h1 className="text-white text-xl font-medium capitalize">
                    {cat.name}
                  </h1>
                  <div className="mt-10">
                    <Link
                      to={`/cat-products/${cat.name}`}
                      className="btn btn-indigo text-sm"
                    >
                      browse collections
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
    </Swiper>
  );
};

export default Slider;
