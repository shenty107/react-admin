let backendServerIp = "10.1.13.131:8080/web-backend";
let defaultMeterValue = [0,1,2,6,7,9]; //0-16
let serverPrefix=
    [
        {
            name:'DesignService',
            prefix:'/dds/api'
        },
        {
            name:'DesignRenderService',
            prefix:'/drs/api'
        },
        {
            name:'Graphite_Report',
            prefix:'/dds/api'
        }
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

