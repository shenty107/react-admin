export const parseGraphiteMessage = mString => {
    let mJSON = [];
    var mSplitString = mString.split('.');
    var serviceName = [mSplitString[2], mSplitString[3], mSplitString[4], mSplitString[5], mSplitString[6]].join('.');
    var funcName = mSplitString[7];
    var detailName = mSplitString[9];
    mJSON = {
        serviceName: serviceName,
        funcName: funcName,
        detailName: detailName
    };
    return mJSON;
};