import React, { useState } from "react";
import UserBar from "../userBar/userBar";
import AuthorizationButton from "../authorizationButton/authorizationButton";

import styles from "./headerAuth.module.scss";

import testAvatar from "../../../img/testAvatar.png";
const testID = 2;

function HeaderAuth() {
	const [isAuth, setIsAuth] = useState(false);
	return (
		<div className={styles.content}>
			<UserBar id={testID} avatar={testAvatar} username='Jason Francisco' />
			<AuthorizationButton isAuth={isAuth} />
		</div>
	);
}

export default HeaderAuth;
