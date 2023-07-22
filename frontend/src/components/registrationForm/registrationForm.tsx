import React from "react";
import * as yup from "yup";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import RoundedTextField from "../roundedTextField/roundedTextField";
import { axios } from "../../api/axios";

import styles from "./registrationForm.module.scss";

interface RegistrationFormInputData {
	username: string;
	password: string;
	passwordRepeat: string;
}

function RegistrationForm() {
	const schema = yup.object({
		username: yup.string().required().min(4),
		password: yup
			.string()
			.required()
			.matches(
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/,
				"password must have minimum length of 8 characters and containt at least 1 capital letter and 1 number"
			),
		passwordRepeat: yup
			.string()
			.required("repeat password is required field")
			.test("equal", `Passwords don't match`, function (value) {
				const ref = yup.ref("password");
				return value === this.resolve(ref);
			}),
	});

	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<RegistrationFormInputData>({
		defaultValues: {
			username: "",
			password: "",
			passwordRepeat: "",
		},
		resolver: yupResolver(schema),
	});

	const onSumbit: SubmitHandler<RegistrationFormInputData> = async (data) => {
		console.log(data);
		const res = (
			await axios.post("auth/register", {
				username: data.username,
				password: data.password,
			})
		).data;
		console.log(res);
	};
	return (
		<>
			<form
				action='submit'
				className={styles.form}
				onSubmit={handleSubmit(onSumbit)}
			>
				<div className={styles.inputs}>
					<Controller
						name='username'
						control={control}
						render={({ field }) => (
							<RoundedTextField
								id='username'
								label='username'
								variant='outlined'
								helperText={errors.username?.message}
								error={!!errors.username}
								{...field}
							/>
						)}
					/>
					<Controller
						name='password'
						control={control}
						render={({ field }) => (
							<RoundedTextField
								id='password'
								label='password'
								variant='outlined'
								helperText={errors.password?.message}
								error={!!errors.password}
								{...field}
							/>
						)}
					/>
					<Controller
						name='passwordRepeat'
						control={control}
						render={({ field }) => (
							<RoundedTextField
								id='passwordRepeat'
								label='repeat password'
								variant='outlined'
								helperText={errors.passwordRepeat?.message}
								error={!!errors.passwordRepeat}
								{...field}
							/>
						)}
					/>
				</div>
				<button type='submit' className={styles.button}>
					Register
				</button>
			</form>
		</>
	);
}

export default RegistrationForm;
