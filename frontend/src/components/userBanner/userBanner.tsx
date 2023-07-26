import React, { useEffect } from 'react';

import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { getRelativeTime } from '../../utils/timeUtils/timeUtils';
import { useUserStore } from '../../store/store';
import { axios } from '../../api/axios';

import testAvatar from '../../../img/testAvatar.png';
import styles from './userBanner.module.scss';
import { CDN } from '../../constants/cdn';
import { Avatar } from '@mui/material';

interface UserInfo {
	username: string;
	info?: string;
	description?: string;
	avatar?: string;
	stats: {
		rating: number | string;
		posts?: number | string;
		comments?: number | string;
		dateRegistred?: Date;
	};
}

function UserBanner() {
	const user = useUserStore(
		(state) => state.user,
		(a, b) => true
	);
	const { id: userId } = useParams();
	const isCurrentLoginAccount = user && userId && user.id === +userId;

	const { data, isLoading } = useQuery<UserInfo>({
		queryKey: ['user', userId],
		queryFn: async () => {
			return (await axios.get(`user/${userId}`)).data;
		},
		placeholderData: () => {
			if (isCurrentLoginAccount) {
				return {
					username: user ? user.username : '',
					info: user.info,
					description: user.description,
					stats: {
						rating: user.rating,
					},
				};
			}
			return undefined;
		},
		staleTime: 180 * 1000,
	});

	useEffect(() => {
		console.log(data);
	}, [data]);

	return (
		<div className={styles.banner}>
			<div className={styles.left}>
				<div className={styles.user}>
					<Avatar
						src={`${CDN}${data?.avatar}`}
						alt={`${data?.username} avatar`}
						sx={{ width: '64px', height: '64px' }}
					/>
					<div className="user__text">
						<p className={styles.user__username}>
							{data?.username}
						</p>
						<p className={styles.user__info}>{data?.info}</p>
					</div>
				</div>
				<div className={styles.description}>{data?.description}</div>
				<Link to={'change'}>Change profile</Link>
			</div>
			<div className={styles.right}>
				<div className="stats">
					<p className="posts">{`posts: ${0}`}</p>
					<p className="comments">{`comments: ${0}`}</p>
					<p className="rating">{`rating: ${0}`}</p>
				</div>
				<div className="socials">
					<p className="registred">{`date registred: ${getRelativeTime(
						new Date()
					)}`}</p>
				</div>
			</div>
		</div>
	);
}

export default UserBanner;
