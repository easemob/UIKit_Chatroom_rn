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

const listHeight = 64;
const itemHeight = 40;
const itemSmallHeight = 20;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList<ItemT>);

type ItemT = {
  id: string;
  content: string;
  height: number;
  width: number;
  isNew: boolean;
};

export const AnimatedFlatListItem = ({ item }: { item: ItemT }) => {
  console.log('test:AnimatedFlatListItem:');
  const opacity = React.useRef(new Animated.Value(1)).current;
  const newTranslateY = React.useRef(new Animated.Value(0)).current;
  const oldTranslateY = React.useRef(new Animated.Value(0)).current;
  const oldHeight = React.useRef(new Animated.Value(itemHeight)).current;
  // const oldScaleX = React.useRef(new Animated.Value(1)).current; // !!! The text is deformed.
  if (item.isNew === true) {
    newTranslateY.setValue(40);
    Animated.timing(newTranslateY, {
      toValue: 0,
      useNativeDriver: false,
      duration: 1000,
    }).start();
  } else {
    oldTranslateY.setValue(20);
    // oldHeight.setValue(itemHeight);
    Animated.parallel([
      Animated.timing(oldTranslateY, {
        toValue: 0,
        useNativeDriver: false,
        duration: 1000,
      }),
      Animated.timing(oldHeight, {
        toValue: itemSmallHeight,
        useNativeDriver: false,
        easing: Easing.linear,
        duration: 1000,
      }),
    ]).start();
  }
  return (
    <Animated.View
      style={{
        flex: 0,
        height: item.isNew === true ? item.height : oldHeight,
        width: item.width,
        margin: 1,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'flex-start',
        opacity: opacity,
        transform: [
          { translateY: item.isNew === true ? newTranslateY : oldTranslateY },
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
      pre.item.isNew === next.item.isNew &&
      pre.item.width === next.item.width
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
      isNew: true,
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
              isNew: true,
            });
          } else if (data.length === 1) {
            const first = data[0]!;
            // first.height = itemSmallHeight;
            // first.width = first.width * 0.5;
            first.isNew = false;
            data.push({
              id: count.toString(),
              content: count.toString() + ' item',
              height: itemHeight,
              width: winWidth,
              isNew: true,
            });
          } else if (data.length === 2) {
            // data.shift();
            const first = data[1]!;
            // first.height = itemSmallHeight;
            // first.width = first.width * 0.5;
            first.isNew = false;
            data.push({
              id: count.toString(),
              content: count.toString() + ' item',
              height: itemHeight,
              width: winWidth,
              isNew: true,
            });
          } else if (data.length === 3) {
            data.shift();
            const first = data[1]!;
            // first.height = itemSmallHeight;
            // first.width = first.width * 0.5;
            first.isNew = false;
            data.push({
              id: count.toString(),
              content: count.toString() + ' item',
              height: itemHeight,
              width: winWidth,
              isNew: true,
            });
          } else if (data.length === 4) {
            data.shift();
            const first = data[2]!;
            // first.height = itemSmallHeight;
            // first.width = first.width * 0.5;
            first.isNew = false;
            data.push({
              id: count.toString(),
              content: count.toString() + ' item',
              height: itemHeight,
              width: winWidth,
              isNew: true,
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
          }, 1000);
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
          onLayout={() => {
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
              listener: (e) => {
                console.log('test:onScroll:', e.nativeEvent);
              },
            }
          )}
        />
      </View>
    </View>
  );
}

export default function test_gift_prototype() {
  return <TestGiftShowView />;
}
