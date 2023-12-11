- [Component overview](#component-overview)
  - [Theme](#theme)
  - [Internationalization](#internationalization)
  - [Initialization](#initialization)
  - [Chatroom](#chatroom)
    - [Properties](#properties)
      - [containerStyle](#containerstyle)
      - [GiftMessageList](#giftmessagelist)
      - [GlobalBroadcast](#globalbroadcast)
      - [MessageList](#messagelist)
      - [MessageInput](#messageinput)
      - [BottomSheetParticipantList](#bottomsheetparticipantlist)
    - [Methods](#methods)
      - [getGlobalBroadcastRef](#getglobalbroadcastref)
      - [getGiftMessageListRef](#getgiftmessagelistref)
      - [getParticipantListRef](#getparticipantlistref)
      - [getMessageListRef](#getmessagelistref)
      - [joinRoom](#joinroom)
      - [leaveRoom](#leaveroom)
  - [MessageList component](#messagelist-component)
  - [ParticipantList component](#participantlist-component)
  - [GiftMessageList component](#giftmessagelist-component)
  - [GlobalBroadcast component](#globalbroadcast-component)
  - [MessageInput component](#messageinput-component)
  - [BottomToolbar component](#bottomtoolbar-component)
  - [BottomSheetGift component](#bottomsheetgift-component)
  - [ReportMessage component](#reportmessage-component)
  - [More](#more)

# Component overview

`room uikit sdk` contains the following components:

| Component Name  | Description                                                                                                                                  | Link                                          |
| --------------- | -------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- |
| Theme           | Theme component for switching between the `light` and `dark` themes and defining the color and style of all ChatroomUIKit components.        | [Theme](#theme)                               |
| I18n            | Component for setting the language of all UI components.                                                                                     | [Internationalization](#internationalization) |
| Chatroom        | Chat room component that integrates components for gift sending and receiving, message list, and participant list.                           | [Chatroom](#chatroom-component)               |
| MessageList     | Message list component for showing messages that are sent and received in the chat room.                                                     | [MessageList](#messagelist-component)         |
| ParticipantList | Chat room participant list component for participant muting and unmuting and other participant-related operations.                           | [ParticipantList](#participantlist-component) |
| GiftMessageList | Gift message list component for displaying the gifts sent by viewers.                                                                        | [GiftMessageList](#giftmessagelist-component) |
| GlobalBroadcast | Global chat room broadcast component for sending messages to all chat rooms in an app.                                                       | [GlobalBroadcast](#globalbroadcast-component) |
| MessageInput    | Message input component for sending different types of message.                                                                              | [MessageInput](#messageinput-component)       |
| BottomToolbar   | The bottom toolbar component. Custom buttons can be added. This component and the MessageInput component can be switched between each other. | [BottomToolbar](#bottomtoolbar-component)     |
| BottomSheetGift | Gift sending component. The source of gifts is designated by the developer.                                                                  | [BottomSheetGift](#bottomsheetgift-component) |
| ReportMessage   | Message reporting component.                                                                                                                 | [ReportMessage](#reportmessage-component)     |

## Theme

Two themes, `light` and `dark` are available. You can switch between the two themes.

Each UI component uses the theme.

```tsx
// ...
// Set the theme.
const palette = usePresetPalette();
const dark = useDarkTheme(palette);
const light = useLightTheme(palette);
const [theme, setTheme] = React.useState(light);
// ...
// Add the theme component to the render tree.
<Container appKey={env.appKey} palette={palette} theme={theme} />;
// ...
// Switch to the light or dark theme.
setTheme(theme === light ? dark : light);
```

Customize the theme color. You can use the built-in default theme color with `usePresetPalette` or a custom one with `useCreatePalette`.

Following is an example of how to customize the theme color.

```tsx
// Customize the theme color by modifying the hue values. Then the color of components will change accordingly.
// See https://www.figma.com/file/OX2dUdilAKHahAh9VwX8aI/Streamuikit?type=design&node-id=101-41012&mode=design&t=Fzou3Gwsk4owLLbr-4
const { createPalette } = useCreatePalette({
  colors: {
    primary: 203,
    secondary: 155,
    error: 350,
    neutral: 203,
    neutralSpecial: 220,
  },
});
const palette = createPalette();
// ...
```

## Internationalization

ChatroomUIKit supports a multilingual user interface (MUI), giving users an ability to change the UI language to the the built-in Chinese or English or other languages. For example, to use the English user interface, set `language` to `en`.

```tsx
<Container appKey={env.appKey} language={'en'} />
```

The UI language can be set with the following rules:

- If no language is specified, use the default system language.
- If the system language is neither Chinese nor English, select Chinese for use in China and English for overseas use.
- If the system language is not Chinese or English nor is a language collection provided, select Chinese and English respectively for use in China and overseas.

For example, if you specify Chinese for the ChatroomUIKit and also intend to use the language for the app, refer to the following code:

```tsx
// ...
// Create the language pack for the app.
function createLanguage(type: LanguageCode): StringSet {
  return {
    'English text.': 'English text.',
  };
}
// ...
// Set the language pack to provide the translation resource.
<Container
  appKey={env.appKey}
  language={'zh-Hans'}
  languageExtensionFactory={createLanguage}
/>;
// ...
// Add the following lines for internationalization.
const { tr } = useI18nContext();
return <Text>{tr('Chinese text.')}</Text>;
```

For example, you want to use French for both ChatroomUIKit and the app, refer to the following code:

```tsx
// ...
// Create the language extension pack for the app.
function createAppLanguage(type: LanguageCode): StringSet {
  if (type === 'fr') {
    return {
      'French text.': 'Texte français.',
    };
  }
  return {
    'French text.': 'French text.',
  };
}
// Create the language pack for the ChatroomUIKit. Change the language of values in key-value pairs to French in the `StringSet.fr.tsx` file that comes with the ChatroomUIKit.
export function createUIKitLanguage(type: LanguageCode): StringSet {
  if (type === 'fr') {
    return {
      'Private Chat': 'Private Chat',
      '...': '...',
    };
  }
}
// ...
// Set the language pack to provide the translation resource.
<Container
  appKey={env.appKey}
  language={'fr'}
  languageBuiltInFactory={createUIKitLanguage}
  languageExtensionFactory={createAppLanguage}
/>;
```

## Initialization

As the entry of `ChatroomUIKit`, the `Container` component is responsible for integration of other components and parameter configurations.

```tsx
export type ContainerProps = React.PropsWithChildren<{
  appKey: string;
  isDevMode?: boolean;
  language?: StringSetType;
  languageBuiltInFactory?: CreateStringSet;
  languageExtensionFactory?: CreateStringSet;
  palette?: Palette;
  theme?: Theme;
  roomOption?: PartialRoomOption;
  avatar?: {
    borderRadiusStyle?: CornerRadiusPaletteType;
  };
  fontFamily?: string;
  onInitialized?: () => void;
}>;
```

```tsx
// Control whether to load components in the `Chatroom` component.
export type RoomOption = {
  globalBroadcast: {
    isVisible: boolean;
  };
  gift: {
    isVisible: boolean;
  };
  messageList: {
    isVisibleGift: boolean;
    isVisibleTime: boolean;
    isVisibleTag: boolean;
    isVisibleAvatar: boolean;
  };
};
```

Except `appKey`, all parameters indicated in the preceding sample code are optional.

- isDevMode: Whether the app is running in development mode. If this parameter is set to `true`, tools like log printing are activated.
- language: Specifies the current language. If no language is defined, the current system language is used by default.
- languageBuiltInFactory: By default, the in-built language pack is used. You can modify the texts as required.
- languageExtensionFactory: Specifies the language extension pack.
- palette: Specifies the palette that is an important dependency of the theme service.
- theme: Specifies the theme. The default value is `light`.
- roomOption: Chat room options. See the global configuration service.
- avatar: Specifies the corner radius of the global avatar.
- fontFamily: Specifies a set of fonts. The system fonts are used by default and custom fonts are allowed.
- onInitialized: The callback for initialization completion.

Global parameter configurations are as follows:

- globalBroadcast: The global broadcast component. You can set whether to load the component.
- gift: The gift message list component. You can set whether to load the component.
- messageList: The message list component.
  - isVisibleGift: Whether to load the gift message component.
  - isVisibleTime: Whether to show the time.
  - isVisibleTag: Whether to show the user tag.
  - isVisibleAvatar: Whether to show the avatar.

`Container` is typically a root component at the underlying layer of the app, or at the same level as the root component.

```tsx
export function App() {
  return <Container appKey={'your app key'}>{children}</Container>;
}
```

## Chatroom

The Chatroom component provides a set of components, including the participant list component, input component, message list component, gift message component, global broadcast notification component, and menu component. It is a page-level component that basically covers the full screen. You can add a component as the background component or a child component in the Chatroom component.

```tsx
// ...
// Create a reference object.
const ref = React.useRef<Chatroom>({} as any);
// ...
// Add the component to the render tree.
<Chatroom ref={chatroomRef} roomId={room.roomId} ownerId={room.owner} />;
```

As `UIKit` lacks the routing function, you can refer to the following code example for participant search.

```tsx
<Chatroom
  ref={chatroomRef}
  participantList={{
    props: {
      onSearch: (memberType) => {
        // todo: Click the search button to open the search page.
        navigation.push('SearchParticipant', { params: { memberType } });
      },
    },
  }}
  roomId={room.roomId}
  ownerId={room.owner}
/>
```

`Chatroom` provides the following properties:

| Property                   | Required | Description                                                                    |
| -------------------------- | -------- | ------------------------------------------------------------------------------ |
| containerStyle             | No       | The component container style, like the background, position, size, and frame. |
| GiftMessageList            | No       | Renderer for the gift message component.                                       |
| GlobalBroadcast            | No       | Renderer for the global broadcast component.                                   |
| MessageList                | No       | Renderer for the message list component.                                       |
| MessageInput               | No       | Renderer for the input component.                                              |
| BottomSheetParticipantList | No       | Renderer for the participant list component.                                   |
| input                      | No       | Input component property.                                                      |
| messageList                | No       | Message list property.                                                         |
| globalBroadcast            | No       | Global broadcast for chat rooms in the app.                                    |
| gift                       | No       | Gift message property.                                                         |
| participantList            | No       | Participant list property.                                                     |
| backgroundView             | No       | Background component.                                                          |

`Chatroom` provides the following methods:

| Method                | Description                                                       |
| --------------------- | ----------------------------------------------------------------- |
| getGlobalBroadcastRef | Gets the reference of the `GlobalBroadcast` component.            |
| getGiftMessageListRef | Gets the reference of the `GiftMessageList` component.            |
| getParticipantListRef | Gets the reference of the `BottomSheetParticipantList` component. |
| getMessageListRef     | Gets the reference of the `MessageList` component.                |
| joinRoom              | Joins a chat room.                                                |
| leaveRoom             | Leaves a chat room.                                               |

![chatroom](../chatroom.png)

### Properties

#### containerStyle

This property controls styles of the `Chatroom`, like the background, position, size, and frame.

#### GiftMessageList

By default, the internal component `GiftMessageList` is used. You can easily define a custom component of the `GiftMessageListComponent` type by extending or modifying the `GiftMessageList` component. You have full control of the custom component.

#### GlobalBroadcast

By default, the internal component `GlobalBroadcast` is used. You can define a custom component of the `GlobalBroadcastComponent` type.

#### MessageList

By default, the internal component `MessageList` is used. You can define a custom component of the `GlobalBroadcastComponent` type.

#### MessageInput

By default, the internal component `MessageInput` is used. You can define a custom component of the `MessageInputComponent` type.

This component contains the `BottomToolbar` component. Therefore, Proceed with caution when creating a custom component.

#### BottomSheetParticipantList

By default, the internal component `BottomSheetParticipantList` is used. You can define a custom component of the `BottomSheetParticipantListComponent` type.

### Methods

#### getGlobalBroadcastRef

This method gets the reference of the `GlobalBroadcast` component. By default, the broadcast message is displayed after it is received from the server. You can insert a custom global broadcast message.

#### getGiftMessageListRef

This method gets the reference of the `GiftMessageList` component.

#### getParticipantListRef

This method gets the reference of the `BottomSheetParticipantList` component.

You can customize how to manage participants in a chat room.

#### getMessageListRef

This method gets the reference of the `MessageList` component.

By default, a message is displayed when it is sent or received. You can insert a custom message, delete a message or scroll to the bottom of the message list.

#### joinRoom

When loading the `Chatroom` component, you join the chat room automatically. If you fail to join the chat room due to network issues or other reasons, you can call this method to rejoin the chat room.

#### leaveRoom

You can call this method to leave the chat room without unloading the Chatroom component.

## MessageList component

The chat room message area component `MessageList` shows messages that are sent successfully, including text messages, emoji icons, and gift messages.

You can perform operations on a message by long pressing a message list item, for example, translating a text message, recalling a message, and reporting a message.

The data reporting component allows you to add types of inappropriate message, like politics and violence and terrorism.

```tsx
// ...
// Create a component reference object.
const ref = React.useRef<MessageListRef>({} as any);
// Add the message list component to the render tree.
<MessageList ref={ref} />;
// ...
// Add a message to the message list. Then the message is displayed on the message list.
ref?.current?.addSendedMessage?.(message);
```

`MessageList` provides the following properties:

| Property                 | Required | Description                                                                                                                                                         |
| ------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| visible                  | No       | Controls whether the component is visible.                                                                                                                          |
| onUnreadCount            | No       | Callback triggered when the number of unread messages changes.                                                                                                      |
| onLongPressItem          | No       | Callback triggered when a message list item is long pressed.                                                                                                        |
| containerStyle           | No       | Specifies the component container style, like the background, position, size, and frame.                                                                            |
| onLayout                 | No       | Callback triggered when the component layout is changed.                                                                                                            |
| MessageListItemComponent | No       | Renderer for message list items.                                                                                                                                    |
| reportProps              | No       | Properties of the message reporting component.                                                                                                                      |
| maxMessageCount          | No       | Specifies the maximum number of messages that can be displayed. The default value is `1000`. If the maximum value is exceeded, the oldest messages will be deleted. |
| messageMenuItems         | No       | Custom message menu items appended to the built-in menu.                                                                                                            |

`MessageList` provides the following methods:

| Method           | Description                                             |
| ---------------- | ------------------------------------------------------- |
| addSendedMessage | Sends the content in the input box to the message list. |
| scrollToEnd      | Scrolls to the bottom of the message list.              |

![message_context_menu](../message_context_menu.png)
![message_report](../message_report.png)

## ParticipantList component

This component is used to show and manage chat room participants, like searching for, muting, or removing a participant.

The chat room owner can manage participants, for example, muting a participant or kicking a participant out of the chat room.

**Note**

As the entry for displaying the ParticipantList component is not in `UIKit`, you need to implement the entry yourself, for example, by adding a button to display the chat room participant list component upon a click of this button.

The `BottomSheetParticipantList` component consists of `SimulativeModal` and `ParticipantList`. It is an independent component that can be shown or hidden.

```tsx
// ...
// Create a component reference object.
const ref = React.useRef<BottomSheetParticipantListRef>({} as any);
// Add the participant list component to the render tree.
<BottomSheetParticipantList ref={this.ref} />;
// ...
// You can implement specific display actions, like adding a button to show the participant list upon a click of it.
ref?.current?.startShow?.();
```

`BottomSheetParticipantList` provides the following properties:

| Property            | Required | Description                                                                                                    |
| ------------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| onSearch            | No       | Callback triggered upon a click of the search icon.                                                            |
| onNoMoreMember      | No       | Callback triggered if there are no more members when a user scrolls the participant list to load more members. |
| containerStyle      | No       | Specifies the component container style, like the background, position, size, and frame.                       |
| maskStyle           | No       | Specifies the style of the area outside the component container.                                               |
| MemberItemComponent | No       | Renderer for participant list items.                                                                           |

`BottomSheetParticipantList` provides the following method:

| Method                | Description                                                                  |
| --------------------- | ---------------------------------------------------------------------------- |
| startShow             | Shows component.                                                             |
| startHide             | Hides component. A callback is returned when the animation is hided.         |
| getParticipantListRef | Gets the reference of the participant list component or mute list component. |

`ParticipantList` provides the following methods:

| Method       | Description                                                                                        |
| ------------ | -------------------------------------------------------------------------------------------------- |
| initMenu     | Initializes the menu for the custom member list, with built-in menu items followed by custom ones. |
| removeMember | Deletes a participant.                                                                             |
| muteMember   | Mutes or unmutes a participant.                                                                    |
| closeMenu    | Closes the menu.                                                                                   |

![member_list](../member_list.png)
![member_context_menu](../member_context_menu.png)

## GiftMessageList component

The gift message component is used to show the sent gifts. Gift messages can be displayed on the message list or in this component.

```tsx
// ...
// Create a component reference object.
const ref = React.useRef<GiftMessageListRef>({} as any);
// Add the component to the render tree.
<GiftMessageList ref={ref} />;
// ...
// Add gift messages to the component message queue, which line up for being displayed.
ref.current?.pushTask({
  model: {
    id: seqId('_gf').toString(),
    nickName: 'NickName',
    giftCount: 1,
    giftIcon: 'http://notext.png',
    content: 'send Agoraship too too too long',
  },
});
```

`GiftMessageList` provides the following properties:

| Property                | Required | Description                                                                           |
| ----------------------- | -------- | ------------------------------------------------------------------------------------- |
| visible                 | No       | Whether the component is visible.                                                     |
| containerStyle          | No       | Specifies the component container style, such as the background, position, and frame. |
| GiftEffectItemComponent | No       | Renderer for the gift message list items.                                             |

`GiftMessageList` provides the following methods:

| Method   | Description                                                                    |
| -------- | ------------------------------------------------------------------------------ |
| pushTask | Adds the gift message tasks to the queue, which will line up for being loaded. |

## GlobalBroadcast component

This component receives and displays global broadcast messages which will be added to the message queue to wait in line for being displayed.

```tsx
// ...
// Create a component reference object.
const ref = React.useRef<GlobalBroadcastRef>({} as any);
// ...
// Add the component to the render tree.
<GlobalBroadcast ref={ref} />;
// ...
// Add messages to the task queue, which will line up for being displayed.
let count = 1;
ref.current?.pushTask?.({
  model: {
    id: count.toString(),
    content: count.toString() + content,
  },
});
```

`GlobalBroadcast` provides the following properties:

| Property                | Required | Description                                                                              |
| ----------------------- | -------- | ---------------------------------------------------------------------------------------- |
| visible                 | No       | Whether this component is visible.                                                       |
| playSpeed               | No       | Specifies the playback speed, which is 8 by default.                                     |
| containerStyle          | No       | Specifies the component container style, like the background, position, size, and frame. |
| textStyle               | No       | Specifies the text style of the component.                                               |
| icon                    | No       | Specifies the icon style of the component.                                               |
| GiftEffectItemComponent | No       | Renderer for gift message list items.                                                    |
| onFinished              | No       | Callback triggered when all messages are played.                                         |
| onLayout                | No       | Callback triggered when the component layout changes.                                    |

`GlobalBroadcast` provides the following methods:

| Method   | Description                                                                          |
| -------- | ------------------------------------------------------------------------------------ |
| pushTask | Adds the messages to the message queue, which will wait in line for being displayed. |

## MessageInput component

The message input component allows you to type texts and emojis and send them. The MessageInput component or BottomToolbar component can be switched between each other.

```tsx
// ...
// Create a component reference object.
const ref = React.useRef<MessageInputRef>({} as any);
// ...
// Add the component to the render tree.
<MessageInput
  ref={ref}
  onSended={(_content, message) => {
    // todo: Call the message list reference object to add messages to the message list.
  }}
/>;
// ...
// Hide the message input component. //
ref?.current?.close?.();
```

`MessageInput` provides the following properties:

| Property               | Required | Description                                                                                                    |
| ---------------------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| onInputBarWillShow     | No       | Callback triggered when the MessageInput component is about to display.                                        |
| onInputBarWillHide     | No       | Callback triggered when the BottomToolbar component is about to display.                                       |
| onSended               | No       | Callback triggered when a message is sent.                                                                     |
| keyboardVerticalOffset | No       | Specifies the keyboard offset.                                                                                 |
| closeAfterSend         | No       | Controls whether to show the BottomToolbar component only.                                                     |
| first                  | No       | Specifies the first custom component in the BottomToolbar component.                                           |
| after                  | No       | Specifies the custom component list in the BottomToolbar component. Up to three custom components are allowed. |
| onLayout               | No       | Callback triggered when the layout of the BottomToolbar component changes.                                     |

`MessageInput` provides the following method:

| Method | Description                                                             |
| ------ | ----------------------------------------------------------------------- |
| close  | Shows the BottomToolbar component and hides the MessageInput component. |

![input_bar](../input_bar.png)
![emoji_list.png](../emoji_list.png)

## BottomToolbar component

This component provides message input styles. This component and the MessageInput component can be switched between each other.

## BottomSheetGift component

The gift list component provides a custom gift list. Users can click a gift to send it to the chat room.

**Note**

The gift list component is an independent component and you need to implement how to show and load it.

```tsx
// ...
// Create a component reference object.
const ref = React.useRef<BottomSheetGiftSimuRef>({} as any);
// ...
// Add the component to the render tree.
<BottomSheetGift
  ref={ref}
  gifts={[
    {
      title: 'gift1',
      gifts: [
        {
          giftId: '2665752a-e273-427c-ac5a-4b2a9c82b255',
          giftIcon:
            'https://fullapp.oss-cn-beijing.aliyuncs.com/uikit/pictures/gift/AUIKitGift1.png',
          giftName: 'Sweet Heart',
          giftPrice: 1,
        },
      ],
    },
  ]}
  onSend={(giftId) => {
    // todo: Send the selected gift.
  }}
/>;
// ...
// Show the gift list component
ref?.current?.startShow?.();
```

**Note: The gift sending component provides `BottomSheetGift` and `BottomSheetGift2`, with the former as a modal component and the latter a non-modal component.**

`BottomSheetGift` provides the following properties:

| Property  | Required | Description                                         |
| --------- | -------- | --------------------------------------------------- |
| gifts     | No       | Gift list array.                                    |
| maskStyle | No       | Styles of area outside the component container.     |
| onSend    | No       | Callback triggered upon a click of the Send button. |

`BottomSheetGift` provides the following methods:

| Method            | Description                                                         |
| ----------------- | ------------------------------------------------------------------- |
| startShow         | Shows component.                                                    |
| startShowWithInit | Shows component and initializes the list.                           |
| startHide         | Hides component and returns a callback when the animation is hided. |

![gift_list](../gift_list.png)

## ReportMessage component

This component is used to set the contents to report.

```tsx
// ...
// Create a component reference object.
const ref = React.useRef<BottomSheetMessageReport>({} as any);
// ...
// Add the component to the render tree.
<BottomSheetMessageReport
  ref={ref}
  onReport={getOnReport.onReport}
  data={getReportData}
/>;
// ...
//  Show the component.
ref?.current?.startShow?.();
// ...
//  Select the inappropriate message types to report.
```

`BottomSheetMessageReport` provides the following properties:

| Property       | Required | Description                                                                        |
| -------------- | -------- | ---------------------------------------------------------------------------------- |
| data           | No       | Array of the inappropriate message types.                                          |
| maskStyle      | No       | Styles of the area outside the component container.                                |
| containerStyle | No       | Styles of the component container, like the background, position, size, and frame. |
| onReport       | No       | Callback triggered upon a click on the report button.                              |

`BottomSheetMessageReport` provides the following methods:

| Method    | Description                                                         |
| --------- | ------------------------------------------------------------------- |
| startShow | Shows component.                                                    |
| startHide | Hides component and returns a callback when the animation is hided. |

![message_report](../message_report.png)

## More

// todo: Continue to be updated
