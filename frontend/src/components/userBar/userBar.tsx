import React from 'react';
import { Avatar } from '@mui/material';

import styles from './userBar.module.scss';
import { useNavigate } from 'react-router';
import { CDN } from '../../constants/cdn';
import { getRelativeTime, toLocalTime } from '../../utils/timeUtils/timeUtils';

type UserBarProps = {
	id: number;
	avatar?: string;
	username: string;
} & ConditionalUserBarProps;

type ConditionalUserBarProps =
	| { type: 'default' | 'secondary'; time?: never }
	| { type: 'comment'; time: string };

function UserBar({
	avatar,
	id,
	username,
	type = 'default',
	time,
}: UserBarProps) {
	const navigate = useNavigate();
	const getText = () => {
		if (type === 'comment') {
			return (
				<div className={styles.comment}>
					<p
						className={`${styles.content__text} ${styles.content__text_default}`}
						onClick={() => navigate(`/user/${id}`)}
					>
						{username}
					</p>
					<span className={styles.comment__separator}></span>
					<p className={styles.comment__time}>
						{getRelativeTime(toLocalTime(time ?? ''))}
					</p>
				</div>
			);
		} else {
			return (
				<p
					className={`${styles.content__text} ${
						{
							default: styles.content__text_default,
							secondary: styles.content__text_secondary,
						}[type]
					}`}
					onClick={() => navigate(`/user/${id}`)}
				>
					{username}
				</p>
			);
		}
	};

	return (
		<div className={styles.content}>
			<div
				className={styles.avatar}
				onClick={() => navigate(`/user/${id}`)}
			>
				<Avatar
					src={`${CDN}${avatar?.replaceAll('\\', '/')}`}
					alt={`${username} avatar`}
					sx={{ width: '36px', height: '36px' }}
				/>
			</div>
			{getText()}
		</div>
	);
}

export default UserBar;
