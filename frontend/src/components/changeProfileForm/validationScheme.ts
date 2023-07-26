import * as yup from 'yup';
import { ProfileFormData } from '../../types/types';

const schema = yup.object().shape(
	{
		username: yup.string().required(),
		info: yup.string().optional(),
		description: yup.string().optional(),
		password: yup.string().when(['newPassword', 'newPasswordRepeat'], {
			is: (newPassword: string, newPasswordRepeat: string) => {
				return Boolean(newPassword || newPasswordRepeat);
			},
			then: (schema) => schema.required(),
		}),
		newPassword: yup.string().test({
			name: 'test password',
			message:
				'password must have minimum length of 8 characters and containt at least 1 capital letter and 1 number',
			test: (value) => {
				if (!value) {
					return true;
				}
				return Boolean(
					value.match(
						/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/
					)
				);
			},
		}),
		newPasswordRepeat: yup
			.string()
			.optional()
			.test('equal', "Passwords don't match", function (value) {
				const passRef = yup.ref('newPassword');
				return value === this.resolve(passRef);
			}),
	},
	[
		['password', 'newPassword'],
		['password', 'newPasswordRepeat'],
		['newPassword', 'newPasswordRepeat'],
	]
);

export default schema as yup.ObjectSchema<Partial<ProfileFormData>, any>;
