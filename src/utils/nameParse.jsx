let BackendServerIp = "10.1.13.131:8080/web-backend";


export const getBackendServerIp = () => {
    return BackendServerIp;
};

export const setBackendServerIp = (newIp) => {
    BackendServerIp = newIp;
};

