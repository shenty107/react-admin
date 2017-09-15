let backendServerIp = "10.1.13.131:8080/web-backend";
let defaultMeterValue = [0, 1, 2, 6, 7, 9]; //0-16
let serverPrefix =
    [
        {
            name: 'DesignService',
            prefix: '/dds/api'
        },
        {
            name: 'DesignRenderService',
            prefix: '/drs/api'
        },
        {
            name: 'Graphite_Report',
            prefix: '/dds/api'
        }
    ];

let valueFormat = [
    {
        index: 'normal-rate', name: '正常调用率',
        format: '%'
    },
    {
        index: 'success-rate', name: '调用成功率',
        format: '%'
    },
    {
        index: 'count', name: '调用次数',
        format: '次'
    },
    {
        index: 'm15_rate', name: '平均每15分钟调用次数',
        format: '次'
    },
    {
        index: 'm1_rate', name: '平均每分钟调用次数',
        format: '次'
    },
    {
        index: 'm5_rate', name: '平均每5分钟调用次数',
        format: '次'
    },
    {
        index: 'max', name: '最长调用时间',
        format: 'ms'
    },
    {
        index: 'mean', name: '平均调用时间',
        format: 'ms'
    },
    {
        index: 'mean_rate', name: '平均每秒调用次数',
        format: '次'
    },
    {
        index: 'min', name: '最短调用时间',
        format: 'ms'
    },
    {
        index: 'p50', name: '调用时间中位数',
        format: 'ms'
    },
    {
        index: 'p75', name: '调用时间第75百分位数',
        format: 'ms'
    },
    {
        index: 'p95', name: '调用时间第95百分位数',
        format: 'ms'
    },
    {
        index: 'p98', name: '调用时间第98百分位数',
        format: 'ms'
    },
    {
        index: 'p99', name: '调用时间第99百分位数',
        format: 'ms'
    },
    {
        index: 'p999', name: '调用时间第999百分位数',
        format: 'ms'
    },
    {
        index: 'stddev', name: '调用时间标准差',
        format: 'ms'
    },
];

export const getBackendServerIp = () => {
    return backendServerIp;
};

export const setBackendServerIp = (newIp) => {
    backendServerIp = newIp;
};

export const getDefaultMeterValue = () => {
    return defaultMeterValue;
};

export const getServerPrefix = () => {
    return serverPrefix;
};

export const getValueFormat = () => {
    return valueFormat;
};

