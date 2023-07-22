import React from 'react';
import { Outlet } from 'react-router';

import background from '../../../img/authBackground.png';
import logo from '../../../img/Logo.png';
import styles from './authLayout.module.scss';

function AuthLayout() {
	return (
		<div className={styles.layout}>
			<main className={styles.container}>
				<div className={styles.formContainer}>
					<div className={styles.form}>
						<div className="logo">
							<img
								src={logo}
								alt="logo"
								width={158}
								height={36}
							/>
						</div>
						<Outlet />
					</div>
				</div>
				<div className={styles.imageContainer}>
					<img
						src={background}
						alt="background"
						width={620}
						height={780}
					/>
					<p className={styles.imageContainer__title}>
						MetaBlog
						<br />
						completely free blogs platform: share your opinion and
						experience
					</p>
				</div>
			</main>
		</div>
	);
}

export default AuthLayout;
