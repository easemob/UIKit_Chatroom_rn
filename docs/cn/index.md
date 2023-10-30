## 项目概述

该项目为 `Agora Chatroom UIKit SDK`, 简称 `UIKit`。在 `Agora Chat SDK` 基础上提供了聊天室 UI 组件的集合。可以更快帮助用户搭建聊天室。

## 最低要求

使用该项目的要求：

- MacOS 12 或以上版本
- React-Native 0.66 或以上版本
- NodeJs 16.18 或以上版本

对于 `iOS` 应用：

- Xcode 13 或以上版本，以及它的相关依赖工具。

对于 `Android` 应用：

- Android Studio 2021 或以上版本，以及它的相关依赖工具。

## 项目结构

项目的主要结构如下：

```sh
.
├── biz // 含有业务的UI组件, 例如：聊天室一级组件、成员列表二级组件等。
├── config // 全局配置服务，例如：是否激活 `UIKit` 日志。
├── container // UIKit 入口 组件
├── dispatch // 事件分发服务，可以在联系紧密的组件间发送接收通知。
├── error // 错误对象，提供统一的错误码。
├── hook // Function组件工具，Class组件无法使用。
├── i18n // 国际化服务
├── im // Agora Chat SDK 服务，提供更加便捷的使用，提供统一的错误处理。
├── theme // 主题服务，提供light和dark主题，可以自定义基本色。
├── ui // 基础 UI 组件，其它高级组件的基础支撑，支持主题。
└── utils // 工具集合
```

![svg](../chatroom_architecture.svg)

## 命名约定

组件也是有多种分类的，根据 React-Native 的使用习惯，这里列举说明主要的命名约定。

- index.tsx 为对象的导出文件
- types.tsx 为类型声明的导出文件
- const.tsx 为常量文件，通常不对外
- Context：为数据共享的上下文对象。主题、国际化等都是通过该方式提供服务的。
- Provider：为数据共享的提供者对象
- Consumer：为数据共享的消费者对象
- Container：为 `UIKit` 的入口组件。集成了所有其他内部提供的服务和组件，使用者需要首先使用该组件进行初始化等操作。
- use 开头的：hook 工具，Function 组件使用，Class 组件不能使用。本 `UIKit` 主要以 `Function` 组件为主。
- 后缀 Props：为 UI 组件的参数类型
- 后缀 Memo：为 UI 组件的带缓存的类型
- 后缀 Ref：为 UI 组件的句柄，可以控制组件。例如：获取焦点、显示模态窗口。
- 后缀 Model：为 UI 组件的参数里面的数据类型。
- 后缀 Service：为非 UI 组件。提供一定服务。例如：IMService。

## 组件概览

// todo:

## 容器组件介绍

`Chatroom UIKit SDK` 的入口就是 `Container` 组件，它主要负责集成其他所有的 `Provider` 组件、初始化组件、初始化 Chat SDK、配置参数等。

```typescript
export type ContainerProps = React.PropsWithChildren<{
  appKey: string;
  isDevMode?: boolean;
  language?: StringSetType;
  languageFactory?: CreateStringSet;
  palette?: Palette;
  theme?: Theme;
  roomOption?: PartialRoomOption;
}>;
```

除了 `appKey` 之外都是可选参数。

- isDevMode: 如果设置为 `true`，则激活日志打印等工具。
- language: 设置当前的语言，如果没有设置，则获取系统当前的语言作为默认值。
- languageFactory: 如果没有设置则使用内置的语言资源。
- palette: 设置当前的调色板，主题服务的重要依赖。
- theme: 如果没有设置主题，将使用 `light` 为默认主题。
- roomOption: 聊天室选项。具体参见 全局配置服务。

通常 `Container` 会处于应用的底层，一般为根组件，或者是根组件同一级别。例如：

```typescript
export function App() {
  return (
    <Container
      appKey={'your app key'}
    >
      {children}
    </Container>
  );
}
```

## 业务组件介绍

// todo: 配图，动图？

### MessageList
### GiftFloating
### Marquee
### InputBar
### InputBarStyle
### BottomSheetMemberList
### BottomSheetGift
### Chatroom



## 主题介绍

## 国际化介绍

## 更多

其它组件可以通过使用上下文进行了解。
