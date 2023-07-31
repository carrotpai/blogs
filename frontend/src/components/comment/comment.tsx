import React, { useEffect, useState } from 'react';

import UserBar from '../userBar/userBar';
import VoteCount from '../voteCount/voteCount';
import Comments from '../comments/comments';

import commentIcon from '../../assets/comment.svg';
import editIcon from '../../assets/edit.svg';
import styles from './comment.module.scss';
import CreateCommentForm from '../createCommentForm/createCommentForm';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { axios, axiosPrivate } from '../../api/axios';
import { CommentData } from '../../types/types';

type CommentProps = {
	type: 'root' | 'reply';
	id: number;
	postId: number;
	currentPage?: number;

	user: {
		id: number;
		avatar?: string;
		username: string;
	};

	createdAt: string;
	text: string;
	rating: number;

	isFirst?: boolean;
	isLastCommentInPage?: boolean;
	isPaginationEnded?: boolean;
};

function Comment({
	type,
	id,
	postId,
	user,
	text,
	rating,
	createdAt,
	isFirst,
	isLastCommentInPage,
	isPaginationEnded,
}: CommentProps) {
	const [startChildrenFetch, setStartChildrenFetch] = useState(false);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [userAddedReplies, setUserAddedReplies] = useState(0);

	const queryClient = useQueryClient();

	const { data: repliesCount, isLoading } = useQuery({
		queryFn: async () => {
			const data = (await axios.get(`comments/count/forcomment/${id}`))
				.data;
			if (!data) {
				setStartChildrenFetch(false);
			}
			return data;
		},
		queryKey: ['repliesCount', id],
		staleTime: 60 * 1000,
	});

	const authorStyles = () => {
		let style: string = styles.comment__author;
		if (type === 'reply') {
			style = style.concat(` ${styles.comment__author_nested}`);
			if (isFirst) {
				style = style.concat(` ${styles.comment__author_first}`);
			}
		}
		return style;
	};

	const commentContentStyles = () => {
		let style: string = styles.comment__content;
		if (isLastCommentInPage) {
			style = style.concat(` ${styles.comment__content_lastIngPage}`);
		}
		if (isPaginationEnded && isLastCommentInPage && repliesCount === 0) {
			style = style.concat(` ${styles.comment__content_pagEnd}`);
		}
		if (repliesCount === 0) {
			style = style.concat(` ${styles.comment__content_noReplies}`);
		}
		return style;
	};

	const commentQueryFn = async (
		isUserAddedComment: boolean,
		page?: number
	) => {
		let res: [CommentData[], number, number];
		if (isUserAddedComment) {
			res = (
				await axiosPrivate.get<[CommentData[], number, number]>(
					`comments/forcomment/withuser/${id}?page=${page}`
				)
			).data;
		} else {
			res = (
				await axios.get<[CommentData[], number, number]>(
					`comments/forcomment/${id}?page=${page}`
				)
			).data;
		}
		return res;
	};

	return (
		<div className={`${styles.comment}`}>
			<div className={authorStyles()}>
				<UserBar
					id={user.id}
					avatar={user.avatar}
					username={user.username}
					time={createdAt}
					type="comment"
				/>
			</div>
			<div className={commentContentStyles()}>
				<div className={styles.comment__contentWrapper}>
					<p className={styles.comment__text}>{text}</p>
					<div className={styles.interact}>
						<div className="vote">
							<VoteCount />
						</div>
						<div className={styles.reply}>
							<button
								className={styles.button}
								type="button"
								onClick={() => setIsFormOpen((state) => !state)}
							>
								<img src={commentIcon} alt="comment icon" />
								<span className={styles.button__text}>
									reply
								</span>
							</button>
						</div>
						<div className="edit">
							<button type="button" className={styles.button}>
								<img src={editIcon} alt="edit icon" />
								<span className={styles.button__text}>
									edit
								</span>
							</button>
						</div>
					</div>
					<div className="form">
						{isFormOpen && (
							<CreateCommentForm
								onClose={() => {
									setIsFormOpen(false);
								}}
								formStatus={isFormOpen}
								parentCommentId={id}
								postId={postId}
								type="reply"
								onEntryAdded={() => {
									setStartChildrenFetch(true);
									setUserAddedReplies((count) => count + 1);
									queryClient.invalidateQueries([
										'repliesCount',
										id,
									]);
								}}
							/>
						)}
					</div>
					<div className={styles.comment__children}>
						<Comments
							getComments={commentQueryFn}
							parentCommentId={id}
							postId={postId}
							type="reply"
							key={`comments-${id}-rep-${repliesCount}`}
							totalComments={repliesCount}
							startFetch={startChildrenFetch}
							userAddedComments={userAddedReplies}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Comment;
