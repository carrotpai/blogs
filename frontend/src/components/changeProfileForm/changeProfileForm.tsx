import React, { RefObject, useCallback, useEffect, useRef } from 'react';
import { Divider, Typography, TypographyProps, styled } from '@mui/material';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { yupResolver } from '@hookform/resolvers/yup';

import ImageCropInput from '../imageCropInput/imageCropInput';
import TextField from '../textField/responsiveTextField';
import { useUserStore } from '../../store/store';
import { axiosPrivate } from '../../api/axios';
import schema from './validationScheme';
import { ProfileFormData } from '../../types/types';

import styles from './changeProfileForm.module.scss';

type ImageCropInputRef = {
	canvasRef: RefObject<HTMLCanvasElement>;
	toDataString: (cb: BlobCallback) => void;
};

const ModalTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
	marginBottom: '8px',
	[theme.breakpoints.down('md')]: {
		fontSize: '16px',
	},
}));

function ChangeProfileForm() {
	const imageCropInputRef = useRef<ImageCropInputRef>(null);

	const user = useUserStore((state) => state.user);

	useEffect(() => {
		console.log(user);
	}, [user]);

	const queryClient = useQueryClient();
	const { mutate } = useMutation({
		mutationFn: async (formData: FormData) => {
			return await axiosPrivate.patch('user/edit', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user', user?.id] });
		},
	});

	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<Partial<ProfileFormData>>({
		defaultValues: {
			username: user?.username ? user.username : '',
			info: user?.info ? user.info : '',
			description: user?.description ? user.description : '',
			password: '',
			newPassword: '',
			newPasswordRepeat: '',
		},
		resolver: yupResolver(schema),
	});

	const getImageCrop = useCallback(
		(data: FormData) => {
			return new Promise<void>((res, rej) => {
				try {
					imageCropInputRef.current?.toDataString((blob) => {
						if (!blob) {
							rej('Failed to create blob');
							return;
						}
						data.append('avatar', blob);
						res();
					});
				} catch (e) {
					console.log("crop doesn't exist");
					res();
				}
			});
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[imageCropInputRef.current]
	);

	const onSubmit: SubmitHandler<Partial<ProfileFormData>> = async (data) => {
		delete data.newPasswordRepeat;
		const formData = new FormData();
		await getImageCrop(formData);
		(Object.keys(data) as [keyof ProfileFormData]).forEach((val) => {
			const inputData = data[val];
			if (inputData) {
				formData.append(val, inputData);
			}
		});

		mutate(formData);
	};
	return (
		<div>
			<form action="submit" className={styles.form}>
				<div className={styles.avatar}>
					<Divider textAlign="left">
						<ModalTypography fontWeight={300}>
							Choose image for avatar
						</ModalTypography>
					</Divider>
					<ImageCropInput ref={imageCropInputRef} />
				</div>
				<div className={styles.form__textInputs}>
					<Divider textAlign="left">
						<ModalTypography fontWeight={300}>
							User info
						</ModalTypography>
					</Divider>
					<div className={styles.userInfo}>
						<div className="username">
							<ModalTypography>New username:</ModalTypography>
							<Controller
								name="username"
								control={control}
								render={({ field }) => (
									<TextField
										id="username"
										variant="outlined"
										label="Username"
										error={!!errors.username}
										helperText={errors.username?.message}
										{...field}
									/>
								)}
							/>
						</div>
						<div className={styles.info}>
							<ModalTypography>
								Some info about you:
							</ModalTypography>
							<Controller
								name="info"
								control={control}
								render={({ field }) => (
									<TextField
										fullWidth
										id="info"
										multiline
										variant="outlined"
										label="Info"
										{...field}
									/>
								)}
							/>
						</div>
						<div className={styles.desc}>
							<ModalTypography sx={{ width: '400px' }}>
								Here you can describe yourself and your
								expertise:
							</ModalTypography>
							<Controller
								name="description"
								control={control}
								render={({ field }) => (
									<TextField
										id="description"
										fullWidth
										multiline
										rows={10}
										label="Description..."
										{...field}
									/>
								)}
							/>
						</div>
					</div>
					<Divider textAlign="left">
						<ModalTypography fontWeight={300}>
							Change Password
						</ModalTypography>
					</Divider>
					<div className={styles.changePassword}>
						<div className="password">
							<ModalTypography>
								Your current password:
							</ModalTypography>
							<Controller
								name="password"
								control={control}
								render={({ field }) => (
									<TextField
										id="password"
										variant="outlined"
										label="Password"
										sx={{ width: '280px' }}
										error={!!errors.password}
										helperText={errors.password?.message}
										{...field}
									/>
								)}
							/>
						</div>
						<div className={''}>
							<ModalTypography>
								Enter your new password:
							</ModalTypography>
							<div className={styles.passwords__newPasswords}>
								<Controller
									name="newPassword"
									control={control}
									render={({ field }) => (
										<TextField
											id="newPassword"
											variant="outlined"
											label="New password"
											sx={{ width: '280px' }}
											error={!!errors.newPassword}
											helperText={
												errors.newPassword?.message
											}
											{...field}
										/>
									)}
								/>
								<Controller
									name="newPasswordRepeat"
									control={control}
									render={({ field }) => (
										<TextField
											id="newPasswordRepeat"
											variant="outlined"
											label="Repeat new password"
											sx={{ width: '280px' }}
											error={!!errors.newPasswordRepeat}
											helperText={
												errors.newPasswordRepeat
													?.message
											}
											{...field}
										/>
									)}
								/>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.buttonWrapper}>
					<button
						onClick={handleSubmit(onSubmit)}
						type="submit"
						className={styles.button}
					>
						Apply
					</button>
				</div>
			</form>
		</div>
	);
}

export default ChangeProfileForm;
