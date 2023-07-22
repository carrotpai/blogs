import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import { Autoplay, Virtual } from "swiper";

import "swiper/css";
import styles from "./smallSlider.module.scss";
import RecommendationCard from "../recommendationCard/recommendationCard";
import { recommendations } from "../../constants/recommendations";

function SmallSlider() {
	return (
		<div className={styles.recommendations}>
			<div className={styles.recommendations__title}># Recommendation</div>
			<Swiper
				slidesPerView={5}
				loop={true}
				navigation={true}
				autoplay={{
					delay: 4000,
					disableOnInteraction: false,
				}}
				spaceBetween={8}
				modules={[Virtual, Autoplay]}
				className='swiper'
				virtual
			>
				{recommendations.map((cardContent, index) => (
					<SwiperSlide key={index} virtualIndex={index}>
						<RecommendationCard {...cardContent} />
					</SwiperSlide>
				))}
			</Swiper>
		</div>
	);
}

export default SmallSlider;
