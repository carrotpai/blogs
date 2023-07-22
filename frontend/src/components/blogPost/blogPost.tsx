import React from "react";
import ReactQuill from "react-quill";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";

import { axios } from "../../api/axios";
import UserBar from "../userBar/userBar";
import PostStats from "../postStats/postStats";
import TagList from "../tagList/tagList";
import { getRelativeTime, toLocalTime } from "../../utils/timeUtils/timeUtils";

import styles from "./blogPost.module.scss";
import quillStyles from "./postQuill.module.scss";

interface PostData {
	title: string;
	shortDescription: string;
	rating: number;
	author: {
		id: number;
		username: string;
	};
	postContent: {
		content: string;
	};
	categories: Array<{ category: { name: string } }>;
	createdAt: string;
}

function BlogPost() {
	const { id } = useParams();
	const { data, isLoading } = useQuery<PostData>({
		queryFn: async () => {
			return (await axios.get(`post/${id}`)).data;
		},
		queryKey: ["post", { id: id }],
	});

	if (!data || isLoading) {
		return <p>isLoading...</p>;
	}
	return (
		<>
			<div className={styles.title}>
				<TagList tags={data.categories} />
				<p className={styles.title__text}>{data.title}</p>
				<div className={styles.title__author}>
					<UserBar
						id={data.author.id}
						type='secondary'
						username={data.author.username}
					/>
					<span className={styles.time}>
						{getRelativeTime(toLocalTime(data.createdAt))}
					</span>
				</div>
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
				<PostStats rating={data.rating} commentCount={172} />
			</div>
		</>
	);
}

export default BlogPost;
