class Utility {
  public static isFileImage(file: File) {
    return file && file["type"].split("/")[0] === "image";
  }

  public static getFormDataFromObject(obj: any) {
    var formData = new FormData();
    for (var key in obj) {
      if (obj[key] != null) formData.append(key, obj[key]);
    }
    return formData;
  }

  public static getParamStrFromObj(obj: any) {
    let paramStr = '?';
    for (var key in obj) {
      paramStr+= `&${key}=${obj[key]}`;
    }
    return paramStr;
  }

  public static getHiddenWalletAddress(str: string) {
    if (!str || str.length < 20) return "";
    return (
      str.substring(0, 15) + "..." + str.substring(str.length - 4, str.length)
    );
  }

  public static getPassedTimeString(isoTime: any) {
    if(!isoTime) return '';
    let obj:any = this.getPassedTimeObject(isoTime);
    let str = "";
    for (let key in obj) {
      str= str + obj[key] + key[0];
      if(key!=="sec") str+=" ";
    }
   return str;
  }

  public static getPassedTimeObject(isoTime: any) {
    let offerTimestamp = new Date(isoTime).getTime();
    let currentTimestamp = new Date().getTime();
    let diff:number = Number((offerTimestamp - currentTimestamp) / 1000);
    const day:number = Math.floor(diff / (3600*24));
    const dayRest:number = Math.floor(diff % (3600*24));
    const hr = Math.floor(dayRest / 3600);
    let remainSecs = dayRest % 3600;
    const min = Math.floor(remainSecs / 60);
    let secs = Math.floor(remainSecs % 60);
    return { day: day, hour: hr , min: min , sec: secs };
  }
}

export default Utility;
