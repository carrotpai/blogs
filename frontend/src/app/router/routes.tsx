import { Route, createRoutesFromElements } from 'react-router';
import RootLayout from '../rootLayout/rootLayout';
import MainPage from '../../pages/mainPage/mainPage';
import BlogsPage from '../../pages/blogsPage/blogsPage';
import Login from '../../pages/auth/login/login';
import Register from '../../pages/auth/register/register';
import UserPage from '../../pages/userPage/userPage';
import Modal from '../../components/modal/modal';
import AuthLayout from '../authLayout/authLayout';
import PagesLayout from '../pagesLayout/pagesLayout';
import ChangeProfileForm from '../../components/changeProfileForm/changeProfileForm';
import CreatePostPage from '../../pages/createPostPage/createPostPage';
import BlogPage from '../../pages/blogPage/blogPage';

const routes = createRoutesFromElements(
	<Route path="/" element={<RootLayout />}>
		<Route element={<PagesLayout />}>
			<Route index element={<MainPage />} />
			<Route path="blogs" element={<BlogsPage />} />
			<Route path="blog/:id" element={<BlogPage />}>
				{/* модалка */}
				<Route
					path="auth"
					element={
						<Modal isModalOpened>
							<p>Must be logged in</p>
						</Modal>
					}
				/>
			</Route>
			<Route path="createPost" element={<CreatePostPage />} />
			<Route path="user/:id" element={<UserPage />}>
				{/* модалка */}
				<Route
					path="change"
					element={
						<Modal isModalOpened>
							<ChangeProfileForm />
						</Modal>
					}
				/>
			</Route>
		</Route>
		<Route element={<AuthLayout />}>
			<Route path="login" element={<Login />} />
			<Route path="register" element={<Register />} />
		</Route>
	</Route>
);

export const modalsRoutes = createRoutesFromElements(
	<Route path="/">
		<Route
			path="user/:id"
			element={
				<Modal isModalOpened>
					<p>Modal With User</p>
				</Modal>
			}
		/>
	</Route>
);

export default routes;
