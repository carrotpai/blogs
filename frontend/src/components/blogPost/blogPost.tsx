import React, { useEffect } from 'react';
import ReactQuill from 'react-quill';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { axios } from '../../api/axios';
import UserBar from '../userBar/userBar';
import PostStats from '../postStats/postStats';
import TagList from '../tagList/tagList';
import { getRelativeTime, toLocalTime } from '../../utils/timeUtils/timeUtils';
import { getImageURL } from '../../utils/images/utils';
import { CDN } from '../../constants/cdn';
import Comments from '../comments/comments';
import { PostData } from '../../types/types';
import { useVoteChange } from '../../hooks/useVoteChange';

import styles from './blogPost.module.scss';
import quillStyles from './postQuill.module.scss';

function BlogPost() {
	const { id } = useParams();
	const postId = id ? +id : -1;

	const { data, isLoading } = useQuery<PostData>({
		queryFn: async () => {
			return (await axios.get(`post/${postId}`)).data;
		},
		queryKey: ['post', postId],
	});

	useEffect(() => console.log(data), [data]);

	const { upvoteFn, downvoteFn } = useVoteChange(postId, data, 'post');

	if (isLoading) {
		return <p>isLoading...</p>;
	}
	if (!data) {
		return 'not found';
	}
	return (
		<>
			<div className={styles.title}>
				<TagList tags={data.categories} />
				<p className={styles.title__text}>{data.title}</p>
				<div className={styles.title__author}>
					<UserBar
						id={data.authorId}
						avatar={getImageURL(data.author.avatar)}
						type="secondary"
						username={data.author.username}
					/>
					<span className={styles.time}>
						{getRelativeTime(toLocalTime(data.createdAt))}
					</span>
				</div>
				{data.previewImageCover && (
					<div className="title__cover">
						<img
							src={`${CDN}${getImageURL(data.previewImageCover)}`}
							alt={`post ${data.title}`}
						/>
					</div>
				)}
			</div>
			<div className={styles.content}>
				<ReactQuill
					modules={{
						toolbar: false,
					}}
					className={quillStyles.quill}
					readOnly
					defaultValue={JSON.parse(data.postContent.content)}
				/>
			</div>
			<div className={styles.buttons}>
				<PostStats
					status={data.status}
					upvoteFn={upvoteFn}
					downvoteFn={downvoteFn}
					rating={data.rating}
					commentCount={100}
				/>
			</div>
			<Comments key={'initComments'} isInit />
		</>
	);
}

export default BlogPost;
