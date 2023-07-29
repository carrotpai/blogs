import React, { useEffect, useRef, useState } from 'react';

import Comment from '../comment/comment';
import CommentsHeader from '../commentsHeader/commentsHeader';

import styles from './comments.module.scss';
import { MinusIcon, PlusIcon } from '../icons';
import { CommentData } from '../../types/types';
import {
	useInfiniteQuery,
	useQuery,
	useQueryClient,
} from '@tanstack/react-query';

interface CommentsProps {
	totalComments?: number;
	isRootComments?: boolean;
	isNested?: boolean;
	postId: number;
	parentCommentId?: number;
	getComments?: (page?: number) => Promise<[CommentData[], number]>;
}

function Comments({
	isRootComments,
	isNested,
	getComments,
	postId,
	parentCommentId,
	totalComments = 0,
}: CommentsProps) {
	const commentsRemain = useRef<number>(totalComments);
	const currentPage = useRef<number>(1);
	const TEMP_CREATED_TIME = '2023-07-25 12:48:47.525';
	const [startFetching, setStartFetching] = useState(false);

	const queryClient = useQueryClient();

	const getQueryKey = (): (string | number)[] => {
		let key;
		if (isRootComments) key = ['notNestedComment', postId];
		else {
			key = ['nestedComment', parentCommentId ?? -1];
		}
		return key;
	};

	const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
		useInfiniteQuery({
			queryFn: async ({ pageParam = 1 }) => {
				if (getComments) {
					const data = await getComments();
					const [_, count] = data;
					commentsRemain.current = count - pageParam * 25;
					/* console.log(data); */
					return data;
				}
				return;
			},
			queryKey: getQueryKey(),
			getNextPageParam: (lastPage) => {
				if (!lastPage) return;
				if (commentsRemain.current <= 0) return;
				currentPage.current += 1;
				return currentPage.current;
			},
			staleTime: 60 * 1000,
			enabled: startFetching,
		});

	useEffect(() => {
		if (isRootComments) {
			setStartFetching(true);
		}
	}, []);

	/* useEffect(() => {
		commentsRemain.current = totalComments;
	}, [totalComments]); */

	return (
		<>
			{isRootComments && <CommentsHeader postId={postId} />}
			<div className={styles.container}>
				{!isRootComments && totalComments > 0 && (
					<button
						className={`${styles.readMoreButton} ${
							startFetching && styles.readMoreButton_close
						}`}
						type="button"
						onClick={() => {
							setStartFetching((state) => !state);
							if (startFetching) {
								commentsRemain.current = totalComments;
							} else {
								queryClient.invalidateQueries({
									queryKey: getQueryKey(),
								});
							}
						}}
					>
						{startFetching ? <MinusIcon /> : <PlusIcon />}
						{!startFetching && (
							<p className={styles.readMoreButton__text}>
								{`${commentsRemain.current} comments`}
							</p>
						)}
					</button>
				)}

				<div className="comments">
					{startFetching && data?.pages.length
						? data.pages.map((group, i) => {
								if (!group) return;
								const comments = group[0];
								return (
									//возможно из-за ключа все может навернуться
									<React.Fragment key={i}>
										{comments.map((comment, ind) => (
											<Comment
												id={comment.id}
												postId={postId}
												key={comment.id}
												user={comment.user}
												text={comment.text}
												rating={comment.rating}
												createdAt={TEMP_CREATED_TIME}
												isFirst={ind === 0}
												isNested={isNested}
												isLastCommentInPage={
													comments.length - 1 === ind
												}
												isPaginationEnded={!hasNextPage}
											/>
										))}
									</React.Fragment>
								);
						  })
						: isRootComments && <div>No comments yet</div>}
				</div>
				{startFetching && hasNextPage && (
					<button
						className={styles.commentsPaginationButton}
						type="button"
						onClick={() => setStartFetching(true)}
					>
						<PlusIcon />
						<p
							className={styles.commentsPaginationButton__text}
						>{`${commentsRemain.current} comments more in this thread`}</p>
					</button>
				)}
			</div>
		</>
	);
}

export default Comments;
