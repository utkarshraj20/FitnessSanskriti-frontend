import React from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "./HomeBanner2.css";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { apiUrl } from "@/utils/api";

const HomeBanner2 = () => {
  const [workouts, setWorkouts] = React.useState([]);

  const getWorkouts = async () => {
    try {
      const response = await fetch(apiUrl("/workoutplans/workouts"));
      const data = await response.json();

      if (data?.ok && Array.isArray(data.data)) {
        setWorkouts(data.data);
      } else {
        setWorkouts([]);
      }
    } catch (error) {
      setWorkouts([]);
    }
  };

  React.useEffect(() => {
    getWorkouts();
  }, []);

  return (
    <div>
      <h1 className="mainhead1">Workouts</h1>
      <Swiper
        slidesPerView={1}
        spaceBetween={10}
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 20 },
          768: { slidesPerView: 4, spaceBetween: 40 },
          1024: { slidesPerView: 5, spaceBetween: 50 },
        }}
        modules={[Pagination]}
        className="mySwiper"
      >
        {workouts.map((item) => (
            <SwiperSlide key={item._id}>
              <Link href={`/workout/${item._id}`} style={{ textDecoration: "none" }}>
                <div className="swiper-slide" style={{ backgroundImage: `url(${item.imageURL})` }}>
                <div className="swiper-slide-content">
                  <h2>{item.name}</h2>
                  <p>{item.durationInMinutes}</p>
                </div>
              </div>
              </Link>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
};

export default HomeBanner2;
