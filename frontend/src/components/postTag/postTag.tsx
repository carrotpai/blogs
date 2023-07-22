import React from 'react';

import styles from './postTag.module.scss';

interface PostTagProps {
	type?: 'form' | 'default';
	id?: number;
	name: string;
	onDelete?: (id: number) => void;
}

function PostTag({ id = -1, name, type = 'default', onDelete }: PostTagProps) {
	return (
		<div className={styles.postTag}>
			<span className={styles.postTag__text}>{name}</span>
			{type === 'form' && onDelete && (
				<button
					className={styles.postTag__button}
					type="button"
					onClick={() => onDelete(id)}
				>
					<span className={styles.cross}></span>
				</button>
			)}
		</div>
	);
}

export default PostTag;
