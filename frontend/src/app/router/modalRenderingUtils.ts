import { RouteObject, matchRoutes, renderMatches } from 'react-router';

export const renderBackgroundPage = (
	routes: RouteObject[],
	location: string | Partial<Location>
): React.ReactElement | null => {
	const route = matchRoutes(routes, location);
	route?.shift();
	const backgroundPage = renderMatches(route);
	return backgroundPage;
};

export const renderModal = (
	routes: RouteObject[],
	location: string | Partial<Location>
): React.ReactElement | null => {
	const route = matchRoutes(routes, location);
	/* route?.shift(); */
	const backgroundPage = renderMatches(route);
	return backgroundPage;
};
