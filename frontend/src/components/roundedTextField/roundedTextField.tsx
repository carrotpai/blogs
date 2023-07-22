import { TextField, styled } from '@mui/material';

const RoundedTextField = styled(TextField)(({ theme }) => ({
	'& .MuiOutlinedInput-root': {
		borderRadius: '8px',
	},
	'& .MuiInputBase-input': {
		padding: '12px 14px',
	},
	'& .MuiInputLabel-outlined': {
		[theme.breakpoints.down('md')]: {
			fontSize: '14px',
		},
		fontSize: '16px',
	},
}));

export default RoundedTextField;
