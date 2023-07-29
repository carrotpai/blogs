import { TextField, styled } from '@mui/material';

const CommentTextField = styled(TextField)(({ theme }) => ({
	'& .MuiInputLabel-outlined': {
		fontSize: '16px',
	},
	'& .MuiOutlinedInput-input': {
		fontSize: '16px',
	},
}));

export default CommentTextField;
