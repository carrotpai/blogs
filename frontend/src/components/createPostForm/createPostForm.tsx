import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { DeltaStatic } from 'quill';
import { Button } from '@mui/material';
import { Controller, useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, string, array, number } from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { axios } from '../../api/axios';
import TextField from '../textField/responsiveTextField';
import TagsInput from '../tagsInput/tagsInput';
import { createPostFormData } from '../../types/types';
import { formats, modules } from '../../utils/quill/quillConfig';

import 'react-quill/dist/quill.snow.css';
import styles from './createPostForm.module.scss';

function CreatePostForm() {
	const quillRef = useRef<ReactQuill>(null);
	const [delta, setDelta] = useState<DeltaStatic>();
	const [previewImageSrc, setPreviewImageSrc] = useState('');

	const queryClient = useQueryClient();
	const { mutate, isLoading } = useMutation({
		mutationFn: async (formData: FormData) => {
			return axios.post('post', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			});
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['posts'] });
		},
	});

	const schema = object({
		tags: array()
			.required()
			.of(number().integer().moreThan(0))
			.min(1, 'choose at least 1 tag'),
		title: string().required(),
		description: string().required(),
	});

	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
		setValue,
	} = useForm<createPostFormData>({
		defaultValues: {
			title: '',
			description: '',
			tags: [],
		},
		resolver: yupResolver(schema),
	});

	useEffect(() => {
		console.log(errors);
	}, [errors]);

	const onSumbit: SubmitHandler<createPostFormData> = async (data) => {
		const previewBlob = await (await fetch(previewImageSrc)).blob();
		const formData = new FormData();
		formData.append('cover', previewBlob);
		formData.append('content', JSON.stringify(delta));
		formData.append('title', data.title);
		formData.append('description', data.description);
		formData.append('tags', JSON.stringify(data.tags));
		mutate(formData);
	};

	const quillEditor = useCallback(() => {
		if (quillRef.current) {
			const editor = quillRef.current.getEditor();
			return quillRef.current.makeUnprivilegedEditor(editor);
		}
		return undefined;
	}, []);

	const onFileSelect = (e: React.ChangeEvent) => {
		URL.revokeObjectURL(previewImageSrc);
		const target = e.target as HTMLInputElement;
		const image = target.files ? target.files[0] : undefined;
		if (!image) throw new Error('error when uploading file');
		const imageSrc = URL.createObjectURL(image);
		setPreviewImageSrc(imageSrc);
	};

	return (
		<div className={styles.content}>
			<p className={styles.title__text}>Create new Post</p>
			<form
				action="submit"
				onSubmit={handleSubmit(onSumbit)}
				className={styles.postForm}
			>
				<div className="title">
					<p className={styles.text}>Post Title</p>
					<Controller
						name="title"
						control={control}
						render={({ field }) => (
							<TextField
								variant="outlined"
								label="Title"
								fullWidth
								error={!!errors.title}
								helperText={errors.title?.message ?? ''}
								{...field}
							/>
						)}
					/>
				</div>
				<div className="fileInput">
					<Button component="label" variant="outlined">
						Upload image for preview
						<input
							type="file"
							accept="image/*"
							onChange={onFileSelect}
							hidden
						/>
					</Button>
					<div className={styles.preview}>
						{!!previewImageSrc && (
							<div>
								<img
									src={previewImageSrc}
									alt="preview"
									width={600}
								/>
							</div>
						)}
					</div>
				</div>
				<div className="description">
					<p className={styles.text}>
						Short description of your Post
					</p>
					<Controller
						name="description"
						control={control}
						render={({ field }) => (
							<TextField
								variant="outlined"
								label="Short description"
								multiline
								rows={5}
								fullWidth
								error={!!errors.description}
								helperText={errors.description?.message ?? ''}
								{...field}
							/>
						)}
					/>
				</div>
				<div className="tags">
					<p className={styles.text}>Post tags</p>
					<TagsInput
						setValueFn={setValue}
						error={!!errors.tags}
						helperText={errors.tags?.message}
						{...register('tags')}
					/>
				</div>
				<div className="post">
					<p className={styles.text}>Post content</p>
					<ReactQuill
						theme="snow"
						value={delta}
						onChange={(e) => {
							const editor = quillEditor();
							setDelta(editor?.getContents());
						}}
						modules={modules}
						formats={formats}
						ref={quillRef}
					/>
				</div>
				<button type="submit" className={styles.button}>
					create post
				</button>
			</form>
		</div>
	);
}

export default CreatePostForm;
