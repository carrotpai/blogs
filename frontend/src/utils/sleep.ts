export const sleep = (time: number): Promise<void> =>
	new Promise((res, rej) => setTimeout(res, time));
