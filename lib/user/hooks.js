import { fetcher } from '@/lib/fetch'; // API 요청을 도와주는 fetcher를 가져옵니다.
import useSWR from 'swr'; // SWR (Stale While Revalidate) 훅을 가져옵니다.

// 현재 사용자의 데이터를 가져오는 함수입니다.
export function useCurrentUser() {
  // '/api/user' 엔드포인트로 API 요청을 하여, 현재 로그인한 사용자의 데이터를 가져옵니다.
  // fetcher 함수는 API 요청에 사용됩니다.
  return useSWR('/api/user', fetcher);
}

// 특정 ID의 사용자 데이터를 가져오는 함수입니다.
export function useUser(id) {
  // `/api/users/${id}` 엔드포인트로 API 요청을 하여,
  // 주어진 ID를 가진 사용자의 데이터를 가져옵니다.
  // fetcher 함수는 API 요청에 사용됩니다.
  return useSWR(`/api/users/${id}`, fetcher);
}
