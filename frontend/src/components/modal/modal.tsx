import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import ModalOverlay from './modalOverlay/modalOverlay';

import styles from './modal.module.scss';
import { useNavigate } from 'react-router';

const modalRoot = document.getElementById('modals') as HTMLElement;

interface IPropsModal {
	children: React.ReactNode;
	className?: string;
	isModalOpened: boolean;
}

function Modal({ children, isModalOpened, className }: IPropsModal) {
	const navigate = useNavigate();
	const onClose = () => navigate(-1);
	useEffect(() => {
		function closeByEscape(evt: KeyboardEvent) {
			if (evt.key === 'Escape') onClose();
		}

		if (isModalOpened) {
			document.addEventListener('keydown', closeByEscape);
			return () => {
				document.removeEventListener('keydown', closeByEscape);
			};
		}

		return undefined;
	}, [isModalOpened, onClose]);

	return ReactDOM.createPortal(
		<div className={`${styles.root}`}>
			<div className={`${styles.container} ${className ?? ''}`}>
				<button
					className={styles.closeButton}
					onClick={onClose}
				></button>
				{children}
			</div>
			<ModalOverlay handleCloseAction={onClose} />
		</div>,
		modalRoot
	);
}

export default Modal;
