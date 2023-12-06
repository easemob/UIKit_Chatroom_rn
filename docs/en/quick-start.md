### Prerequisites

#### Get the App Key

Register an app on the [Agora Console](https://console.agora.io/) and get the app key.

![get_appkey](../get_appkey.png)

#### Create an account

Create a user account on the [Agora Console](https://console.agora.io/).

![create_user](../create_user.png)

#### Create a chat room

Create a chat room on the [Agora Console](https://console.agora.io/).

![create_room](../create_room.png)

### Initialization

During initialization, you need to fill in the required parameters and configurations and place `Container` at the root of the component tree.

```tsx
export function App() {
  const appKey = '<your app key>';
  return (
    <Container appKey={appKey}>{/* // todo: Add components here.*/}</Container>
  );
}
```

### Login

You need to log in to the server before entering the chat room.

```tsx
// ...
// Get the IM service object.
const im = useRoomContext();
// ...
// Login service.
// Set the required parameters: userId, userToken, and userNickname.
im.login({
  userId: '<user ID>',
  userToken: '<user token>',
  userNickname: '<user nick name>',
  userAvatarURL: '<user avatar url>',
  gender: 1,
  identify: '<user custom data>',
  result: ({ isOk, error }) => {
    // todo: isOk === true The user login succeeds.
    // todo: isOk === false The user login fails.
  },
});
```

### Entering the chat room

Before entering the chat room, you need to get the chat room ID and user ID of the chat room creator by calling `im.fetchChatroomList`.

By loading the `Chatroom` component, you automatically join the chat room. The result of joining the chat room is returned. If this component fails to be loaded, you can call the related method to join the chat room.

```tsx
// ...
// Create a component reference object.
const chatroomRef = React.useRef<Chatroom>({} as any);
// ...
// Listen for the change of the component status.
useRoomListener(
  React.useMemo(() => {
    return {
      onError: (params) => {
        // todo: Failure notification. For errors, see UIKitError.
        // todo: For example, a user that is kicked out of the chat room can re-enter the chat room. chatroomRef.current?.joinRoom({roomId, ownerId}});
      },
      onFinished: (params) => {
        // todo: This notification contains the completion result. For example, this notification is received after a user joins the chat room. For the notification types, see RoomEventType.
      },
    };
  }, [])
);
// ...
// Load the component to the render tree.
<Chatroom ref={chatroomRef} roomId={room.roomId} ownerId={room.owner} />;
// ...
```
