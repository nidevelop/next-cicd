import { fetcher } from '@/lib/fetch'; // fetch 요청을 도와주는 fetcher를 import합니다.
import useSWRInfinite from 'swr/infinite'; // 무한 스크롤링 기능을 위한 SWR hook을 import합니다.

// creatorId 및 limit 파라미터를 옵션으로 가지는 usePostPages 함수를 export합니다.
export function usePostPages({ creatorId, limit = 10 } = {}) {
  // useSWRInfinite를 이용하여 데이터, 에러, 페이지 크기 등의 정보를 가져옵니다.
  const { data, error, size, ...props } = useSWRInfinite(
    (index, previousPageData) => {
      // 만약 이전 페이지 데이터가 있고 그 데이터의 posts의 길이가 0이라면 더 이상 로딩할 데이터가 없습니다.
      if (previousPageData && previousPageData.posts.length === 0) return null;

      const searchParams = new URLSearchParams();
      // 한 페이지 당 불러올 post의 최대 개수를 설정합니다.
      searchParams.set('limit', limit);

      // 만약 creatorId가 있다면, 해당 사용자가 작성한 포스트만 불러오도록 설정합니다.
      if (creatorId) searchParams.set('by', creatorId);

      // 첫 페이지가 아닐 때
      if (index !== 0) {
        // 이전 페이지의 마지막 post의 createdAt을 cursor로 사용하여
        // 그 이전의 post를 불러오기 위한 before 값을 설정합니다.
        const before = new Date(
          new Date(
            previousPageData.posts[previousPageData.posts.length - 1].createdAt
          ).getTime()
        );

        searchParams.set('before', before.toJSON());
      }

      // API 엔드포인트 URL을 반환합니다.
      return `/api/posts?${searchParams.toString()}`;
    },
    fetcher, // fetch 요청을 도와주는 fetcher를 인자로 넣습니다.
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
  // 데이터가 비어 있는지 확인합니다.
  const isEmpty = data?.[0]?.length === 0;
  // 더 이상 로드할 데이터가 없는지 확인합니다.
  const isReachingEnd =
    isEmpty || (data && data[data.length - 1]?.posts?.length < limit);

  // 필요한 데이터 및 상태들을 반환합니다.
  return {
    data, // 로딩된 데이터
    error, // 에러 객체
    size, // 로딩된 페이지의 수
    isLoadingMore, // 추가 데이터 로딩 중인지의 상태
    isReachingEnd, // 더 이상 로드할 데이터가 없는지의 상태
    ...props, // 기타 SWR 훅으로부터 반환된 속성들
  };
}
