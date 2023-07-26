import React, { useState } from 'react';

import UserBar from '../userBar/userBar';
import AuthorizationButton from '../authorizationButton/authorizationButton';
import { useUserStore } from '../../store/store';

import styles from './headerAuth.module.scss';

const testID = 2;

function HeaderAuth() {
	const user = useUserStore((state) => state.user);
	const [isAuth, setIsAuth] = useState(Boolean(user));
	if (!user) {
		return <div>Not Logged in</div>;
	}
	return (
		<div className={styles.content}>
			<UserBar
				id={user.id}
				avatar={user.avatar}
				username={user.username}
			/>
			<AuthorizationButton isAuth={isAuth} />
		</div>
	);
}

export default HeaderAuth;
