export default {
  namespaced: true,

  state: {
    loginInfo: undefined,
  },

  getters: { 
    getLoginInfo: (state) => {
      return state.loginInfo;
    },
  },

  mutations: {
    setLoginInfo(state, info) {
      state.loginInfo = info;
    },

  },

  actions: {
    /** 로그인한 현재 회원 정보 받아오기 */
    async Login({ commit, state }) {
      // store 로그인 정보 유지
      if (!state.loginInfo) {
        commit("setInfo", null);
      }

      return window.axios({
          method: "POST",
          url: "/login",
        })
        .then(({ data }) => {
          commit("setLoginInfo", data);
          return data;
        })  
        .catch(console.log("로그인 에러남"));
    },
  },
};