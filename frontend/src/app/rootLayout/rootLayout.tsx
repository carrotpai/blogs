import React, { useEffect } from 'react';
import { Outlet, matchRoutes, renderMatches, useLocation } from 'react-router';

import routes, { modalsRoutes } from '../router/routes';
import styles from './rootLayout.module.scss';
import {
	renderBackgroundPage,
	renderModal,
} from '../router/modalRenderingUtils';
import { useUserStore } from '../../store/store';

function RootLayout() {
	const location = useLocation();
	const getUserAuthData = useUserStore((state) => state.getUser);

	useEffect(() => {
		getUserAuthData();
	}, []);

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
