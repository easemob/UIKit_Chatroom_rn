import type { ErrorInfo } from 'react';
import * as React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InputBar, InputBarProps, InputBarRef } from '../InputBar';
import { MessageList, MessageListRef } from '../MessageList';

export type ChatroomProps = Omit<
  InputBarProps,
  'onInputBarWillShow' | 'onInputBarWillHide' | 'onSend'
> & {};
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
  componentDidCatch?(error: Error, errorInfo: ErrorInfo): void {
    console.log('test:componentDidCatch:', error, errorInfo);
  }

  render(): React.ReactNode {
    const { ...others } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
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
      </SafeAreaView>
    );
  }
}
