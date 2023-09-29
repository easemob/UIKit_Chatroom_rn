import type { ErrorInfo } from 'react';
import * as React from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { InputBar, InputBarProps, InputBarRef } from '../InputBar';
import { MessageList } from '../MessageList';

export type ChatroomProps = Omit<
  InputBarProps,
  'onInputBarWillShow' | 'onInputBarWillHide'
> & {};
export type ChatroomState = {
  isInputBarShow: boolean;
};

// type MyContext = number;
// const Ctx = React.createContext<MyContext>(0);

export class Chatroom extends React.Component<ChatroomProps, ChatroomState> {
  inputBarRef?: React.RefObject<InputBarRef>;
  // ref?: React.RefObject<TextInput>;
  constructor(props: ChatroomProps) {
    super(props);
    this.inputBarRef = React.createRef();
    // setTimeout(() => {
    //   this.ref?.current?.focus();
    // }, 3000);
    this.state = {
      isInputBarShow: false,
    };
  }

  componentDidMount?(): void {
    console.log('test:componentDidMount:');
  }
  componentWillUnmount?(): void {
    console.log('test:componentWillUnmount:');
  }
  componentDidCatch?(error: Error, errorInfo: ErrorInfo): void {
    console.log('test:componentDidCatch:', error, errorInfo);
  }

  render(): React.ReactNode {
    const { ...others } = this.props;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <MessageList
          onRequestCloseInputBar={() => {
            if (this.inputBarRef?.current?.close) {
              this.inputBarRef.current.close();
            }
          }}
          isInputBarShow={this.state.isInputBarShow}
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
          {...others}
        />
      </SafeAreaView>
    );
  }
}
