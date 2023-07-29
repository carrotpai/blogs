import * as React from 'react';

import styles from './minusIcon.module.scss';

const MinusIcon = () => {
	const [color, setColor] = React.useState('#3A3A3A');
	return (
		<svg
			onMouseOver={() => setColor('#6B6B6B')}
			onMouseOut={() => setColor('#3A3A3A')}
			xmlns="http://www.w3.org/2000/svg"
			width={20}
			height={20}
			fill="none"
		>
			<g clipPath="url(#a)">
				<mask
					id="b"
					width={20}
					height={20}
					x={0}
					y={0}
					maskUnits="userSpaceOnUse"
					style={{
						maskType: 'luminance',
					}}
				>
					<path fill="#fff" d="M0 0h20v20H0V0Z" />
				</mask>
				<g mask="url(#b)">
					<path
						fill={color}
						d="M10.625 9.375H14v1.25H6v-1.25h4.625ZM20 10A10 10 0 1 1 10 0a10.011 10.011 0 0 1 10 10Zm-1.25 0A8.75 8.75 0 1 0 10 18.75 8.76 8.76 0 0 0 18.75 10Z"
					/>
					<path
						fill="#fff"
						fillRule="evenodd"
						d="M18.75 10A8.75 8.75 0 1 0 10 18.75 8.76 8.76 0 0 0 18.75 10ZM14 9.375H6v1.25h8v-1.25Z"
						clipRule="evenodd"
					/>
				</g>
			</g>
			<defs>
				<clipPath id="a">
					<path fill="#fff" d="M0 0h20v20H0z" />
				</clipPath>
			</defs>
		</svg>
	);
};
export default MinusIcon;
