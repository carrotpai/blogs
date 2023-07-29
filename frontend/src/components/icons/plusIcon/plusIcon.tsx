import * as React from 'react';
const PlusIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} fill="none">
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
					fill="#3A3A3A"
					d="M10.625 9.375H14v1.25h-3.375V14h-1.25v-3.375H6v-1.25h3.375V6h1.25v3.375ZM20 10A10 10 0 1 1 10 0a10.011 10.011 0 0 1 10 10Zm-1.25 0A8.75 8.75 0 1 0 10 18.75 8.76 8.76 0 0 0 18.75 10Z"
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
export default PlusIcon;
