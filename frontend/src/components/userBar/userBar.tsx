import React from "react";
import { Avatar } from "@mui/material";

import styles from "./userBar.module.scss";
import { useNavigate } from "react-router";

interface UserBarProps {
	id: number;
	avatar?: string;
	username: string;
	type?: "default" | "secondary";
}

function UserBar({ avatar, id, username, type = "default" }: UserBarProps) {
	const navigate = useNavigate();
	return (
		<div className={styles.content}>
			<div className={styles.avatar} onClick={() => navigate(`user/${id}`)}>
				<Avatar
					src={avatar}
					alt={`${username} avatar`}
					sx={{ width: "36px", height: "36px" }}
				/>
			</div>
			<p
				className={`${styles.content__text} ${
					{
						default: styles.content__text_default,
						secondary: styles.content__text_secondary,
					}[type]
				}`}
				onClick={() => navigate(`user/${id}`)}
			>
				{username}
			</p>
		</div>
	);
}

export default UserBar;
