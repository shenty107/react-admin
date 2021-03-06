/**
 * Created by hao.cheng on 2017/4/28.
 */
// 获取url的参数
import axios from 'axios';

let meterDataList = [];
let summaryData = [];
let updated = false;

export const queryString = () => {
    let _queryString = {};
    const _query = window.location.search.substr(1);
    const _vars = _query.split('&');
    _vars.forEach((v, i) => {
        const _pair = v.split('=');
        if (!_queryString.hasOwnProperty(_pair[0])) {
            _queryString[_pair[0]] = decodeURIComponent(_pair[1]);
        } else if (typeof _queryString[_pair[0]] === 'string') {
            const _arr = [ _queryString[_pair[0]], decodeURIComponent(_pair[1])];
            _queryString[_pair[0]] = _arr;
        } else {
            _queryString[_pair[0]].push(decodeURIComponent(_pair[1]));
        }
    });
    return _queryString;
};

export const isUpdated = () => {
    return updated;
};

export const init = (ipAddress,callback) => {
    axios.get ('http://' + ipAddress + '/getmeterlist').then(function (response) {
        meterDataList = JSON.parse(response.request.responseText);
        updated = true;
        callback();
    }).catch(function (error) {
        // throw error
    });
};

export const syncSummary = (ipAddress,callback) => {
    axios.get('http://' + ipAddress + '/getsummarydata').then(function (response) {
        summaryData = JSON.parse(response.request.responseText);
        callback(summaryData);
    }).catch(function (error) {
        return false;
    });
};

export const getMeterDataList = () => {
    return meterDataList;
};

export const getSummary = () => {
    return summaryData;
};