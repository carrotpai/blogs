export const debounce = (time: number, fn: (args: unknown) => any) => {
	let timer: ReturnType<typeof setTimeout>;
	function debouncer(...args: any[]) {
		clearTimeout(timer);
		timer = setTimeout(() => fn(args), time);
	}

	debouncer.clear = () => {
		clearTimeout(timer);
	};

	return debouncer;
};
