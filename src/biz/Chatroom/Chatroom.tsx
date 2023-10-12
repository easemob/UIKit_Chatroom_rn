import type { ErrorInfo } from 'react';
import * as React from 'react';
import type { ViewStyle } from 'react-native';
import type { StyleProp } from 'react-native';
import { View } from 'react-native';

import { InputBar, InputBarProps, InputBarRef } from '../InputBar';
import { MessageList, MessageListRef } from '../MessageList';

export type ChatroomProps = Omit<
  InputBarProps,
  'onInputBarWillShow' | 'onInputBarWillHide' | 'onSend'
> & {
  containerStyle?: StyleProp<ViewStyle>;
};
type ChatroomState = {
  isInputBarShow: boolean;
};

export class Chatroom extends React.Component<ChatroomProps, ChatroomState> {
  inputBarRef?: React.RefObject<InputBarRef>;
  messageRef?: React.RefObject<MessageListRef>;
  constructor(props: ChatroomProps) {
    super(props);
    this.inputBarRef = React.createRef();
    this.messageRef = React.createRef();
    this.state = {
      isInputBarShow: false,
    };
  }

  componentDidMount?(): void {}
  componentWillUnmount?(): void {}
  componentDidCatch?(_error: Error, _errorInfo: ErrorInfo): void {}

  render(): React.ReactNode {
    const { containerStyle, ...others } = this.props;
    return (
      <View style={[{ flex: 1 }, containerStyle]}>
        <MessageList
          ref={this.messageRef}
          onRequestCloseInputBar={() => {
            if (this.inputBarRef?.current?.close) {
              this.inputBarRef.current.close();
            }
          }}
          isInputBarShow={this.state.isInputBarShow}
          // containerStyle={{ height: 300, width: 300 }}
          // backgroundStyle={{ justifyContent: 'center' }}
          onLongPressItem={() => {}}
        />
        <View style={{ flex: 1 }} pointerEvents={'none'} />
        <InputBar
          ref={this.inputBarRef}
          onInputBarWillHide={() => {
            this.setState({ isInputBarShow: false });
          }}
          onInputBarWillShow={() => {
            this.setState({ isInputBarShow: true });
          }}
          onSend={(content) => {
            this.messageRef?.current?.addNewMessage(content);
          }}
          {...others}
        />
      </View>
    );
  }
}
