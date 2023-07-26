import { useCallback, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { debounce } from '../utils/debounce';
import { axiosPrivate } from '../api/axios';
import { PostData } from '../types/types';

export function useVoteChange(id: number, data: any, type: 'post' | 'comment') {
	const queryClient = useQueryClient();
	const debouncedQueryInvalidation = useCallback(
		debounce(10000, () =>
			queryClient.invalidateQueries({ queryKey: [type, id] })
		),
		[]
	);

	useEffect(() => {
		return () => {
			debouncedQueryInvalidation.clear();
		};
	}, [data]);

	const { mutate: upvote } = useMutation({
		mutationFn: () => {
			return axiosPrivate.post(`${type}/upvote/${id}`);
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: [type, id] });
			const previousData = queryClient.getQueryData<PostData>([type, id]);
			let currnetRating = (previousData?.rating ?? 0) + 1;
			let status = 1;
			if (previousData?.status != null) {
				if (previousData.status > 0) {
					//изначально увеличивает голоса на +1, если это снятие upvote'a
					//то нужно снять начисление и уменьшить рейтинг
					currnetRating -= 2;
					status = 0;
				}
				if (previousData.status < 0) {
					currnetRating += 1;
				}
			}
			queryClient.setQueryData([type, id], {
				...previousData,
				rating: currnetRating,
				status: status,
			});
		},
		onSettled: () => {
			debouncedQueryInvalidation();
		},
	});
	const { mutate: downvote } = useMutation({
		mutationFn: () => {
			return axiosPrivate.post(`${type}/downvote/${id}`);
		},
		onMutate: async () => {
			await queryClient.cancelQueries({ queryKey: [type, id] });
			const previousData = queryClient.getQueryData<PostData>([type, id]);
			let currnetRating = (previousData?.rating ?? 0) - 1;
			let status = -1;
			if (previousData?.status != null) {
				if (previousData.status < 0) {
					//изначально уменьшает голоса на -1, если это снятие downvote'a
					//то нужно снять уменьшение и увеличить рейтинг
					currnetRating += 2;
					status = 0;
				}
				if (previousData.status > 0) {
					currnetRating -= 1;
				}
			}
			queryClient.setQueryData([type, id], {
				...previousData,
				rating: currnetRating,
				status: status,
			});
		},
		onSettled: () => {
			debouncedQueryInvalidation();
		},
	});
	return { upvoteFn: upvote, downvoteFn: downvote };
}
