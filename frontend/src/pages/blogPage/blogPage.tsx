import React from "react";
import BlogPost from "../../components/blogPost/blogPost";

import styles from "./blogPage.module.scss";

function BlogPage() {
	return (
		<div className={styles.content}>
			<BlogPost />
		</div>
	);
}

export default BlogPage;
