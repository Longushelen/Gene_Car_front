/**
 * 토큰 로컬 저장. 인증 통신을 실제로 수행하는 js
 *
 * 상태관리 하는 곳에서 필요한 기능을 호출하여 사용한다
 */
import axios from "axios";
import jwt_decode from "jwt-decode";

const ACCESS_TOKEN_STORAGE_KEY = "ASF_access_token";

const CONFIG = {
  baseURL: process.env.VUE_APP_API_URL || "http://localhost:9080",
  timeout: 60 * 1000, // Timeout
  method: "post",
  headers: {
    post: {
      "Content-Type": "application/json;charset=UTF-8",
    },
    get: {
      "Content-Type": "application/json;charset=UTF-8",
    },
  },
};

const _axios = axios.create(CONFIG);

/** 현재 진행중인 로그인 요청 */
var authRequest;

/** 현재 액세스 토큰. 스토리지에서 한번 가져온 이후엔 계속 사용한다 */
var accessToken = localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);

/** 사용자 아이디, 암호를 사용하여 로그인처리(토큰 취득)를 한다 */
export async function login(user) {
  if (authRequest != null) {
    return authRequest;
  }
  authRequest = _axios({
    url: "/api/auth/login",
    data: user,
  }) //
    .then((response) => {
      // 토큰 받지 않은 경우. 정보 오류 or 통합 과정 필요
      switch (response.data?.code) {
        case "1001": // 아이디 암호 오류
          throw new Error("1001");
        case "0000": // 성공
          accessToken = response.data?.output?.accessToken;
          if (accessToken) {
            localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
            return accessToken;
          }
          break;
      }

      return Promise.reject(response.data);
    })
    .finally(() => {
      authRequest = null;
    });
  return authRequest;
}

/**
 * 로그인 정보 삭제
 */
export async function logout() {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
}

/**
 * 토큰 갱신이 가능하면 재발급을 요청한다
 *
 * @returns {Promise<string>} 정상 성공하면 갱신된 액세스 토큰, 실패하면 (유효한 기간에는) 이전 액세스 토큰 사용하게 그대로 리턴
 */
function refreshAccessToken() {
  if (authRequest) {
    return authRequest;
  }
  authRequest = _axios({
    url: "/api/auth/refreshLogin", //
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }) //
    .then(({ data }) => {
      if (data.output.accessToken) {
        accessToken = data.output.accessToken;
        localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
        return accessToken;
      } else {
        return accessToken;
      }
    })
    .catch(() => accessToken)
    .finally(() => {
      authRequest = null;
    });
  return authRequest;
}

/**
 * 스토리지에 저장된 access token 확인하고, 만료일시가 1일 이내라면 갱신 후, 1일 이상 남은 토큰을 리턴
 */
export async function getAccessToken() {
  // 현재 토큰 자체가 없다면 null return
  if (!accessToken) {
    return null;
  }

  const decoded = jwt_decode(accessToken);

  // 토큰이 만료되면 null
  if (decoded.exp * 1000 < Date.now()) {
    accessToken = null;
    return null;
  }

  // 현재 토큰 유효일시가 7일 넘게 남았다면 그대로 return
  if ((decoded.exp - 60 * 60 * 24 * 7) * 1000 > Date.now()) {
    return accessToken;
  }

  // 현재 토큰 만료기간이 임박하면(d-7) 새로운 토큰을 받아서 return
  return await refreshAccessToken();
}

/** jwt 를 분해해서 안의 username 리턴 */
export function getUsername(token) {
  const jwtToken = token ?? accessToken;
  return jwtToken ? jwt_decode(jwtToken).username : null;
}

/** jwt 를 분해해서 ROLE을 가지고 있는지 확인 */
export function hasRole(role) {
  const jwtToken = accessToken;
  return jwtToken && jwt_decode(jwtToken).USER_ROLE === role;
}
