import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';
import React, { useState } from 'react';
import * as yup from 'yup';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import RoundedTextField from '../roundedTextField/roundedTextField';

import styles from './loginForm.module.scss';
import { useTokenStore, useUserStore } from '../../store/store';
import { useNavigate } from 'react-router';

interface LoginFormData {
	username: string;
	password: string;
}

function LoginForm() {
	const [isCredentialsValid, setIsCredentialsValid] = useState(true);
	const navigate = useNavigate();
	const { signin } = useUserStore((state) => ({ signin: state.signin }));
	const { rememberMe, changeRememberMe } = useTokenStore((state) => ({
		setTokens: state.setTokens,
		rememberMe: state.rememberMe,
		changeRememberMe: state.changeRememberMe,
	}));

	const schema = yup.object({
		username: yup.string().required().min(4),
		password: yup.string().required(),
	});

	const {
		handleSubmit,
		control,
		formState: { errors },
		setError,
		clearErrors,
	} = useForm<LoginFormData>({
		defaultValues: {
			username: '',
			password: '',
		},
		resolver: yupResolver(schema),
	});

	const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
		try {
			await signin(data.username, data.password);
		} catch (e) {
			setError('username', {
				type: '401',
				message: 'wrong username or password',
			});
			setError('password', {
				type: '401',
				message: 'wrong username or password',
			});
			setIsCredentialsValid(false);
			return;
		}
		navigate('/');
	};
	return (
		<>
			<form
				action="submit"
				className={styles.form}
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className={styles.inputs}>
					<Controller
						name="username"
						control={control}
						render={({ field }) => (
							<RoundedTextField
								id="username"
								label="username"
								variant="outlined"
								error={!!errors.username}
								helperText={errors.username?.message}
								autoComplete="username"
								{...field}
								onClick={() => {
									if (!isCredentialsValid) clearErrors();
									setIsCredentialsValid(true);
								}}
							/>
						)}
					/>
					<Controller
						name="password"
						control={control}
						render={({ field }) => (
							<RoundedTextField
								id="password"
								label="password"
								variant="outlined"
								error={!!errors.password}
								helperText={errors.password?.message}
								autoComplete="password"
								{...field}
								onClick={() => {
									if (!isCredentialsValid) clearErrors();
									setIsCredentialsValid(true);
								}}
							/>
						)}
					/>
				</div>
				<FormGroup className={styles.checkbox}>
					<FormControlLabel
						sx={{
							'.MuiFormControlLabel-label': {
								fontSize: '16px',
								marginTop: '4px',
							},
						}}
						control={<Checkbox defaultChecked />}
						label="Remember me"
						onChange={() => changeRememberMe()}
					/>
				</FormGroup>
				<button type="submit" className={styles.button}>
					Login
				</button>
			</form>
		</>
	);
}

export default LoginForm;
