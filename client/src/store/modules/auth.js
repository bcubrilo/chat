const state = {
  user: null
};

const getters = {
  check: state => {
    return !!state.user;
  },
  token: state => {
    return state.user && state.user.token;
  }
};
