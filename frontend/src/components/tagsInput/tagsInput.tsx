import { MenuItem, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';
import { type UseFormSetValue } from 'react-hook-form';
import { produce } from 'immer';

import { axios } from '../../api/axios';

import styles from './tagsInput.module.scss';
import PostTag from '../postTag/postTag';

interface Tag {
	id: number;
	name: string;
}

interface TagsObject {
	[index: number]: string;
}

interface TagsStatus {
	[index: number]: boolean;
}

interface TagsInputProps {
	setValueFn: UseFormSetValue<any>;
	error?: boolean | undefined;
	helperText?: React.ReactNode;
}

const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(function (
	{ setValueFn, error, helperText },
	ref
) {
	//теги + id выбранных тегов
	const [tags, setTags] = useState<Tag[]>([]);
	const [tagsId, setTagsId] = useState<number[]>([]);

	//хранение информации о тегах (чтобы не делать лишние .find по массиву категорий)
	const tagsData = useRef<TagsObject>({}).current;
	const tagsStatus = useRef<TagsStatus>({}).current;

	const { data = [] } = useQuery<Tag[]>({
		queryKey: ['categories'],
		queryFn: async () => {
			const result = await axios.get<Tag[]>('category');
			result.data.forEach((item) => {
				tagsData[item.id] = item.name;
			});
			return result.data;
		},
	});

	const handleSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const tagId = +e.target.value;
		const tagName = tagsData[tagId];
		//если тег был уже добавлен, ничего не делать
		if (tagsStatus[tagId]) {
			return;
		}
		//отметить тег как добавленный
		tagsStatus[tagId] = true;

		//обновить стейт
		setTags(
			produce<Tag[]>((tags) => {
				tags.push({ id: tagId, name: tagName });
			})
		);

		//обновить стейт + изменить стейт react-hooks-form (setValueFn)
		setTagsId((tagsIds) => {
			const getNewIds = produce<number[]>((tagsIds) => {
				tagsIds.push(tagId);
			});
			const newTagsIds = getNewIds(tagsIds);
			setValueFn('tags', newTagsIds, { shouldValidate: true });
			return newTagsIds;
		});
	};

	const deleteTag = (id: number) => {
		tagsStatus[id] = false;
		setTags((tags) => tags.filter((item) => item.id !== id));
		setTagsId((tagsIds) => {
			const newTagsIds = tagsIds.filter((item) => item !== id);
			setValueFn('tags', newTagsIds, { shouldValidate: true });
			return newTagsIds;
		});
	};
	return (
		<div>
			<div className={styles.selectWrapper}>
				<TextField
					select
					label="choose tags"
					onChange={handleSelectChange}
					defaultValue={''}
					fullWidth
					error={error}
					helperText={helperText}
				>
					{data.map((item) => (
						<MenuItem key={`menuItem${item.id}`} value={item.id}>
							{item.name}
						</MenuItem>
					))}
				</TextField>
			</div>
			<div className={styles.tags}>
				{tags.map((tag) => (
					<PostTag
						type="form"
						key={`postTag${tag.id}`}
						id={tag.id}
						name={tag.name}
						onDelete={deleteTag}
					/>
				))}
			</div>
			<input hidden ref={ref} />
		</div>
	);
});

export default TagsInput;
