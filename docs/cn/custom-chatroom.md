- [Chatroom 组件详细介绍](#chatroom-组件详细介绍)
  - [自定义 GiftMessageList 组件](#自定义-giftmessagelist-组件)
  - [自定义 GlobalBroadcast 组件](#自定义-globalbroadcast-组件)
  - [自定义消息列表项样式](#自定义消息列表项样式)
  - [自定义聊天室成员列表项样式](#自定义聊天室成员列表项样式)

# Chatroom 组件详细介绍

Chatroom 组件提供了自定义配置，除了提供常规的配置之外，还可以替换它依赖的组件。

## 自定义 GiftMessageList 组件

Chatroom 组件由其他组件组成，这些组件可能无法满足需求，那么，可以替换它。例如：替换 GiftMessageList 组件。只要满足约束 GiftMessageListComponent 就可以。替换的组件可以实现自定义的业务逻辑、实现自定义的样式。
例如：

```tsx
export const MyGiftMessageList: GiftMessageListComponent = React.forwardRef<
  GiftMessageListRef,
  GiftMessageListProps
>(function (
  props: GiftMessageListProps,
  ref?: React.ForwardedRef<GiftMessageListRef>
) {
  // todo: Implement your own business logic, or modify existing business logic.
  const {} = props;
  React.useImperativeHandle(
    ref,
    () => {
      return {
        pushTask: (task: GiftMessageListTask) => {
          // todo: Implement this interface.
        },
      };
    },
    []
  );
  return <></>;
});
```

替换默认 GiftMessageList 组件

```tsx
<Chatroom GiftMessageList={MyGiftMessageList} />
```

## 自定义 GlobalBroadcast 组件

全局广播消息的组件 GlobalBroadcast 替换。 只要满足约束 GlobalBroadcastComponent 就可以。

```tsx
export const MyGlobalBroadcast = React.forwardRef<
  GlobalBroadcastRef,
  GlobalBroadcastProps
>(function (
  props: GlobalBroadcastProps,
  ref?: React.ForwardedRef<GlobalBroadcastRef>
) {
  // todo: Implement your own business logic, or modify existing business logic.
  React.useImperativeHandle(
    ref,
    () => {
      return {
        pushTask: (task: GlobalBroadcastTask) => {
          // todo:  Implement this interface.
        },
      };
    },
    []
  );
  return <></>;
});
```

替换默认 GlobalBroadcast 组件。

```tsx
<Chatroom GlobalBroadcast={MyGlobalBroadcast} />
```

## 自定义消息列表项样式

修改组件的消息样式。例如：

```tsx
export function MyMessageListItem(props: MessageListItemProps) {
  // todo: Implement your own business logic, or modify existing business logic.
  return <></>;
}
export const MyMessageListItemMemo = React.memo(MyMessageListItem);
```

修改后的组件添加到 Chatroom。

```tsx
<Chatroom
  messageList={{
    props: {
      MessageListItemComponent: MyMessageListItemMemo,
    },
  }}
/>
```

## 自定义聊天室成员列表项样式

修改聊天室成员组件列表样式。例如：

```tsx
export function MyParticipantListItem(props: ParticipantListItemProps) {
  // todo: Implement your own business logic, or modify existing business logic.
  return <></>;
}

export const MyParticipantListItemMemo = React.memo(MyParticipantListItem);
```

修改后的组件添加到 Chatroom。

```tsx
<Chatroom
  participantList={{
    props: {
      MemberItemComponent: MyParticipantListItemMemo,
    },
  }}
/>
```
