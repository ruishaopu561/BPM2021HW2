# BPM2021HW2
2021过程建模与优化课程的RMP大作业

## 项目构建
```bash
# 实际这一步下载的 release
git clone git@github.com:iczer/vue-antd-admin.git
cd trip-web
npm install ant-design-vue --save
npm install babel-plugin-import --dev
```

修改`.babelrc`文件，配置 babel-plugin-import
```js
{
  "presets": [
    ["env", {
      "modules": false,
      "targets": {
        "browsers": ["> 1%", "last 2 versions", "not ie <= 8"]
      }
    }],
    "stage-2"
  ],
  "plugins": [
    "transform-vue-jsx",
    "transform-runtime",
    ["import", { "libraryName": "ant-design-vue", "libraryDirectory": "es", "style": "css" }] // 主要加上这一行
  ]
}
``` 

## app
+ 支付: 表单页 --> 分步表单
+ 预订、修改预订: 表单页 --> 基础表单

+ 设置目的地、查询最优路线: 參考高德
+ 查看历史出行记录: 表格页 和 详情页
+ 查询实时路况: 通常拥堵 和 当前拥堵