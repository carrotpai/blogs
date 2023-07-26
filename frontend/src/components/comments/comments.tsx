import React, { useState } from 'react';
import UserBar from '../userBar/userBar';
import Comment from '../comment/comment';

import styles from './comments.module.scss';

interface IComment {
	id: number;
	user: {
		id: number;
		avatar?: string;
		username: string;
	};
	text: string;
	rating: number;
}

const testCommentary: IComment[] = [
	{
		id: 1,
		user: { id: 1, username: 'test' },
		text: 'Honestly YTA\n\nI don’t understand why you couldn’t take your kids, it’s their grandparents who were in critical condition after all.\n\nAnd what would have happened if he already left?',
		rating: 123,
	},
	{
		id: 2,
		user: { id: 1, username: 'test' },
		text: 'Honestly YTA\nI don’t understand why you couldn’t take your kids, it’s their grandparents who were in critical condition after all.\nAnd what would have happened if he already left?',
		rating: 123,
	},
	{
		id: 3,
		user: { id: 1, username: 'test' },
		text: 'Honestly YTA\nI don’t understand why you couldn’t take your kids, it’s their grandparents who were in critical condition after all.\nAnd what would have happened if he already left?',
		rating: 123,
	},
	{
		id: 4,
		user: { id: 1, username: 'test' },
		text: 'Honestly YTA\nI don’t understand why you couldn’t take your kids, it’s their grandparents who were in critical condition after all.\nAnd what would have happened if he already left?',
		rating: 123,
	},
	{
		id: 5,
		user: { id: 1, username: 'test' },
		text: 'Honestly YTA\nI don’t understand why you couldn’t take your kids, it’s their grandparents who were in critical condition after all.\nAnd what would have happened if he already left?',
		rating: 123,
	},
	{
		id: 6,
		user: { id: 1, username: 'test' },
		text: 'Honestly YTA\nI don’t understand why you couldn’t take your kids, it’s their grandparents who were in critical condition after all.\nAnd what would have happened if he already left?',
		rating: 123,
	},
	{
		id: 7,
		user: { id: 1, username: 'test' },
		text: 'Honestly YTA\nI don’t understand why you couldn’t take your kids, it’s their grandparents who were in critical condition after all.\nAnd what would have happened if he already left?',
		rating: 123,
	},
];

interface CommentsProps {
	isInit?: boolean;
	isNested?: boolean;
	postId?: number;
	commentId?: number;
	getComments?: (page: number) => Array<IComment>;
	remaindedCommentsCount?: number;
}

function Comments({ isInit, isNested }: CommentsProps) {
	const TEMP_CREATED_TIME = '2023-07-25 12:48:47.525';
	const [isDraw, setIsDraw] = useState(false);
	const isMoreCommentsAvailable = true;
	const isPaginationEnded = false;

	return (
		<div className={styles.container}>
			{!isDraw && isMoreCommentsAvailable && (
				<button type="button" onClick={() => setIsDraw(true)}>
					Read More
				</button>
			)}

			{isDraw &&
				testCommentary.map((comment, ind) => (
					<Comment
						id={comment.id}
						key={comment.id}
						user={comment.user}
						text={comment.text}
						rating={comment.rating}
						createdAt={TEMP_CREATED_TIME}
						isNested={isNested}
						isLastCommentInPage={testCommentary.length - 1 === ind}
						isPaginationEnded={isPaginationEnded}
					/>
				))}
			{isDraw && isMoreCommentsAvailable && (
				<button
					className={styles.moreCommentsButton}
					type="button"
					onClick={() => setIsDraw(true)}
				>
					Read More
				</button>
			)}
		</div>
	);
}

export default Comments;
