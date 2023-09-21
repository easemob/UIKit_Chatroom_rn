// ref: https://github.com/GetStream/stream-chat-react-native/blob/23ac2215fc790e309d75b7b503a05d52973fcb24/package/src/components/KeyboardCompatibleView/KeyboardCompatibleViewFC.tsx
// ref: https://github.com/enzomanuelmangano/animate-with-reanimated/blob/main/15-animated-flatlist/components/ListItem.tsx
// ref: https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/the-10-min/src/Wallet/WalletCard.tsx
// ref: https://www.youtube.com/results?search_query=flatlist+animation+react+native+add+item

import * as React from 'react';
import {
  Animated,
  Easing,
  FlatList,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

const listHeight = 60;
const itemHeight = 38;
const itemSmallHeight = 18;

const animateDuration = 250;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<ItemT>);

type ItemT = {
  id: string;
  content: string;
  height: number;
  width: number;
  isNewAdded: boolean;
  idState: '1' | '2' | '3'; // 新生代、中生代、老生代
};

export const AnimatedFlatListItem = ({ item }: { item: ItemT }) => {
  console.log('test:AnimatedFlatListItem:');
  const opacity = React.useRef(new Animated.Value(1)).current;
  const iHeight = React.useRef(new Animated.Value(item.height)).current;
  const ix = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (item.idState === '1') {
      ix.setValue(40);
      Animated.timing(ix, {
        toValue: 0,
        useNativeDriver: false,
        duration: animateDuration,
        easing: Easing.linear,
      }).start();
    } else if (item.idState === '2') {
      ix.setValue(20);
      Animated.sequence([
        Animated.timing(ix, {
          toValue: 0,
          useNativeDriver: false,
          duration: animateDuration / 2,
          delay: animateDuration * 0.4,
          easing: Easing.linear,
        }),
        Animated.timing(iHeight, {
          toValue: itemSmallHeight,
          useNativeDriver: false,
          duration: animateDuration / 2,
          easing: Easing.linear,
        }),
      ]).start();
    } else if (item.idState === '3') {
      ix.setValue(20);
      Animated.timing(ix, {
        toValue: 0,
        useNativeDriver: false,
        duration: animateDuration / 2,
        delay: animateDuration * 0.4,
        easing: Easing.linear,
      }).start();
    }
    return () => {
      console.log('test:AnimatedFlatListItem:end:');
      iHeight.stopAnimation();
      ix.stopAnimation();
    };
  }, [iHeight, item.idState, ix]);

  if (item.idState === '1') {
  } else if (item.idState === '2') {
  } else if (item.idState === '3') {
  }

  return (
    <Animated.View
      style={{
        flex: 0,
        height: iHeight,
        width: item.width,
        margin: 1,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'flex-start',
        opacity: opacity,
        transform: [
          {
            translateY: ix,
          },
        ],
      }}
      onTouchEnd={() => {
        console.log('test:onTouchEnd:', item.id);
      }}
    >
      <Text id={item.id}>{item.content}</Text>
    </Animated.View>
  );
};

export const AnimatedFlatListItemMemo = React.memo(
  AnimatedFlatListItem,
  (pre, next) => {
    return (
      pre.item.id === next.item.id &&
      pre.item.content === next.item.content &&
      pre.item.height === next.item.height &&
      pre.item.isNewAdded === next.item.isNewAdded &&
      pre.item.width === next.item.width &&
      pre.item.idState === next.item.idState
    );
  }
);

let count = 0;

export const initList = () => {
  const ret = [] as ItemT[];
  for (let index = 0; index < 0; index++) {
    ret.push({
      id: count.toString(),
      content: count.toString() + ' init',
      height: 1,
      width: 1,
      idState: '1',
      isNewAdded: false,
    });
    ++count;
  }
  return ret;
};

export function TestGiftShowView() {
  console.log('test:zuoyu:TestListView:');

  // const dataRef = React.useRef<ItemT[]>([]);
  const [data, setData] = React.useState<ItemT[]>([]);
  const ref = React.useRef<FlatList<ItemT>>({} as any);
  const { width: winWidth } = useWindowDimensions();
  const scrollY = React.useRef(new Animated.Value(0)).current;

  return (
    <View style={{ flex: 1, top: 100, backgroundColor: 'green' }}>
      <TouchableOpacity
        style={{ height: 30, margin: 30, backgroundColor: 'yellow' }}
        onPress={() => {
          if (data.length === 0) {
            data.push({
              id: count.toString(),
              content: count.toString() + ' item',
              height: itemHeight,
              width: winWidth,
              idState: '1',
              isNewAdded: true,
            });
          } else if (data.length === 1) {
            data[0]!.isNewAdded = false;
            data[0]!.idState = '2';
            data.push({
              id: count.toString(),
              content: count.toString() + ' item',
              height: itemHeight,
              width: winWidth,
              idState: '1',
              isNewAdded: true,
            });
          } else if (data.length === 2) {
            // data.shift();
            data[0]!.idState = '3';
            data[1]!.isNewAdded = false;
            data[1]!.idState = '2';
            data.push({
              id: count.toString(),
              content: count.toString() + ' item',
              height: itemHeight,
              width: winWidth,
              idState: '1',
              isNewAdded: true,
            });
          } else if (data.length === 3) {
            data.shift();
            data[0]!.idState = '3';
            data[1]!.idState = '2';
            data[1]!.isNewAdded = false;
            data.push({
              id: count.toString(),
              content: count.toString() + ' item',
              height: itemHeight,
              width: winWidth,
              idState: '1',
              isNewAdded: true,
            });
          }

          // data.push({
          //   id: count.toString(),
          //   content: count.toString() + ' item',
          //   height: itemHeight,
          //   width: winWidth,
          // });

          ++count;
          setData([...data]);
          setTimeout(() => {
            console.log('test:zuoyu:count:', data.length);
            ref.current.scrollToEnd({ animated: true });
            // ref.current.scrollToOffset({ animated: true, offset: -10000 });
          }, 500);
          // ref.current.scrollToEnd({ animated: false });
        }}
      >
        <Text>{'Add Item'}</Text>
      </TouchableOpacity>
      <View style={{ height: listHeight, backgroundColor: 'red' }}>
        <AnimatedFlatList
          ref={ref}
          data={data}
          // initialNumToRender={2}
          renderItem={(info: ListRenderItemInfo<ItemT>) => {
            return <AnimatedFlatListItem item={info.item} />;
          }}
          keyExtractor={(item: ItemT) => {
            return item.id;
          }}
          onLayout={(e) => {
            console.log('test:onLayout:', e.nativeEvent);
            // ref.current.scrollToEnd();
          }}
          onScrollToIndexFailed={(e) => {
            console.log('test:onScrollToIndexFailed', e);
          }}
          // onViewableItemsChanged={(e) => {
          //   console.log('test:onViewableItemsChanged', e);
          // }}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            {
              useNativeDriver: false,
              listener: () => {
                // console.log('test:onScroll:', e.nativeEvent);
              },
            }
          )}
          bounces={false}
        />
      </View>
    </View>
  );
}

export default function test_gift_prototype() {
  return <TestGiftShowView />;
}
