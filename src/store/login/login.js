import { getAccessToken, getUsername, login, logout } from "../../cmmn/auth";
import axios from 'axios';

export default {
  namespaced: true,

  state: {
    isLogin: false,
    username: null,
    passwdCheck: false,
    memberInfo: {},
  },

  getters: {
    /** 로그인 여부 */
    isLogin: (state) => {
      return state.isLogin;
    },
    /** 로그인 여부 */
    getUsername: (state) => {
      return state.username;
    },
    getPasswdCheck: (state) => {
      return state.passwdCheck;
    },
    /** 현재 회원 정보 */
    getMemberInfo: (state) => {
      return state.memberInfo;
    },
  },

  mutations: {
    setMemberInfo(state, member) {
      state.memberInfo = member;
    },
    setIsLogin(state, isLogin) {
      state.isLogin = isLogin;
    },
    setUsername(state, username) {
      state.username = username;
    },
    initLogin(state, obj) {
      state.isLogin = obj.isLogin;
      state.memberInfo = obj.memberInfo;
      state.username = obj.username;
    },
    setUrlcode(state, urlcode) {
      state.urlcode = urlcode;
    },
    setPasswdCheck(state, PasswdCheck) {
      state.PasswdCheck = PasswdCheck;
    },
    setMemberAccount(state, memberAccount) {
      state.memberAccount = memberAccount;
    },
  },

  actions: {
    /** 최상위에서 최초 실행. 로그인 정보 갱신 */
    async initLogin({ commit, dispatch }) {
      // TODO: 로컬 스토리지에 autoLogin 값이 있을 때에만 초기 로그인 정보를 불러옴
      // if (true) {
      return getAccessToken().then((token) => {
        if (token) {
          commit("setIsLogin", true);
          commit("setUsername", getUsername());
          return dispatch("fetchLoginMember");
        }
      });
      // }
    },
    /** 로그인한 현재 회원 정보 받아오기 */
    async fetchLoginMember({ commit, state, dispatch }) {
      if (!state.isLogin) {
        commit("setMemberInfo", null);
      }
      const username = getUsername();
      return axios.post("/api/mbr/info", {
          data: {
            mbrId: username,
            mbrPw: "1234"
          },
        })
        .then(({ data }) => {
          // currentMember mutation 실행
          commit("setMemberInfo", data.output);
          return data.output;
        })

        .catch((error) => {
          // 통신 오류 있으면 로그아웃 처리
          dispatch("doLogout");
          throw error;
        });
    },
    async doLogout({ commit }) {
      return logout().then(() => {
        commit("setIsLogin", false);
        commit("setMemberInfo", null);
        commit("setUsername", null);
      });
    },
    async doLogin({ commit, dispatch }, params) {
      return login({ mbrId: params.mbrId, mbrPw: params.mbrPw })
        .then(() => {
          commit("setIsLogin", true);
          commit("setUsername", getUsername());
          return dispatch("fetchLoginMember");
        })
        .catch((e) => {
          dispatch("doLogout");
          // 로그인 오류와 관련된 화면처리는 e 전달 후, vue에서 처리
          throw e;
        });
    },

  },
};
