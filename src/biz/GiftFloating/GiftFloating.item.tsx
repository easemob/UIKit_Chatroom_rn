import * as React from 'react';
import { Animated, Text } from 'react-native';

import { GiftFloatingItem, useAnimation } from './GiftFloating.item.hooks';

export type GiftFloatingItemFCProps = {
  item: GiftFloatingItem;
};

export function GiftFloatingItemFC(props: GiftFloatingItemFCProps) {
  const { item } = props;
  console.log('test:GiftFloatingItemFC:', item);
  const iHeight = React.useRef(new Animated.Value(item.height)).current;
  const iWidth = React.useRef(new Animated.Value(item.width)).current;
  const ix = React.useRef(new Animated.Value(0)).current;

  useAnimation({ item, iHeight, iWidth, ix });

  return (
    <Animated.View
      style={{
        flex: 0,
        height: iHeight,
        width: iWidth,
        backgroundColor: 'yellow',
        justifyContent: 'center',
        alignItems: 'flex-start',
        transform: [
          {
            translateY: ix,
          },
        ],
      }}
    >
      <Text id={item.id}>{item.id}</Text>
    </Animated.View>
  );
}
