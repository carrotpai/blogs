import React from "react";
import SmallSlider from "../../components/smallSlider/smallSlider";

import styles from "./mainPage.module.scss";

function MainPage() {
	return (
		<div className={styles.content}>
			<SmallSlider />
		</div>
	);
}

export default MainPage;
