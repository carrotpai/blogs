import React from "react";
import LoginForm from "../../../components/loginForm/loginForm";

import styles from "./login.module.scss";
import { Link } from "react-router-dom";

function Login() {
	return (
		<div>
			<div className={styles.header}>
				<p className={styles.header__title}>Hello there</p>
				<p className={styles.header__info}>
					Enter the information you entered while registering
				</p>
			</div>
			<LoginForm />
			<Link to='/register' className={styles.link}>
				Register
			</Link>
		</div>
	);
}

export default Login;
