import { TextField as MuiTextFiled, styled } from '@mui/material';

const TextField = styled(MuiTextFiled)(({ theme }) => ({
	'& .MuiOutlinedInput-root': {
		[theme.breakpoints.down('md')]: {
			fontSize: 16,
		},
	},
	'& .MuiFormLabel-root': {
		[theme.breakpoints.down('md')]: {
			fontSize: 16,
		},
	},
}));

export default TextField;
