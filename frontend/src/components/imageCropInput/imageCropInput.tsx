import React, {
	RefObject,
	forwardRef,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import ReactCrop, {
	centerCrop,
	makeAspectCrop,
	type Crop,
	type PixelCrop,
} from 'react-image-crop';

import styles from './imageCropInput.module.scss';
import 'react-image-crop/dist/ReactCrop.css';

import { useDebounceEffect } from '../../hooks/useDebounceEffect';
import { canvasPreview } from '../../utils/imageCrop/canvasPreview';
import { Button } from '@mui/material';

type Ref = {
	canvasRef: RefObject<HTMLCanvasElement>;
	toDataString: (cb: BlobCallback) => void;
};

function centerAspectCrop(
	mediaWidth: number,
	mediaHeight: number,
	aspect: number
) {
	return centerCrop(
		makeAspectCrop(
			{
				unit: '%',
				width: 65,
			},
			aspect,
			mediaWidth,
			mediaHeight
		),
		mediaWidth,
		mediaHeight
	);
}

const ImageCropInput = forwardRef<Ref, {}>(function ImageCropInput(props, ref) {
	const [crop, setCrop] = useState<Crop>();
	const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
	const [imgSrc, setImgSrc] = useState('');
	const imgRef = useRef<HTMLImageElement>(null);
	const previewCanvasRef = useRef<HTMLCanvasElement>(null);

	useImperativeHandle(
		ref,
		() => ({
			canvasRef: previewCanvasRef,
			toDataString: (cb) => {
				if (!previewCanvasRef.current) {
					throw new Error('Crop canvas does not exist');
				}
				previewCanvasRef.current.toBlob(cb);
			},
		}),
		[]
	);

	function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
		const { width, height } = e.currentTarget;
		setCrop(centerAspectCrop(width, height, 1));
	}

	function onSelectFile(e: React.ChangeEvent<HTMLInputElement>) {
		if (e.target.files && e.target.files.length > 0) {
			setCrop(undefined);
			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setImgSrc(reader.result?.toString() || '');
			});
			reader.readAsDataURL(e.target.files[0]);
		}
	}

	useDebounceEffect(
		async () => {
			if (
				completedCrop?.width &&
				completedCrop?.height &&
				imgRef.current &&
				previewCanvasRef.current
			) {
				canvasPreview(
					imgRef.current,
					previewCanvasRef.current,
					completedCrop
				);
			}
		},
		100,
		[completedCrop]
	);

	return (
		<div className={styles.wrapper}>
			<div className="fileInput">
				<Button component="label" variant="outlined">
					Upload image
					<input
						type="file"
						accept="image/*"
						hidden
						onChange={onSelectFile}
					/>
				</Button>
			</div>
			<div className={styles.crop}>
				{!!imgSrc && (
					<ReactCrop
						locked
						keepSelection
						circularCrop
						crop={crop}
						onChange={(c) => setCrop(c)}
						onComplete={(c) => setCompletedCrop(c)}
					>
						<img
							src={imgSrc}
							ref={imgRef}
							onLoad={onImageLoad}
							width={500}
						/>
					</ReactCrop>
				)}
				{!!completedCrop && (
					<>
						<div>
							<canvas
								ref={previewCanvasRef}
								style={{
									display: 'none',
									borderRadius: '100%',
									border: '1px solid black',
									objectFit: 'contain',
									width: completedCrop.width,
									height: completedCrop.height,
								}}
							/>
						</div>
					</>
				)}
			</div>
		</div>
	);
});

export default ImageCropInput;
