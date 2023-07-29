import {
	FormControl,
	FormHelperText,
	InputLabel,
	MenuItem,
	OutlinedInput,
	Select,
	SelectChangeEvent,
	TextField,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React, { useRef, useState } from 'react';

import { axios } from '../../api/axios';

import styles from './tagsInput.module.scss';
import PostTag from '../postTag/postTag';
import { produce } from 'immer';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

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
	error?: boolean | undefined;
	helperText?: React.ReactNode;
}

const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(function (
	{ error, helperText },
	ref
) {
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

	const handleSelectChange = (e: SelectChangeEvent<number[]>) => {
		const { value: newValues } = e.target;
		if (typeof newValues === 'string') {
			return;
		}
		//флаг показывающий что произошло удаление тега с помощью меню селекта
		const isDeleted = tagsId.length > newValues.length;
		if (isDeleted) {
			//удаленный элемент может быть только 1
			const [deletedId] = tagsId.filter(
				(id) => !newValues.find((value) => value === id)
			);
			deleteTag(deletedId);
			return;
		}

		let newTag: Tag;
		let newTagId: number;

		//в цикле ищем новый добавленый тег (он может быть только 1)
		newValues.forEach((val) => {
			const tagId = val;
			const tagName = tagsData[tagId];
			//если тег был уже добавлен, ничего не делать
			if (tagsStatus[tagId]) {
				return;
			}
			//отметить тег как добавленный
			tagsStatus[tagId] = true;
			newTag = { id: tagId, name: tagName };
			newTagId = tagId;
		});

		setTags(
			produce((tags) => {
				tags.push(newTag);
			})
		);
		setTagsId(
			produce((tagIds) => {
				tagIds.push(newTagId);
			})
		);
	};

	const deleteTag = (id: number) => {
		tagsStatus[id] = false;
		setTags((tags) => tags.filter((item) => item.id !== id));
		setTagsId((tagsIds) => tagsIds.filter((item) => item !== id));
	};
	return (
		<div>
			<div className={styles.selectWrapper}>
				<FormControl error={error} fullWidth>
					<InputLabel id="select-tags">choose tags</InputLabel>
					<Select
						ref={ref}
						id="tags"
						multiple
						autoComplete="off"
						labelId="select-tags"
						onChange={handleSelectChange}
						input={<OutlinedInput label="choose tags" />}
						MenuProps={MenuProps}
						value={tagsId}
					>
						{data.map((item) => (
							<MenuItem
								key={`menuItem${item.id}`}
								value={item.id}
							>
								{item.name}
							</MenuItem>
						))}
					</Select>
					{error && <FormHelperText>{helperText}</FormHelperText>}
				</FormControl>
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
		</div>
	);
});

export default TagsInput;
