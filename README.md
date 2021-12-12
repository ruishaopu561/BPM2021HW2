# BPM2021HW2
BPM2021HW2

## 项目构建
```bash
vue init webpack trip-web
cd trip-web
npm install ant-design-vue --save
npm install babel-plugin-import --dev
```

修改`babel.config.js`文件，配置 babel-plugin-import
```js
module.exports = {
  presets: ["@vue/app"],
  plugins: [
    [
      "import",
      { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }
    ]
  ]
};
``` 