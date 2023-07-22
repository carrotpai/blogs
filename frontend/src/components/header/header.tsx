import React from "react";

import logo from "../../../img/Logo.png";

import styles from "./header.module.scss";
import HeaderAuth from "../headerAuth/headerAuth";
import { NavLink } from "react-router-dom";

function Header() {
	return (
		<header className={styles.header}>
			<div className={""}>
				<img src={logo} alt='logo meta blog' />
			</div>
			<nav className={styles.navgiation}>
				<NavLink
					to={"/"}
					className={({ isActive }) =>
						isActive ? `${styles.activeLink} ${styles.link}` : styles.link
					}
				>
					Home
				</NavLink>
				<NavLink
					to={"132342352352"}
					className={({ isActive }) =>
						isActive ? `${styles.activeLink} ${styles.link}` : styles.link
					}
				>
					Blogs
				</NavLink>
				<NavLink
					to={"/createPost"}
					className={({ isActive }) =>
						isActive ? `${styles.activeLink} ${styles.link}` : styles.link
					}
				>
					Create post
				</NavLink>
			</nav>
			<div className='left'>
				<HeaderAuth />
				<div className='theme'></div>
			</div>
		</header>
	);
}

export default Header;
