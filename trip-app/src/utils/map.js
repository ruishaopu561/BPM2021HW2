export const routePlanToPolygon = (polyline) => {
  let pl = [];
  var coords = polyline;
  //坐标解压（返回的点串坐标，通过前向差分进行压缩）
  var kr = 1000000;
  for (let i = 2; i < coords.length; i++) {
    coords[i] = Number(coords[i - 2]) + Number(coords[i]) / kr;
  }
  // //将解压后的坐标放入点串数组pl中
  for (let i = 0; i < coords.length; i += 2) {
    pl.push(new window.TMap.LatLng(coords[i], coords[i + 1]));
  }
  return pl;
};

/**
 *
 * @param {object} p1       : 路线的多条线段
 * @param {object} startPos
 * @param {object} endPos
 * @param {object} map
 * @returns
 */
export const drawRoute = ({ pl, startPos, endPos, index }, map) => {
  //标记起终点marker
  var marker = new window.TMap.MultiMarker({
    id: `marker-layer-${JSON.stringify(startPos)}-${JSON.stringify(endPos)}-${index}`,
    map: map,
    styles: {
      start: new window.TMap.MarkerStyle({
        width: 25,
        height: 35,
        anchor: { x: 16, y: 32 },
        src: "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/start.png",
      }),
      end: new window.TMap.MarkerStyle({
        width: 25,
        height: 35,
        anchor: { x: 16, y: 32 },
        src: "https://mapapi.qq.com/web/lbs/javascriptGL/demo/img/end.png",
      }),
    },
    geometries: [
      {
        id: "start",
        styleId: "start",
        position: new window.TMap.LatLng(startPos.lat, startPos.lng),
      },
      {
        id: "end",
        styleId: "end",
        position: new window.TMap.LatLng(endPos.lat, endPos.lng),
      },
    ],
  });

  //创建 MultiPolyline显示折线
  var polylineLayer = new window.TMap.MultiPolyline({
    id: `polyline-layer-${JSON.stringify(startPos)}-${JSON.stringify(endPos)}-${index}`, //图层唯一标识
    map: map, //绘制到目标地图
    //折线样式定义
    styles: {
      style_blue: new window.TMap.PolylineStyle({
        color: "#3777FF", //线填充色
        width: 8, //折线宽度
        borderWidth: 5, //边线宽度
        borderColor: "#FFF", //边线颜色
        lineCap: "round", //线端头方式
      }),
    },
    //折线数据定义
    geometries: [
      {
        id: "pl_1", //折线唯一标识，删除时使用
        styleId: "style_blue", //绑定样式名
        paths: pl,
      },
    ],
  });
  return { marker, polylineLayer };
};
