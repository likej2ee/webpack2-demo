# 前端页面制作规范


## 项目构建工具

- [node-v7.5.0-x64.msi](https://nodejs.org/dist/v7.5.0/node-v7.5.0-x64.msi) 点击下载Win版node
- [node-v7.5.0.pkg](https://nodejs.org/dist/v7.5.0/node-v7.5.0.pkg) 点击下载Mac版node
- [gulp](https://github.com/gulpjs/gulp) 构建工具介绍
- [sass](http://www.w3cplus.com/sassguide/syntax.html) sass入门语法

## 团队协作必要工具插件
- 编辑器 sublime(可选择其他编辑器，但为了团队协作请自行查阅设置)
Preferences/ Settings - User / 中贴入如下配置项
```
{
	"color_scheme": "Packages/User/SublimeLinter/Monokai (SL).tmTheme",
	"ensure_newline_at_eof_on_save": true,
	"font_size": 12,
	"ignored_packages":
	[
		"node_modules"
	],
	"show_encoding": true,
	"tab_size": 4,
	"translate_tabs_to_spaces": true,
	"trim_trailing_white_space_on_save": true
}
```
- 编辑器插件
    - CSScomb
    - JsFormat
    - HTML/CSS/JS Prettify
    - Pretty JSON
    - DocBlockr
    - Emmet
    - CSS3
    - Bracket Highlighter
    - SublimeLinter

    为了团队协作，格式化插件必须安装，其中CSScomb安装后，修改下配置项
    ```
        // Set space before `{`.
        "space-before-opening-brace": " ",
        此处默认是"\n"换行，修改成空格" "即可
    ```

## 运行项目

- 请确认已安装node环境，并使用npm install -g gulp bower 全局安装了gulp bower
- 打开命令行窗口，进入项目跟目录(或者先找到项目跟目录，再鼠标右键 + shift按键，在打开的右侧菜单中选择"在此处打开命令行窗口")
- 运行 npm install 等待安装结束, 安装工程化插件
- 运行 bower install 等待安装结束，安装项目依赖的脚本框架
- 运行 gulp dev，即可自动打开浏览器，若希望以目录形式列出当前已有文件，请更改gulpfile.js中'webserver'任务
- 运行 gulp gulp release --deploy dev/test/production 生成对应环境的构建版本

## 目录结构
**其中 src/core 目录,项目初建时规定，不可任意扩展，需团队协商后再更新内容**
```
│  .bowerrc                          bower管理工具的配置文件，配置下载目录、代理等
│  .npmrc                            npm管理工具的配置文件，可配置代理等
│  bower.json                        bower管理的库文件资源列表
│  gulpfile.js                       gulp任务配置文件
│  package.json                      gulp任务依赖的插件列表
│  README.md                         项目说明文件
│
├─node_modules                       依赖的模块儿
│
├─dist                               发布目录
│
└─src
    └─lib                           库文件
```
