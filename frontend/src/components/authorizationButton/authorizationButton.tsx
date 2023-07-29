import React, { useState } from 'react';

import styles from './authorizationButton.module.scss';

import loginIcon from '../../../img/login.svg';
import logoutIcon from '../../../img/logout.svg';

interface AuthStatusProps {
	type: 'logout' | 'login';
	onClick: () => void;
}

function AuthorizationButton({ type, onClick }: AuthStatusProps) {
	return (
		<button className={styles.content} onClick={onClick}>
			<p className={styles.content__text}>
				{{ login: 'Login', logout: 'Logout' }[type]}
			</p>
			<img
				src={{ login: loginIcon, logout: logoutIcon }[type]}
				alt="login logout icon"
				width={30}
				height={30}
			/>
		</button>
	);
}

export default AuthorizationButton;
