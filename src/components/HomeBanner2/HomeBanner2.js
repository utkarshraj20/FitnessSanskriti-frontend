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

  const cardThemes = [
    { glow: "#ffc20e", tint: "rgba(255, 194, 14, 0.3)" },
    { glow: "#4ecdc4", tint: "rgba(78, 205, 196, 0.3)" },
    { glow: "#ff6b6b", tint: "rgba(255, 107, 107, 0.28)" },
    { glow: "#54a0ff", tint: "rgba(84, 160, 255, 0.28)" },
    { glow: "#f368e0", tint: "rgba(243, 104, 224, 0.28)" },
    { glow: "#1dd1a1", tint: "rgba(29, 209, 161, 0.28)" },
  ];

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
        {workouts.map((item, index) => (
          <SwiperSlide key={item._id}>
            <Link href={`/workout/${item._id}`} style={{ textDecoration: "none" }}>
              <div
                className="swiper-slide workout-card"
                style={{
                  "--card-glow": cardThemes[index % cardThemes.length].glow,
                  "--card-tint": cardThemes[index % cardThemes.length].tint,
                }}
              >
                <div className="swiper-slide-content">
                  <h2>{item.name}</h2>
                  <p>{item.description}</p>
                  <div className="workout-card__meta">
                    <span>{item.durationInMinutes} min</span>
                    <span>{item.exercises?.length || 0} exercises</span>
                  </div>
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
