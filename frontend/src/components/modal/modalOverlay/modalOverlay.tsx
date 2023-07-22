import React from "react";

import styles from "./modalOverlay.module.scss";

function ModalOverlay({
	handleCloseAction,
}: {
	handleCloseAction: () => void;
}) {
	return (
		<div
			aria-hidden='true'
			className={styles.overlay}
			onClick={handleCloseAction}
		/>
	);
}

export default ModalOverlay;
