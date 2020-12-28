## 序
一个简单的 webpack, react 开发环境 playground，支持 image import & css import。
轻量简单，同时兼顾兼容性。方便 demo 创作。

## 依赖
### install dependencies
```
npm i --save core-js react react-dom  regenerator-runtime whatwg-fetch

npm i --save-dev @babel/cli @babel/core @babel/preset-env @babel/preset-react @babel/preset-typescript  @types/react @types/react-dom  @typescript-eslint/eslint-plugin @typescript-eslint/parser autoprefixer babel-loader css-loader eslint eslint-plugin-react eslint-plugin-react-hooks file-loader html-webpack-plugin ip   postcss postcss-loader style-loader typescript url-loader webpack webpack-cli webpack-dev-server
```
### dependencies
```json
"dependencies": {
  "core-js": "^3.8.1",
  "react": "^17.0.1",
  "react-dom": "^17.0.1",
  "regenerator-runtime": "^0.13.7",
  "whatwg-fetch": "^3.5.0"
},
"devDependencies": {
  "@babel/cli": "^7.12.10",
  "@babel/core": "^7.12.10",
  "@babel/preset-env": "^7.12.11",
  "@babel/preset-react": "^7.12.10",
  "@babel/preset-typescript": "^7.12.7",
  "@types/react": "^17.0.0",
  "@types/react-dom": "^17.0.0",
  "@typescript-eslint/eslint-plugin": "^4.11.0",
  "@typescript-eslint/parser": "^4.11.0",
  "autoprefixer": "^10.1.0",
  "babel-loader": "^8.2.2",
  "css-loader": "^5.0.1",
  "eslint": "^7.16.0",
  "eslint-plugin-react": "^7.21.5",
  "eslint-plugin-react-hooks": "^4.2.0",
  "file-loader": "^6.2.0",
  "html-webpack-plugin": "^4.5.0",
  "ip": "^1.1.5",
  "postcss": "^8.2.1",
  "postcss-loader": "^4.1.0",
  "style-loader": "^2.0.0",
  "typescript": "^4.1.3",
  "url-loader": "^4.1.1",
  "webpack": "^5.11.0",
  "webpack-cli": "^4.3.0",
  "webpack-dev-server": "^3.11.0"
}
```

## web lib 创作
全局安装或者本地安装 weblib-cli。在 app 目录下创建不同的 `typescript lib` 以便调试。