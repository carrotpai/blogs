import React, { useEffect } from 'react';

import CommentTextField from '../commentTextField/commentTextField';

import styles from './createCommentForm.module.scss';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { useUserStore } from '../../store/store';
import { useLocation, useNavigate, useParams } from 'react-router';
import { axiosPrivate } from '../../api/axios';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface CreateCommentFormProps {
	onClose: () => void;
	postId: number;
	currentPage?: number;
	parentCommentId?: number;
	type: 'comment' | 'reply';
}

interface CommentFormData {
	text: string;
}

function CreateCommentForm({
	onClose,
	type = 'comment',
	postId,
	currentPage,
	parentCommentId,
}: CreateCommentFormProps) {
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

	const getQueryKey = (): (string | number)[] => {
		let key;
		if (type === 'comment') key = ['notNestedComment', postId];
		else {
			key = ['nestedComment', parentCommentId ?? -1];
		}
		return key;
	};

	const { mutate: createNewComment } = useMutation({
		mutationFn: async (commentText: string) => {
			return axiosPrivate.post(
				{
					comment: `comments/create/forpost/${postId}`,
					reply: `comments/create/forcomment/${parentCommentId}?postId=${postId}`,
				}[type],
				{
					text: commentText,
				}
			);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: getQueryKey() });
		},
	});

	const schema = yup.object({
		text: yup.string().required(),
	});

	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm<CommentFormData>({
		defaultValues: { text: '' },
		resolver: yupResolver(schema),
	});

	const onSubmit: SubmitHandler<CommentFormData> = (data) => {
		createNewComment(data.text);
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
							{ comment: 'Your comment', reply: 'Your reply' }[
								type
							]
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
					onClick={() => onClose()}
				>
					cancel
				</button>
			</div>
		</form>
	);
}

export default CreateCommentForm;
