import { request, METHOD } from "@/utils/request";
// import store from "../store/index";

/**
 *
 * @param {object} startPos
 * @param {object} endPos
 * @return {Promise}
 */
export const getRoutePlanApi = (startPos, endPos, KEY) => {
  let url = "map/direction/v1/driving/"; //请求路径
  url += `?from=${startPos.lat},${startPos.lng}`; //起点坐标
  url += `&to=${endPos.lat},${endPos.lng}`; //终点坐标
  url += `&key=${KEY}`; //开发key，可在控制台自助创建
  return request(url, METHOD.GET)
};