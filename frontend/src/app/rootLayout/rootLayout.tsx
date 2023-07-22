import React from "react";
import { Outlet, matchRoutes, renderMatches, useLocation } from "react-router";

import routes, { modalsRoutes } from "../router/routes";
import styles from "./rootLayout.module.scss";
import Modal from "../../components/modal/modal";
import {
	renderBackgroundPage,
	renderModal,
} from "../router/modalRenderingUtils";

function RootLayout() {
	const location = useLocation();

	if (location.state?.background) {
		const backgroundPage = renderBackgroundPage(
			routes,
			location.state.background
		);
		const modal = renderModal(modalsRoutes, location.pathname);
		return (
			<div className={styles.content}>
				{backgroundPage}
				{modal}
			</div>
		);
	}

	return (
		<div className={styles.content}>
			<Outlet />
		</div>
	);
}

export default RootLayout;
