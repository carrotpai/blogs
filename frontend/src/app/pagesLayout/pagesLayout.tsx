import React from 'react';
import { Outlet } from 'react-router';

import styles from './pagesLayout.module.scss';
import Header from '../../components/header/header';

function PagesLayout() {
	return (
		<div className={styles.content}>
			<Header />
			<p>PagesLayout</p>
			<Outlet />
		</div>
	);
}

export default PagesLayout;
