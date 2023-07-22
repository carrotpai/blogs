import React from 'react';

import RegistrationForm from '../../../components/registrationForm/registrationForm';

import styles from './register.module.scss';
import { Link } from 'react-router-dom';

function Register() {
	return (
		<>
			<div className={styles.container}>
				<div className={styles.header}>
					<p className={styles.header__title}>Hello there</p>
					<p className={styles.header__info}>
						Enter the information for registration
					</p>
				</div>
				<RegistrationForm />
			</div>
			<Link to="/login" className={styles.link}>
				Sign in
			</Link>
		</>
	);
}

export default Register;
