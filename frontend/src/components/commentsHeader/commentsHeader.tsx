import React, { useState } from 'react';
import { FormControl, MenuItem, Select } from '@mui/material';
import CreateCommentForm from '../createCommentForm/createCommentForm';

import plusIcon from '../../assets/plus.svg';
import styles from './commentsHeader.module.scss';

interface CommentsHeaderProps {
	postId: number;
}

function CommentsHeader({ postId }: CommentsHeaderProps) {
	const [isFormActive, setIsFormActive] = useState(false);
	return (
		<div className={styles.header}>
			<div className={styles.header__separator}>
				<p className={styles.header__count}>{`${162} comments`}</p>
			</div>
			<div className={styles.panel}>
				<div className={styles.filter}>
					<p className={styles.filter__text}>Sort by</p>
					<FormControl sx={{ width: '150px' }}>
						<Select
							multiline
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							onChange={(e) => console.log(e.target.value)}
							defaultValue={'popular'}
							size="small"
						>
							<MenuItem value={'popular'}>Popular</MenuItem>
							<MenuItem value={'new'}>New</MenuItem>
						</Select>
					</FormControl>
				</div>
				{!isFormActive && (
					<button
						className={styles.addCommentButton}
						type="button"
						onClick={() => setIsFormActive(!isFormActive)}
					>
						<img
							className="plusIcon"
							src={plusIcon}
							alt="plus icon"
						/>
						<span className={styles.addCommentButton__text}>
							Add comment
						</span>
					</button>
				)}
			</div>
			{isFormActive && (
				<CreateCommentForm
					postId={postId}
					type="comment"
					onClose={() => setIsFormActive(false)}
				/>
			)}
		</div>
	);
}

export default CommentsHeader;
