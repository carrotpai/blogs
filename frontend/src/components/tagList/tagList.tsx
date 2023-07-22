import React from 'react';

import PostTag from '../postTag/postTag';

import styles from './tagList.module.scss';

interface TagListProps {
	tags: Array<{ category: { name: string } }>;
}

function TagList({ tags }: TagListProps) {
	return (
		<div className={styles.list}>
			{tags.map((tag) => (
				<PostTag name={tag.category.name} />
			))}
		</div>
	);
}

export default TagList;
