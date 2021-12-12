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