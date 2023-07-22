import React, { useState } from "react";

import styles from "./authorizationButton.module.scss";

import loginIcon from "../../../img/login.svg";
import logoutIcon from "../../../img/logout.svg";

interface AuthStatusProps {
	isAuth?: boolean;
}

function AuthorizationButton({ isAuth }: AuthStatusProps) {
	return (
		<div className={styles.content}>
			<p className={styles.content__text}>{isAuth ? "Logout" : "Login"}</p>
			<img
				src={isAuth ? loginIcon : logoutIcon}
				alt='login logout icon'
				width={30}
				height={30}
			/>
		</div>
	);
}

export default AuthorizationButton;
