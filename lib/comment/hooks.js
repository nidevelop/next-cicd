import { fetcher } from '@/lib/fetch'; // API 호출을 돕는 fetcher 함수를 가져옵니다.
import useSWRInfinite from 'swr/infinite'; // 무한 스크롤링 데이터를 가져오기 위한 SWR 훅을 가져옵니다.

// 댓글 페이지를 가져오기 위한 사용자 정의 훅을 정의합니다.
export function useCommentPages({ postId, limit = 10 } = {}) {
  // useSWRInfinite 훅을 사용하여 무한 로딩 데이터를 가져옵니다.
  const { data, error, size, ...props } = useSWRInfinite(
    (index, previousPageData) => {
      // 이전 페이지의 데이터가 없거나, 댓글의 길이가 0이라면 더 이상 불러올 데이터가 없다는 것을 나타냅니다.
      if (previousPageData && previousPageData.comments.length === 0)
        return null;

      const searchParams = new URLSearchParams();
      // 요청할 댓글의 제한 수를 설정합니다.
      searchParams.set('limit', limit);

      // 첫 페이지가 아닐 경우
      if (index !== 0) {
        // 이전 페이지의 마지막 댓글의 생성 시간을 before로 설정하여
        // 해당 시간 이전의 댓글을 요청합니다.
        const before = new Date(
          new Date(
            previousPageData.comments[
              previousPageData.comments.length - 1
            ].createdAt
          ).getTime()
        );
        searchParams.set('before', before.toJSON());
      }

      // API 엔드포인트 URL을 반환합니다.
      return `/api/posts/${postId}/comments?${searchParams.toString()}`;
    },
    fetcher, // API 호출을 수행하는 함수를 전달합니다.
    {
      refreshInterval: 10000, // 10초마다 데이터를 새로 고칩니다.
      revalidateAll: false, // 모든 페이지를 재검증하지 않습니다.
    }
  );

  // 초기 데이터 로딩 상태를 확인합니다.
  const isLoadingInitialData = !data && !error;
  // 추가 데이터 로딩 상태를 확인합니다.
  const isLoadingMore =
    isLoadingInitialData ||
    (size > 0 && data && typeof data[size - 1] === 'undefined');
  // 데이터가 비어있는지 확인합니다.
  const isEmpty = data?.[0]?.length === 0;
  // 더 이상 불러올 데이터가 없는지 확인합니다.
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.comments?.length < limit);

  // 필요한 값들을 반환합니다.
  return {
    data, // 로딩된 데이터
    error, // 에러 객체
    size, // 로딩된 페이지의 수
    isLoadingMore, // 추가 데이터 로딩 중인지의 상태
    isReachingEnd, // 더 이상 로드할 데이터가 없는지의 상태
    ...props, // 기타 SWR 훅으로부터 반환된 속성들
  };
}
