import React, { useState } from 'react';

import UserBar from '../userBar/userBar';
import AuthorizationButton from '../authorizationButton/authorizationButton';
import { useTokenStore, useUserStore } from '../../store/store';

import styles from './headerAuth.module.scss';
import { useNavigate } from 'react-router';

function HeaderAuth() {
	const { user, reset } = useUserStore((state) => state);
	const resetTokens = useTokenStore((state) => state.reset);
	const navigate = useNavigate();
	const authButtonType = user ? 'logout' : 'login';
	const handleAuthButtonClick = {
		login: () => {
			navigate('/login');
		},
		logout: () => {
			reset();
			resetTokens();
		},
	}[authButtonType];
	return (
		<div className={styles.content}>
			{user && (
				<UserBar
					id={user.id}
					avatar={user.avatar}
					username={user.username}
				/>
			)}
			<AuthorizationButton
				onClick={handleAuthButtonClick}
				type={authButtonType}
			/>
		</div>
	);
}

export default HeaderAuth;
