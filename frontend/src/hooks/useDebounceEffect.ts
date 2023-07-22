import { useEffect, DependencyList } from 'react';

export function useDebounceEffect(
	fn: () => void,
	wait: number,
	deps?: DependencyList
) {
	useEffect(() => {
		const t = setTimeout(() => fn.apply(undefined, deps), wait);

		return () => {
			clearTimeout(t);
		};
	}, deps);
}
