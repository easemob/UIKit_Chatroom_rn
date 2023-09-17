import * as React from 'react';
import {
  Animated,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  calculateLeft,
  useTabPageHeaderAnimation,
} from './TabPageHeader.hooks';

export type TabPageHeaderRef = {
  toLeft: (count?: number) => void;
  toRight: (count?: number) => void;
};
export type TabPageHeaderProps = {
  propRef: React.RefObject<TabPageHeaderRef>;
  onClicked?: (index: number) => void;
  titles: string[];
  width?: number;
};
export function TabPageHeader(props: TabPageHeaderProps) {
  const { propRef, onClicked, titles, width: initWidth } = props;
  const { width } = useWindowDimensions();
  const indicatorWidth = 28;
  const w = initWidth ?? width;
  const { left, toNext } = useTabPageHeaderAnimation({
    unitWidth: w / 3,
    initLeft: calculateLeft({
      width: w,
      count: 3,
      index: 0,
      indicatorWidth: indicatorWidth,
    }),
  });

  if (propRef.current) {
    propRef.current.toLeft = (count?: number) => {
      toNext('l', count)();
    };
    propRef.current.toRight = (count?: number) => {
      toNext('r', count)();
    };
  }

  return (
    <View
      style={{
        height: 50,
        backgroundColor: 'green',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {titles.map((v, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={{ height: 40, width: 40, backgroundColor: 'yellow' }}
              onPress={() => {
                onClicked?.(i);
              }}
            >
              <Text>{v}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Animated.View
        style={{
          position: 'absolute',
          width: indicatorWidth,
          height: 4,
          borderRadius: 2,
          backgroundColor: 'blue',
          bottom: 0,
          left: left,
        }}
      />
    </View>
  );
}
