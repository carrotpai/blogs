import { useEffect, DependencyList } from 'react';

export function useDebounceEffect(
	fn: () => void,
	wait: number,
	deps?: DependencyList
) {
	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		//@ts-ignore
		// eslint-disable-next-line prefer-spread
		const t = setTimeout(() => fn.apply(undefined, deps), wait);

		return () => {
			clearTimeout(t);
		};
	}, deps);
}
