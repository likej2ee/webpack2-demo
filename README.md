# 前端页面制作规范

## 项目构建工具

- [node](https://nodejs.org/en/) 点击下载node
- [gulp](https://github.com/gulpjs/gulp) 构建工具介绍
- [sass](http://www.w3cplus.com/sassguide/syntax.html) sass入门语法

## 运行项目

- 请确认已安装node环境，并使用npm install -g gulp bower 全局安装了gulp bower
- 打开命令行窗口，进入项目跟目录(或者先找到项目跟目录，再鼠标右键 + shift按键，在打开的右侧菜单中选择"在此处打开命令行窗口")
- 运行 npm install 等待安装结束, 安装工程化插件
- 运行 bower install 等待安装结束，安装项目依赖的脚本框架
- 运行 gulp dev，即可自动打开浏览器，若希望以目录形式列出当前已有文件，请更改gulpfile.js中'webserver'任务
- 运行 gulp release --deploy dev/test/production 生成对应环境的构建版本

## 目录结构

- 其中 src/core 目录,项目初建时规定，不可任意扩展，需团队协商后再更新内容

``` js
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

## 团队协作必要工具插件(插件配置留个备份)

### Visual Studio Code

- 用户设置

```js
{
    // 编辑器
    "editor.fontSize": 13,
    "editor.minimap.enabled": false,
    "editor.formatOnSave": true,

    // 工作台
    "workbench.colorTheme": "Quiet Light",
    "workbench.iconTheme": "vscode-great-icons",

    // 文件
    "files.trimTrailingWhitespace": true,
    "files.insertFinalNewline": true,
    "files.autoSave": "off",

    // beautify config
    "beautify.config": {
        "space_after_anon_function": false,
        "end_with_newline": true,
        "brace_style": "collapse,preserve-inline"
    },
    "beautify.language": {
        "css": ["css", "scss"]
    },
    "[markdown]": {
        "editor.wordWrap": "on",
        "editor.quickSuggestions": true
    },
    "markdownlint.config": {
        "MD033": {
            "allowed_elements": ["a"]
        },
        "MD029": {
            "style": "ordered"
        }
    },
    // 保存时编译css
    "csscomb.formatOnSave": true,
    "csscomb.preset": {
        "exclude": [
            ".git/**",
            "node_modules/**",
            "bower_components/**"
        ],
        "always-semicolon": true,
        "block-indent": "    ",
        "color-case": "lower",
        "color-shorthand": true,
        "element-case": "lower",
        "eof-newline": true,
        "leading-zero": false,
        "quotes": "single",
        "remove-empty-rulesets": true,
        "space-after-colon": " ",
        "space-after-combinator": " ",
        "space-after-opening-brace": "\n",
        "space-after-selector-delimiter": "\n",
        "space-before-closing-brace": "\n",
        "space-before-colon": "",
        "space-before-combinator": " ",
        "space-before-opening-brace": " ",
        "space-before-selector-delimiter": "",
        "space-between-declarations": "\n",
        "strip-spaces": true,
        "unitless-zero": true,
        "vendor-prefix-align": true,
        "sort-order": [
            [
                "font",
                "font-family",
                "font-size",
                "font-weight",
                "font-style",
                "font-variant",
                "font-size-adjust",
                "font-stretch",
                "font-effect",
                "font-emphasize",
                "font-emphasize-position",
                "font-emphasize-style",
                "font-smooth",
                "line-height"
            ],
            [
                "position",
                "z-index",
                "top",
                "right",
                "bottom",
                "left"
            ],
            [
                "display",
                "visibility",
                "float",
                "clear",
                "overflow",
                "overflow-x",
                "overflow-y",
                "-ms-overflow-x",
                "-ms-overflow-y",
                "clip",
                "zoom",
                "flex-direction",
                "flex-order",
                "flex-pack",
                "flex-align"
            ],
            [
                "-webkit-box-sizing",
                "-moz-box-sizing",
                "box-sizing",
                "width",
                "min-width",
                "max-width",
                "height",
                "min-height",
                "max-height",
                "margin",
                "margin-top",
                "margin-right",
                "margin-bottom",
                "margin-left",
                "padding",
                "padding-top",
                "padding-right",
                "padding-bottom",
                "padding-left"
            ],
            [
                "table-layout",
                "empty-cells",
                "caption-side",
                "border-spacing",
                "border-collapse",
                "list-style",
                "list-style-position",
                "list-style-type",
                "list-style-image"
            ],
            [
                "content",
                "quotes",
                "counter-reset",
                "counter-increment",
                "resize",
                "cursor",
                "-webkit-user-select",
                "-moz-user-select",
                "-ms-user-select",
                "user-select",
                "nav-index",
                "nav-up",
                "nav-right",
                "nav-down",
                "nav-left",
                "-webkit-transition",
                "-moz-transition",
                "-ms-transition",
                "-o-transition",
                "transition",
                "-webkit-transition-delay",
                "-moz-transition-delay",
                "-ms-transition-delay",
                "-o-transition-delay",
                "transition-delay",
                "-webkit-transition-timing-function",
                "-moz-transition-timing-function",
                "-ms-transition-timing-function",
                "-o-transition-timing-function",
                "transition-timing-function",
                "-webkit-transition-duration",
                "-moz-transition-duration",
                "-ms-transition-duration",
                "-o-transition-duration",
                "transition-duration",
                "-webkit-transition-property",
                "-moz-transition-property",
                "-ms-transition-property",
                "-o-transition-property",
                "transition-property",
                "-webkit-transform",
                "-moz-transform",
                "-ms-transform",
                "-o-transform",
                "transform",
                "-webkit-transform-origin",
                "-moz-transform-origin",
                "-ms-transform-origin",
                "-o-transform-origin",
                "transform-origin",
                "-webkit-animation",
                "-moz-animation",
                "-ms-animation",
                "-o-animation",
                "animation",
                "-webkit-animation-name",
                "-moz-animation-name",
                "-ms-animation-name",
                "-o-animation-name",
                "animation-name",
                "-webkit-animation-duration",
                "-moz-animation-duration",
                "-ms-animation-duration",
                "-o-animation-duration",
                "animation-duration",
                "-webkit-animation-play-state",
                "-moz-animation-play-state",
                "-ms-animation-play-state",
                "-o-animation-play-state",
                "animation-play-state",
                "-webkit-animation-timing-function",
                "-moz-animation-timing-function",
                "-ms-animation-timing-function",
                "-o-animation-timing-function",
                "animation-timing-function",
                "-webkit-animation-delay",
                "-moz-animation-delay",
                "-ms-animation-delay",
                "-o-animation-delay",
                "animation-delay",
                "-webkit-animation-iteration-count",
                "-moz-animation-iteration-count",
                "-ms-animation-iteration-count",
                "-o-animation-iteration-count",
                "animation-iteration-count",
                "-webkit-animation-direction",
                "-moz-animation-direction",
                "-ms-animation-direction",
                "-o-animation-direction",
                "animation-direction",
                "text-align",
                "-webkit-text-align-last",
                "-moz-text-align-last",
                "-ms-text-align-last",
                "text-align-last",
                "vertical-align",
                "white-space",
                "text-decoration",
                "text-emphasis",
                "text-emphasis-color",
                "text-emphasis-style",
                "text-emphasis-position",
                "text-indent",
                "-ms-text-justify",
                "text-justify",
                "letter-spacing",
                "word-spacing",
                "-ms-writing-mode",
                "text-outline",
                "text-transform",
                "text-wrap",
                "text-overflow",
                "-ms-text-overflow",
                "text-overflow-ellipsis",
                "text-overflow-mode",
                "-ms-word-wrap",
                "word-wrap",
                "word-break",
                "-ms-word-break",
                "-moz-tab-size",
                "-o-tab-size",
                "tab-size",
                "-webkit-hyphens",
                "-moz-hyphens",
                "hyphens",
                "pointer-events"
            ],
            [
                "opacity",
                "filter:progid:DXImageTransform.Microsoft.Alpha(Opacity",
                "-ms-filter:\\'progid:DXImageTransform.Microsoft.Alpha",
                "-ms-interpolation-mode",
                "color",
                "border",
                "border-width",
                "border-style",
                "border-color",
                "border-top",
                "border-top-width",
                "border-top-style",
                "border-top-color",
                "border-right",
                "border-right-width",
                "border-right-style",
                "border-right-color",
                "border-bottom",
                "border-bottom-width",
                "border-bottom-style",
                "border-bottom-color",
                "border-left",
                "border-left-width",
                "border-left-style",
                "border-left-color",
                "-webkit-border-radius",
                "-moz-border-radius",
                "border-radius",
                "-webkit-border-top-left-radius",
                "-moz-border-radius-topleft",
                "border-top-left-radius",
                "-webkit-border-top-right-radius",
                "-moz-border-radius-topright",
                "border-top-right-radius",
                "-webkit-border-bottom-right-radius",
                "-moz-border-radius-bottomright",
                "border-bottom-right-radius",
                "-webkit-border-bottom-left-radius",
                "-moz-border-radius-bottomleft",
                "border-bottom-left-radius",
                "-webkit-border-image",
                "-moz-border-image",
                "-o-border-image",
                "border-image",
                "-webkit-border-image-source",
                "-moz-border-image-source",
                "-o-border-image-source",
                "border-image-source",
                "-webkit-border-image-slice",
                "-moz-border-image-slice",
                "-o-border-image-slice",
                "border-image-slice",
                "-webkit-border-image-width",
                "-moz-border-image-width",
                "-o-border-image-width",
                "border-image-width",
                "-webkit-border-image-outset",
                "-moz-border-image-outset",
                "-o-border-image-outset",
                "border-image-outset",
                "-webkit-border-image-repeat",
                "-moz-border-image-repeat",
                "-o-border-image-repeat",
                "border-image-repeat",
                "outline",
                "outline-width",
                "outline-style",
                "outline-color",
                "outline-offset",
                "background",
                "filter:progid:DXImageTransform.Microsoft.AlphaImageLoader",
                "background-color",
                "background-image",
                "background-repeat",
                "background-attachment",
                "background-position",
                "background-position-x",
                "-ms-background-position-x",
                "background-position-y",
                "-ms-background-position-y",
                "-webkit-background-clip",
                "-moz-background-clip",
                "background-clip",
                "background-origin",
                "-webkit-background-size",
                "-moz-background-size",
                "-o-background-size",
                "background-size",
                "box-decoration-break",
                "-webkit-box-shadow",
                "-moz-box-shadow",
                "box-shadow",
                "filter:progid:DXImageTransform.Microsoft.gradient",
                "-ms-filter:\\'progid:DXImageTransform.Microsoft.gradient",
                "text-shadow"
            ]
        ]
    }
}
```

- 编辑器插件
  - Beautify
  - CSScomb (export CSSCOMB_CONFIG=/Users/xjq/.csscomb.json)
  - Auto Rename Tag
  - Auto Close Tag
  - Beble ES6/ES7
  - ESLint
  - TSLint
  - markdownlint
  - VSCode Great Icons
  - Complete JSDoc Tags
  - JavaScript(ES6) code snippets

### sublime

- Preferences/ Settings - User / 中贴入如下配置项

```json

{
    "tab_size": 4,
    "translate_tabs_to_spaces": true,
    "trim_trailing_white_space_on_save": true,
    "ensure_newline_at_eof_on_save": true,
    "font_size": 12,
    "color_scheme": "Packages/User/SublimeLinter/Monokai (SL).tmTheme",
    "show_encoding": true,
    "ignored_packages":
    [
        "node_modules"
    ]
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

- 为了团队协作，格式化插件必须安装，其中CSScomb安装后，修改下配置项

```js
    // Set space before `{`.
    "space-before-opening-brace": " ",
    此处默认是"\n"换行，修改成空格" "即可
```