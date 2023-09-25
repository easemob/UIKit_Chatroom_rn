import type { ErrorInfo } from 'react';
import * as React from 'react';
import { View } from 'react-native';

export type ChatroomProps = {};
export type ChatroomState = {};

// type MyContext = number;
// const Ctx = React.createContext<MyContext>(0);

export class Chatroom extends React.Component<ChatroomProps, ChatroomState> {
  constructor(props: ChatroomProps) {
    super(props);
  }

  // static contextType = Ctx;
  // declare context: React.ContextType<typeof MyContext>;

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
    return <View />;
  }
}
