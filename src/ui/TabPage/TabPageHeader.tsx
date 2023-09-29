import * as React from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import {
  Animated,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import { ErrorCode, UIKitError } from '../../error';
import {
  gIndicatorBorderRadius,
  gIndicatorHeight,
  gIndicatorWidth,
} from './TabPage.const';
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
  indicatorStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
  content?: {
    style?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
  };
};
export function TabPageHeader(props: TabPageHeaderProps) {
  const {
    propRef,
    onClicked,
    titles,
    width: initWidth,
    indicatorStyle,
    containerStyle,
    content,
  } = props;
  const { width: winWidth } = useWindowDimensions();
  const count = titles.length;
  const indicatorWidth = (indicatorStyle as any)?.width ?? 28;
  const width = initWidth ?? winWidth;
  const { left, toNext } = useTabPageHeaderAnimation({
    unitWidth: width / count,
    initLeft: calculateLeft({
      width: width,
      count: count,
      index: 0,
      indicatorWidth: indicatorWidth,
    }),
  });

  if (indicatorWidth * count >= width) {
    throw new UIKitError({ code: ErrorCode.params });
  }

  if (propRef.current) {
    propRef.current.toLeft = (count?: number) => {
      toNext('l', count)();
    };
    propRef.current.toRight = (count?: number) => {
      toNext('r', count)();
    };
  }

  return (
    <View style={{ flexDirection: 'column' }}>
      <View
        style={[
          {
            flexDirection: 'row',
            justifyContent: 'space-around',
            alignItems: 'center',
          },
          containerStyle,
        ]}
      >
        {titles.map((v, i) => {
          return (
            <TouchableOpacity
              key={i}
              style={[
                {
                  height: 40,
                  width: 80,
                  margin: 10,
                  backgroundColor: 'yellow',
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                content?.containerStyle,
              ]}
              onPress={() => {
                onClicked?.(i);
              }}
            >
              <Text style={[content?.style]}>{v}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: gIndicatorWidth,
            height: gIndicatorHeight,
            borderRadius: gIndicatorBorderRadius,
            backgroundColor: 'blue',
            bottom: 0,
            left: left,
          },
          indicatorStyle,
        ]}
      />
    </View>
  );
}
