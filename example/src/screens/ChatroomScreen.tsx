import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import {
  Chatroom,
  Icon,
  seqId,
  useColors,
  useCompare,
  useDispatchContext,
  useLifecycle,
  usePaletteContext,
} from 'react-native-chat-room';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BackgroundImageMemo } from '../BackgroundImage';
import { ChatroomTestMenu, ChatroomTestMenuRef } from '../ChatroomTestMenu';
import type { RootScreenParamsList } from '../routes';

type Props = NativeStackScreenProps<RootScreenParamsList>;
export function ChatroomScreen(props: Props) {
  const { navigation } = props;
  const {} = useSafeAreaInsets();
  const testRef = React.useRef<View>({} as any);
  const menuRef = React.useRef<ChatroomTestMenuRef>({} as any);
  const chatroomRef = React.useRef<Chatroom>({} as any);
  const count = React.useRef(0);
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    bg: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
    bg2: {
      light: colors.barrage[2],
      dark: colors.barrage[2],
    },
    tintColor: {
      light: colors.barrage[8],
      dark: colors.barrage[8],
    },
  });

  const [pageY, setPageY] = React.useState(0);
  const { addListener, removeListener } = useDispatchContext();
  useCompare(count);

  useLifecycle();

  // !!! ERROR  Warning: React has detected a change in the order of Hooks called by HeaderConfig. This will lead to bugs and errors if not fixed. For more information, read the Rules of Hooks: https://reactjs.org/link/rules-of-hooks
  React.useEffect(() => {
    navigation.setOptions({
      headerRight: HeaderRight,
      // headerShadowVisible: false,
      // headerBackTitleVisible: false,
    });
  }, [navigation]);

  React.useEffect(() => {
    const cb = () => {
      menuRef?.current?.startShow?.();
    };
    addListener(`_$${HeaderRight.name}`, cb);
    return () => {
      removeListener(`_$${HeaderRight.name}`, cb);
    };
  }, [addListener, removeListener]);

  const addGiftFloatingTask = () => {
    chatroomRef?.current?.getGiftFloatingRef()?.pushTask({
      model: {
        id: seqId('_gf').toString(),
        nickName: 'NickName',
        giftCount: 1,
        giftIcon: 'http://notext.png',
        content: 'send Agoraship',
      },
    });
  };
  const addMarqueeTask = () => {
    const content =
      'For several generations, stories from Africa have traditionally been passed down by word of mouth. ';
    const content2 = "I'm fine.";
    chatroomRef?.current?.getMarqueeRef()?.pushTask?.({
      model: {
        id: count.current.toString(),
        content: count.current % 2 === 0 ? content : content2,
      },
    });
    ++count.current;
  };

  return (
    <View
      ref={testRef}
      style={{ flex: 1 }}
      onLayout={() => {
        testRef.current?.measure(
          (
            x: number,
            y: number,
            width: number,
            height: number,
            pageX: number,
            pageY: number
          ) => {
            console.log('Sub:Sub:measure:', x, y, width, height, pageX, pageY);
            setPageY(pageY);
          }
        );
        testRef.current?.measureInWindow(
          (x: number, y: number, width: number, height: number) => {
            console.log('Sub:Sub:measureInWindow:', x, y, width, height);
          }
        );
      }}
    >
      {/* <BackgroundImageMemo /> */}
      <Chatroom
        ref={chatroomRef}
        // messageList={{
        //   props: {
        //     visible: true,
        //     containerStyle: {
        //       position: 'absolute',
        //       top: 100,
        //     },
        //   },
        // }}
        // gift={{
        //   props: {
        //     visible: true,
        //     containerStyle: {
        //       position: 'absolute',
        //       top: 100,
        //     },
        //   },
        // }}
        backgroundView={<BackgroundImageMemo />}
        // backgroundView={<View style={{ flex: 1, backgroundColor: 'blue' }} />}
        // marquee={{
        //   props: {
        //     visible: true,
        //     containerStyle: {
        //       position: 'absolute',
        //       top: 100,
        //     },
        //   },
        // }}
        input={{
          props: {
            keyboardVerticalOffset: Platform.OS === 'ios' ? pageY : 0,
            after: [
              <TouchableOpacity
                style={{
                  borderRadius: 38,
                  backgroundColor: getColor('bg2'),
                  width: 38,
                  height: 38,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon
                  name={'ellipsis_vertical'}
                  resolution={'3x'}
                  style={{
                    width: 30,
                    height: 30,
                    tintColor: getColor('tintColor'),
                  }}
                />
              </TouchableOpacity>,
              <TouchableOpacity
                style={{
                  borderRadius: 38,
                  backgroundColor: getColor('bg2'),
                  width: 38,
                  height: 38,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Icon
                  name={'gift_color'}
                  style={{ width: 30, height: 30, tintColor: undefined }}
                />
              </TouchableOpacity>,
            ],
          },
        }}
      >
        {/* <Pressable
          style={{
            position: 'absolute',
            width: 100,
            height: 100,
            backgroundColor: 'red',
            bottom: 100,
            // top: 100,
            left: 100,
          }}
          onPress={() => {
            // todo:
          }}
        /> */}
      </Chatroom>
      <ChatroomTestMenu
        ref={menuRef}
        onRequestModalClose={() => {
          menuRef?.current?.startHide?.();
        }}
        addGiftFloatingTask={addGiftFloatingTask}
        addMarqueeTask={addMarqueeTask}
      />
    </View>
  );
}

const HeaderRight = () => {
  const { emit } = useDispatchContext();
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          emit(`_$${HeaderRight.name}`, {});
        }}
      >
        <Icon name={'plus_in_circle'} style={{ width: 20, height: 20 }} />
      </TouchableOpacity>
    </View>
  );
};
