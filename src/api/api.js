import { stringify } from 'qs';
import axios from 'axios';

axios.defaults.validateStatus = status => {
    return status < 500;
};
// 设置请求token
axios.interceptors.request.use(config => {
    var token = sessionStorage.getItem('token');
    config.headers['Authorization'] = 'Bearer ' + token;
    return config;
});
// 接口错误拦截

axios.interceptors.response.use(res => {
    if (res.status === 401) {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('token');
        router.push({ path: '/login' });
        return res;
    } else {
        return res;
    }
}, err => {
    return Promise.reject(err);
});


// axios.defaults.baseURL = 'http://10.149.0.215:8080';
// axios.defaults.baseURL = 'http://10.150.117.194:8080';  // 刘佳
axios.defaults.baseURL = 'http://10.149.0.173:7083';  // 武勇文
// axios.defaults.baseURL = 'http://qtmyxx.xdf.cn'; 

axios.defaults.timeout = 1000 * 30;
//axios.defaults.headers.post['Content-Type'] = 'application/vnd.ms-excel';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
// res.headers['content-type'] === 'application/vnd.ms-excel')
axios.defaults.headers.get['Content-Type'] = 'application/json';

//公共登陆部分
export const E2Login = params => {
    return axios.post('/yxyy/company/e2Login', params).then(res => res.data);
};
export const requestToken = params => {
    return axios.post('/oauth/token', params).then(res => res.data);
};
export const requestUser = params => {
    return axios.post('/auth/getUserInfo', params).then(res => res.data);
};

// 美本产品宝--导出
export const itemExcelDownloads = (params) => {
    return axios.post('/cpb/item/itemExcelDownloads', stringify(params), { responseType: 'arraybuffer' }).then(res => res.data);
};

// 产品宝---后台
export const cpbuserrList = params => {
    return axios.post("/cpb/user/getUsersList", stringify(params)).then(res => res.data);
};

// 产品宝---新增用户
export const cpbinsert = params => {
    return axios.post("/cpb/user/insert", stringify(params)).then(res => res.data);
};

// 产品宝---修改
export const cpbfindUserById = params => {
    return axios.post("/cpb/user/findUserById", stringify(params)).then(res => res.data);
};

// 产品宝---修改-确定
export const cpbupdate = params => {
    return axios.post("/cpb/user/update", stringify(params)).then(res => res.data);
};

// 产品宝---禁用
export const cpbdelete = params => {
    return axios.post("/cpb/user/delete", stringify(params)).then(res => res.data);
};

// 产品宝---启用
export const cpbopen = params => {
    return axios.post("/cpb/user/open", stringify(params)).then(res => res.data);
};



export const updateStatus = params => {
    return axios.post('/yxyy/academy/updateStatus', params).then(res => res.data);
}; //updateAcademy

export const updateLanguage = params => {
    return axios.post('/yxyy/academy/updateLanguage', params).then(res => res.data);
};

//分公司管理
export const getAllCompanyPage = params => {
    return axios.post('/yxyy/company/getAllCompanyPC', params).then(res => res.data);
};
export const getCompanyById = params => {
    return axios.post('/yxyy/company/getCompanyByIdPC', params).then(res => res.data);
};
export const getUserByOpenIdPC = params => {
    return axios.post('/yxyy/company/getUserByOpenIdPC', params).then(res => res.data);
};
export const updateContactPC = params => {
    return axios.post('/yxyy/company/updateContactPC', stringify(params)).then(res => res.data);
};
export const getUserCompanyPC = params => {
    return axios.post('/yxyy/company/getUserCompanyPC', stringify(params)).then(res => res.data);
};
export const getUserDeptPC = params => {
    return axios.post('/yxyy/company/getUserDeptPC', params).then(res => res.data);
};
export const insertContactPC = params => {
    return axios.post('/yxyy/company/insertContactPC', stringify(params)).then(res => res.data);
};
export const selectAllDeptPC = params => {
    return axios.post('/yxyy/company/selectAllDeptPC', params).then(res => res.data);
};


//外联用户
export const getSysUserPC = params => {
    return axios.post('/yxyy/user/getSysUserPC', params).then(res => res.data);
};

export const addSysUserPC = params => {
    return axios.post('/yxyy/user/addSysUserPC', stringify(params)).then(res => res.data);
};

