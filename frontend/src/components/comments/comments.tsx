import React, { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import Comment from '../comment/comment';
import CommentsHeader from '../commentsHeader/commentsHeader';
import { MinusIcon, PlusIcon } from '../icons';
import { CommentData } from '../../types/types';

import styles from './comments.module.scss';

const pageSize = 2;

type CommentsProps = {
	totalComments?: number;
	postId: number;
	getComments: (
		AddedStatus: boolean,
		page: number
	) => Promise<[CommentData[], number, number]>;
	userAddedComments?: number;
} & CondtionalCommentsProps;

type CondtionalCommentsProps =
	| {
			type: 'root';
			parentCommentId?: never;
			startFetch?: never;
			onCommentAdded: () => void;
	  }
	| {
			type: 'reply';
			parentCommentId: number;
			startFetch?: boolean;
			onCommentAdded?: never;
	  };

function Comments({
	type,
	getComments,
	postId,
	parentCommentId,
	totalComments = -1,
	startFetch,
	onCommentAdded,
	userAddedComments,
}: CommentsProps) {
	//-1 - инит значение, показывающее, что данные о количестве комментариев еще не получены
	const prevCommentsCount = useRef<number>(totalComments);
	const countCachedComments = useRef<number>(0);
	/* const commentsRemain = useRef<number>(totalComments); */
	const [commentsRemain, setCommentsRemain] = useState(totalComments);
	const [startFetching, setStartFetching] = useState(!!startFetch);
	const [isUserAdded, setIsUserAdded] = useState(userAddedComments !== 0);

	const TEMP_CREATED_TIME = '2023-07-25 12:48:47.525';
	const queryClient = useQueryClient();

	useEffect(() => {
		if (userAddedComments !== 0) {
			setIsUserAdded(true);
			queryClient.invalidateQueries(getQueryKey());
		}
	}, [userAddedComments]);

	const getQueryKey = (): any => {
		let key;
		if (type === 'root')
			key = ['notNestedComment', { postId, isUserAdded }];
		else {
			key = [
				'nestedComment',
				{ parentCommentId: parentCommentId ?? -1, isUserAdded },
			];
		}
		return key;
	};

	const isFirstLoad = (): boolean => {
		return (
			startFetching &&
			isFetching &&
			!isFetchingNextPage &&
			!data?.pages.length
		);
	};

	const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
		useInfiniteQuery({
			queryFn: async ({ pageParam = 1, queryKey }) => {
				const [_key, { _id, isUserAdded }] = queryKey;
				const data = await getComments(isUserAdded, pageParam);
				return data;
			},
			queryKey: getQueryKey(),
			getNextPageParam: (lastPage) => {
				if (!lastPage) return;
				if (commentsRemain <= 0) return;
				//nextPage приходит с сервера
				const [, , nextPage] = lastPage;
				return nextPage;
			},
			staleTime: 60 * 1000 * 10,
			enabled: startFetching,
		});

	useEffect(() => {
		if (data?.pages.length) {
			const count = data.pages[data.pages.length - 1][1];
			const pageParam: number =
				(data.pageParams[data.pageParams.length - 1] as number) ?? 1;
			if (
				prevCommentsCount.current != -1 &&
				prevCommentsCount.current != count
			) {
				//если произошло расхождение в общем количестве комментариев,
				//произвести рефетч всей пагинации (для 1 блока)
				queryClient.invalidateQueries({
					queryKey: getQueryKey(),
				});
				//рефетч для общего количества комментариев
				queryClient.invalidateQueries({
					queryKey: ['postCommentsCount'],
				});
			}
			prevCommentsCount.current = count;
			if (
				pageParam * pageSize < countCachedComments.current &&
				countCachedComments.current !== 0
			) {
				setCommentsRemain(count - countCachedComments.current);
			} else {
				console.log(`new: ${count - pageParam * pageSize}`);
				setCommentsRemain(count - pageParam * pageSize);
			}
		}
	}, [data]);

	useEffect(() => {
		if (type === 'root') {
			setStartFetching(true);
			return;
		}
	}, []);

	return (
		<>
			{type === 'root' && (
				<CommentsHeader
					onCommentAdded={onCommentAdded}
					postId={postId}
				/>
			)}
			<div className={styles.container}>
				{type === 'reply' && prevCommentsCount.current > 0 && (
					<button
						className={`${styles.readMoreButton} ${
							startFetching && styles.readMoreButton_close
						}`}
						type="button"
						onClick={() => {
							setStartFetching((state) => !state);
							if (startFetching) {
								setCommentsRemain(prevCommentsCount.current);
								countCachedComments.current =
									(data?.pageParams.length ?? 0) * pageSize;
							} else {
								setCommentsRemain(
									prevCommentsCount.current -
										countCachedComments.current
								);
								queryClient.invalidateQueries({
									queryKey: getQueryKey(),
								});
							}
						}}
					>
						{startFetching ? <MinusIcon /> : <PlusIcon />}
						{!startFetching && (
							<p className={styles.readMoreButton__text}>
								{`${commentsRemain} comments`}
							</p>
						)}
					</button>
				)}

				<div className="comments">
					{isFirstLoad() && (
						<p className={styles.loadingText}>loading...</p>
					)}
					<>
						{startFetching && data?.pages.length
							? data.pages.map((group, i) => {
									if (!group) return;
									const comments = group[0];

									return (
										<React.Fragment key={i}>
											{comments.map((comment, ind) => {
												const commentProps = {
													id: comment.id,
													postId: postId,
													key: comment.id,
													user: comment.user,
													text: comment.text,
													rating: comment.rating,
													createdAt:
														TEMP_CREATED_TIME,
													isFirst:
														i === 0 && ind === 0,
													isLastCommentInPage:
														data.pages.length -
															1 ===
															i &&
														comments.length - 1 ===
															ind,
													isPaginationEnded:
														!hasNextPage,
												};
												return (
													<Comment
														type={type}
														{...commentProps}
													/>
												);
											})}
										</React.Fragment>
									);
							  })
							: type === 'root' &&
							  !isFetching && (
									<div className={styles.hasNotCommentsText}>
										No comments yet
									</div>
							  )}
					</>
				</div>
				{startFetching && hasNextPage && (
					<button
						className={`${styles.commentsPaginationButton} ${
							type === 'root' &&
							styles.commentsPaginationButton_root
						}`}
						type="button"
						onClick={() => {
							setStartFetching(true);
							fetchNextPage();
						}}
					>
						<PlusIcon />
						<p className={styles.commentsPaginationButton__text}>
							{isFetchingNextPage
								? 'loading...'
								: `${commentsRemain} comments more in this thread`}
						</p>
					</button>
				)}
			</div>
		</>
	);
}

export default Comments;
