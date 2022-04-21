const {BigNumber} = require('bignumber.js');
const md5 = require('md5');

export const removeEndingZero = function (value) {
    const regex = /^[^.]+?(?=\.0*$)|^[^.]+?\..*?(?=0*$)|^[^.]*$/g;
    return value.match(regex);
};

export const formatNumberInThousand = function(num) {
    if (!num) {
        return '';
    }
    const nums = num.toString().split('.');
    if (nums.length > 1) {
        return nums[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + '.' + nums[1]
    }
	return nums[0];
};


export const toFixed = function (big, scale = 8, roundMode = undefined, options = {maxScale: 18}) {
    if(big === undefined || big === null)
        return '';
    const b = new BigNumber(big);
    if (b.isNaN()) {
        return '';
    }
    const {maxScale} = options;
    const resultScale = Math.min(scale, maxScale);
    return b.toFixed(resultScale, roundMode);
};

export const BigNumberAdd = function(a, b) {
    return new BigNumber(a).plus(b);
};

export const BigNumberSub = function(a, b) {
    return new BigNumber(a).minus(b);
};

export const BigNumberMul = function(a, b) {
    return new BigNumber(a).multipliedBy(b);
};

export const BigNumberDiv = function(a, b) {
    return new BigNumber(a).dividedBy(b);
};

export const BigNumberFixed = function(val, fix, round, roundMode = undefined) {
    if(round === true){
        const big = new BigNumber(val);
        return !!big && toFixed(big, fix, roundMode);
    }
    else{
        if(typeof(val) === "string"){
            if(val.indexOf('.') !== -1){
                const strArray = val.split('.');
                if(strArray.length === 2){
                    if(strArray[1].length > fix){
                        strArray[1] = strArray[1].substring(0,fix);
                    }
                    return (new BigNumber((strArray[0]+'.'+strArray[1])));
                }
            }
            else{
                return new BigNumber(val);
            }
        }
        else if(typeof(val) === "number"){
            const fixNum = Math.pow(10, fix);
            const calc = new BigNumber(val) * fixNum;
            return new BigNumber(Math.floor(calc)/calc);
        }
        else{
            return new BigNumber(val);
        }
    }
};

export const isBiggerValue = function(a,b) {
    return new BigNumber(a).isGreaterThan(BigNumber(b));
}

export const isLessValue = function(a,b) {
    return new BigNumber(a).isLessThan(BigNumber(b));
}

export const cryptMD5 = function(data) {
    console.log("asdfsdf", data)
    return md5(data);
}