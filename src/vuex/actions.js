//test
// export const increment = ({commit}) => {
//   commit('INCREMENT');
// };
// export const decrement = ({commit}) => {
//   commit('DECREMENT');
// };

/*获取学生姓名*/
export const getStudentName = ({commit}, stuName) => {
  commit('GETSTUDENTNAME', stuName);
};

/*获取日期列表*/
export const getDateList = ({commit}, stuName) => {
  commit('GETDATELIST', stuName);
};

/*获取课程列表*/
export const getCourseLists = ({commit}, courseLists) => {
  commit('GETCOURSELIST', courseLists);
};

/*获取学生列表*/
export const getStuLists = ({commit}, stuLists) => {
  commit('GETSTULISTS', stuLists);
};

/*获取学生id*/
export const getStuId = ({commit}, stuId) => {
  commit('GETSTUID', stuId);
};

/*获取年月日*/
export const getTimeYear = ({commit}, timeYear) => {
  commit('GETTIMEYEAR', timeYear);
};
export const getTimeMonth = ({commit}, timeMonth) => {
  commit('GETTIMEMONTH', timeMonth);
};
export const getTimeDay = ({commit}, timeDay) => {
  commit('GETTIMEDAY', timeDay);
};

export const getBaseDay = ({commit}, baseDay) => {
  commit('GETBASEDAY', baseDay);
};