export const getSysUserByIdPC = params => {
    return axios.post('/yxyy/user/getSysUserByIdPC', params).then(res => res.data);
};

export const getWxUserPC = params => {
    return axios.post('/yxyy/user/getWxUserPC', params).then(res => res.data);
};

export const updateSysUserPC = params => {
    return axios.post('/yxyy/user/updateSysUserPC', stringify(params)).then(res => res.data);
};

export const deleteSysUserPC = params => {
    return axios.post('/yxyy/user/deleteSysUserPC', params).then(res => res.data);
};

export const getWLUserCompanyPC = params => {
    return axios.post('/yxyy/user/getUserCompanyPC', params).then(res => res.data);
};
export const WLgetCompanyPC = params => {
    return axios.post('/yxyy/user/WLgetCompanyPC', params).then(res => res.data);
};
export const changeCompanyPC = params => {
    return axios.post('/yxyy/user/changeCompanyPC', params).then(res => res.data);
};

//院校预约信息
export const getOrderInfoPC = params => {
    return axios.post('/yxyy/orderInfo/getOrderInfoPC', stringify(params)).then(res => res.data);
};

export const getOneOrderInfoPc = params => {
    return axios.post('/yxyy/orderInfo/getOneOrderInfoPc', params).then(res => res.data);
};
//公司信息excle 导出
export const downloads = params => {
    return axios.post('/yxyy/excel/download', params, { responseType: 'arraybuffer' }).then(res => res.data);
};

//微信查询全部
export const getAllWXUserPC = params => {
    return axios.post('/yxyy/wxUser/selectAllWXUserPC', params).then(res => res.data);
};
//微信查询全部 新增外联用户时查全部未使用过的微信
export const getWXUsersWLPC = params => {
    return axios.post('/yxyy/wxUser/getWXUsersWLPC', params).then(res => res.data);
};

//评分信息维护
//新增
export const saveScore = params => {
    return axios.post('', stringify(params)).then(res => res.data);
};

//获取验证码 token
export const loginVerify = () => {
    return axios.post('/auth/captcha').then(res => res.data);
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////审批
// 通过
export const approval = (params) => {
    return axios.post('/yxyy/orderInfo/approval', stringify(params)).then(res => res.data);
};

// 取消
export const cancel = (params) => {
    return axios.post('/yxyy/orderInfo/cancel', stringify(params)).then(res => res.data);
};

// 取消红点  {'infoId':infoId,'roleId':roleId}
export const moverRed = (params) => {
    return axios.post('/yxyy/orderInfo/moverRed', stringify(params)).then(res => res.data);
};
///////////////////////////////////////////////////////////合作院校//////////////////////////////////////////////////////////////////////////////

// 上传 file
// export const importCooperateExcel = (params) => {
//    return axios.post('/xxb/cooperate/importCooperateExcel', stringify(params)).then(res => res.data);
// };

// 下载
export const cooperateExcelDownloads = (params) => {
    return axios.post('/xxb/cooperate/cooperateExcelDownloads', stringify(params), { responseType: 'arraybuffer' }).then(res => res.data);
};

///////////////////////////////////////////////////////////全部院校//////////////////////////////////////////////////////////////////////////////

// 上传  file
// export const importExcel = (params) => {
//    return axios.post('/xxb/service/importExcel', stringify(params)).then(res => res.data);
// };

// 下载
export const UserExcelDownloads = (params) => {
    return axios.post('/xxb/service/UserExcelDownloads', stringify(params), { responseType: 'arraybuffer' }).then(res => res.data);
};


///////////////////////////////////////////////////////////用户管理//////////////////////////////////////////////////////////////////////////////

// 获取用户列表
export const getUsersList = (params) => {
    return axios.post('/xxb/user/getUsersList', stringify(params)).then(res => res.data);
};

// 获取用户列表
export const findUserById = (params) => {
    return axios.post('/xxb/user/findUserById', stringify(params)).then(res => res.data);
};

// 新增用户
export const insertUser = (params) => {
    return axios.post('/xxb/user/insert', stringify(params)).then(res => res.data);
};

// 修改用户
export const updateUser = (params) => {
    return axios.post('/xxb/user/update', stringify(params)).then(res => res.data);
};

// 删除用户
export const deleteUser = (params) => {
    return axios.post('/xxb/user/delete', stringify(params)).then(res => res.data);
};
