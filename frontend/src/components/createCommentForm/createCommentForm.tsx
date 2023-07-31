import React, { useEffect, useState } from 'react';

import CommentTextField from '../commentTextField/commentTextField';

import styles from './createCommentForm.module.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useUserStore } from '../../store/store';
import { useLocation, useNavigate } from 'react-router';
import { axiosPrivate } from '../../api/axios';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { CircularProgress } from '@mui/material';
import { sleep } from '../../utils/sleep';

type CreateCommentFormPropsDefault = {
	onClose: () => void;
	postId: number;
	currentPage?: number;
	onEntryAdded: () => void;
	formStatus?: boolean;
};

type ConditionalCreateCommentFormProps =
	| { type: 'root'; parentCommentId?: never }
	| {
			type: 'reply';
			parentCommentId: number;
	  };

interface CommentFormData {
	text: string;
}

type CreateCommentFormProps = CreateCommentFormPropsDefault &
	ConditionalCreateCommentFormProps;

function CreateCommentForm(props: CreateCommentFormProps) {
	const {
		onEntryAdded,
		type = 'root',
		postId,
		parentCommentId,
		onClose,
	} = props;

	const navigate = useNavigate();
	const { pathname } = useLocation();

	const user = useUserStore((state) => state.user);
	const queryClient = useQueryClient();

	//В деве и стрикт моде происходит 2 вызова навигейта
	//можно конечно сделать промис с дебаунсом
	//но лучше просто оставить как есть до релиза
	useEffect(() => {
		if (!user) {
			navigate('/login', {
				state: { background: pathname },
			});
		}
	}, []);

	const { mutate: createNewComment, isLoading } = useMutation({
		mutationFn: async (commentText: string) => {
			return axiosPrivate.post<{ commentId: number }>(
				{
					root: `comments/create/forpost/${postId}`,
					reply: `comments/create/forcomment/${parentCommentId}?postId=${postId}`,
				}[type],
				{
					text: commentText,
				}
			);
		},
		onSuccess: () => {
			const totalCommentCount = queryClient.getQueryData<number>([
				'postCommentsCount',
			]);
			queryClient.setQueryData(
				['postCommentsCount'],
				totalCommentCount ? totalCommentCount + 1 : 1
			);
			//отобразить вложенные комментарии вместе с новым созданным (работает только для реплаев)
			if (onEntryAdded) {
				onEntryAdded();
			}
		},
	});

	const schema = yup.object({
		text: yup.string().required(),
	});

	const {
		handleSubmit,
		control,
		formState: { errors },
		reset,
	} = useForm<CommentFormData>({
		defaultValues: { text: '' },
		resolver: yupResolver(schema),
	});

	const onSubmit: SubmitHandler<CommentFormData> = (data) => {
		createNewComment(data.text);
		reset();
	};

	return (
		<form
			action="submit"
			className={styles.form}
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				name="text"
				control={control}
				render={({ field }) => (
					<CommentTextField
						label={
							{ root: 'Your comment', reply: 'Your reply' }[type]
						}
						multiline
						minRows={3}
						error={!!errors.text}
						helperText={errors.text?.message}
						{...field}
					/>
				)}
			/>
			<div className={styles.buttons}>
				<button className={styles.buttons__comment} type="submit">
					comment
				</button>
				<button
					className={styles.buttons__cancel}
					type="button"
					onClick={() => {
						onClose();
					}}
				>
					cancel
				</button>
			</div>
		</form>
	);
}

export default CreateCommentForm;
