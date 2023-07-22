import React from 'react';
import UserBanner from '../../components/userBanner/userBanner';
import { Outlet } from 'react-router';
import { Typography } from '@mui/material';

function UserPage() {
	return (
		<div>
			<UserBanner />
			{/** Outlet for change profile modal */}
			<Outlet />
		</div>
	);
}

export default UserPage;
