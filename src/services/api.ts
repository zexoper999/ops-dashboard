import axios from "axios";

export const api = axios.create({
  baseURL: "",
  timeout: 5000,
});

// 응답 인터셉터 (에러 처리 공통화)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // 나중에 에러 바운더리에서 잡을 수 있도록 에러를 던짐
    return Promise.reject(error);
  },
);
