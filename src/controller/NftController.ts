import API from "service/api";
import configs from "configs";

class NftController {
  public static create(payload: any) {
    return API.post(configs.API.TOKEN_URL, payload).then((res) => res.data);
  }

  public static createApprovedNFT(payload: any) {
    return API.post(`${configs.API.TOKEN_URL}/approvednft`, payload).then(
      (res) => res.data
    );
  }

  public static getList() {
    return API.get(configs.API.TOKEN_URL).then((res) => res.data);
  }

  public static getApprovedList() {
    return API.get(`${configs.API.TOKEN_URL}/approvednft`).then(
      (res) => res.data
    );
  }

  public static getMine() {
    return API.get(`${configs.API.TOKEN_URL}/my`).then((res) => res.data);
  }

  public static getById(id: any) {
    return API.get(`${configs.API.TOKEN_URL}/${id}`).then((res) => res.data);
  }

  public static setChainId(id: any, payload: any) {
    return API.post(`${configs.API.TOKEN_URL}/${id}/chain`, payload).then(
      (res) => res.data
    );
  }

  public static delete(id: any, user: any) {
    return API.delete(`${configs.API.TOKEN_URL}/${id}/${user}`).then(
      (res) => res.data
    );
  }

  public static deleteApprovedNFT(id: any, user: any) {
    return API.delete(
      `${configs.API.TOKEN_URL}/approvednft/${id}/${user}`
    ).then((res) => res.data);
  }

  public static stakeToken(payload: any) {
    return API.post(`${configs.API.TOKEN_URL}/stake`, payload).then(
      (res) => res.data
    );
  }

  public static getPumlTradingFee(payload: any) {
    return API.post(`${configs.API.TOKEN_URL}/getPumlTradingFee`, payload).then(
      (res) => res.data
    );
  }

  // public static stakePuml(payload: any) {
  //     return API.post(`${configs.API.TOKEN_URL}/stakePuml`, payload).then(res => res.data)
  // }

  // public static unstakePuml(payload: any) {
  //     return API.post(`${configs.API.TOKEN_URL}/unstakePuml`, payload).then(res => res.data)
  // }

  // public static rewardPuml(payload: any) {
  //     return API.post(`${configs.API.TOKEN_URL}/rewardPuml`, payload).then(res => res.data)
  // }

  public static approveToken(payload: any) {
    return API.post(`${configs.API.TOKEN_URL}/approveToken`, payload).then(
      (res) => res.data
    );
  }

  // public static getPumlFeeCollect(payload: any) {
  //     return API.post(`${configs.API.TOKEN_URL}/getPumlFeeCollect`, payload).then(res => res.data)
  // }

  // public static pumlFeeCollect(payload: any) {
  //     return API.post(`${configs.API.TOKEN_URL}/pumlFeeCollect`, payload).then(res => res.data)
  // }
}

export default NftController;
