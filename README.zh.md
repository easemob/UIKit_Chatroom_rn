_中文 | [English](./README.md)_

<p align="center">
  <a href="https://github.com/AsteriskZuo/react-native-chat-room/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="react-native-chat-room is released under the MIT license." />
  </a>
  <a href="https://github.com/AsteriskZuo/react-native-chat-room/actions/workflows/ci.yml">
    <img src="https://github.com/AsteriskZuo/react-native-chat-room/actions/workflows/ci.yml/badge.svg" alt="Current GithubCI build status." />
  </a>
  <a href="https://www.npmjs.org/package/react-native-chat-room">
    <img src="https://img.shields.io/npm/v/react-native-chat-room?color=brightgreen&label=npm%20package" alt="Current npm package version." />
  </a>
</p>

- [聊天室 UIKit 介绍](#聊天室-uikit-介绍)
  - [开发环境要求](#开发环境要求)
  - [安装 UIKit 到项目中](#安装-uikit-到项目中)
  - [示例项目演示](#示例项目演示)
    - [项目初始化](#项目初始化)
  - [项目结构](#项目结构)
  - [快速开始](#快速开始)
  - [自定义配置](#自定义配置)
  - [贡献](#贡献)
  - [许可证](#许可证)

# 聊天室 UIKit 介绍

本产品主要为了解决大部分用户的泛娱乐业务场景下对聊天室的绝大部分用户需求，主要为用户解决直接集成 SDK 繁琐，复杂度高，部分 api 体验不好（在用户侧开发者来看）等问题。致力于打造集成简单，自由度高，流程简单，文档说明足够详细的聊天室 UIKit 产品。

## 开发环境要求

- MacOS 12 或以上版本
- React-Native 0.66 或以上版本
- NodeJs 16.18 或以上版本

对于 `iOS` 应用：

- Xcode 13 或以上版本，以及它的相关依赖工具。

对于 `Android` 应用：

- Android Studio 2021 或以上版本，以及它的相关依赖工具。

## 安装 UIKit 到项目中

```sh
npm install react-native-chat-room
# or
yarn add react-native-chat-room
# or
npx expo install react-native-chat-room
```

## 示例项目演示

在 `example` 文件夹中，是示例项目，可以通过 下载 源码 编译运行体验。

下载源码仓库：

```sh
git clone https://github.com/agora/rncr/react-native-chat-room
```

或者下载源码压缩包

```sh
curl -L -o file.zip  https://github.com/AsteriskZuo/react-native-chat-room/archive/refs/heads/main.zip
```

### 项目初始化

进入项目根目录，执行 `yarn & yarn env` 完成初始化。

在生成的文件 `example/src/env.ts` 中 ，修改必要配置项。

对于 `iOS` 应用：

需要执行 `pod install` 命令完成初始化。

对于 `Android` 应用：

需要执行 `gradle sync` 命令完成初始化。

## 项目结构

项目的主要结构如下：

```sh
.
├── biz // 含有业务的UI组件。
├── config // 全局配置服务。
├── container // UIKit 入口 组件。
├── dispatch // 事件分发服务，可以在联系紧密的组件间发送接收通知。
├── error // 错误对象，提供统一的错误码。
├── hook // Function组件工具，Class组件无法使用。
├── i18n // 国际化服务
├── room // Agora Chat SDK 服务，提供更加便捷的使用，提供统一的错误处理。
├── theme // 主题服务，提供light和dark主题，可以自定义基本色。
├── ui // 基础 UI 组件，其它高级组件的基础支撑，支持主题。
└── utils // 工具集合
```

![svg](./docs/chatroom_architecture.svg)

## 快速开始

[quick start portal](./docs/cn/quick-start.md)

## 自定义配置

[custom configure portal](./docs/cn/custom-configure.md)

## 贡献

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## 许可证

MIT
