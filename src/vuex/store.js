import Vue from "vue";
import Vuex from "vuex";
import * as actions from "./actions";
import * as getters from "./getters";

Vue.use(Vuex);

// 应用初始状态
const state = {
  count: 10,
  stuName: "",
  dateList: [],
  courseLists: [],
  stuLists: [],
  stuId: "",
  timeYear: "",
  timeMonth: "",
  timeDay: "",
  baseDay: "",
};

// 定义所需的 mutations
const mutations = {
  // INCREMENT(state) {
  //   state.count++;
  // },
  // DECREMENT(state) {
  //   state.count--;
  // },
  GETSTUDENTNAME(state, stuName) {
    state.stuName = stuName;
  },
  GETDATELIST(state, dateList) {
    state.dateList = dateList;
  },
  GETCOURSELIST(state, courseLists) {
    state.courseLists = courseLists;
  },
  GETSTULISTS(state, stuLists) {
    state.stuLists = stuLists;
  },
  GETSTUID(state, stuId) {
    state.stuId = stuId;
  },
  GETTIMEYEAR(state, timeYear) {
    state.timeYear = timeYear;
  },
  GETTIMEMONTH(state, timeMonth) {
    state.timeMonth = timeMonth;
  },
  GETTIMEDAY(state, timeDay) {
    state.timeDay = timeDay;
  },
  GETBASEDAY(state, baseDay) {
    state.baseDay = baseDay;
  }
};

// 创建 store 实例
export default new Vuex.Store({
  actions,
  getters,
  state,
  mutations
});
