// components/home/Categories.jsx
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useAllCategoriesQuery } from "../../store/services/categoryService";
import Skeleton from "../skeleton/Skeleton";
import Thumbnail from "../skeleton/Thumbnail";

const Categories = () => {
  const { data, isFetching } = useAllCategoriesQuery();

  if (isFetching) {
    return (
      <div className="flex flex-wrap -mx-4 mb-10">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div
            className="w-6/12 sm:w-4/12 md:w-3/12 lg:w-[20%] xl:w-2/12 p-4"
            key={item}
          >
            <Skeleton>
              <Thumbnail height="150px" />
            </Skeleton>
          </div>
        ))}
      </div>
    );
  }

  if (!data?.categories?.length) return null;

  return (
    <div className="mb-10">
      <Swiper
        spaceBetween={20}
        slidesPerView={3}
        breakpoints={{
          0: { slidesPerView: 2 },
          640: { slidesPerView: 3 },
          768: { slidesPerView: 4 },
          1080: { slidesPerView: 5 },
          1280: { slidesPerView: 6 },
        }}
        observer={true}
        observeParents={true}
        observeSlideChildren={true}
        className="w-full h-[150px]"
        watchOverflow={true}
      >
        {data.categories.map((category, index) => {
          // choose a stable key — use id if available
          const key = category._id ?? `${category.name}-${index}`;
          const imgIndex = (index % 5) + 1; // cycle 1..5
          return (
            <SwiperSlide
              className="w-full overflow-hidden rounded-lg relative"
              key={key}
            >
              <div className="w-full h-[150px] rounded-lg overflow-hidden">
                <img
                  src={`/images/slider/${imgIndex}.jpg`}
                  className="w-full h-full object-cover"
                  alt={category.name}
                  width={600}
                  height={150}
                />
              </div>

              <div className="absolute inset-0 w-full h-full bg-black/50 flex items-center justify-center p-4">
                <Link
                  to={`/cat-products/${encodeURIComponent(category.name)}`}
                  className="text-white text-base font-medium capitalize"
                >
                  {category.name}
                </Link>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default Categories;
