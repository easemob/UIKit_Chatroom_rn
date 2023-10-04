import * as React from 'react';
import {
  Animated,
  ImageStyle,
  StyleProp,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';

import type { IconNameType } from '../../assets';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { PresetCalcTextWidth, Text } from '../../ui/Text';
import { Queue } from '../../utils';
import { createCompose } from './Marquee.hooks';
import type { MarqueeTask } from './types';

export type MarqueeRef = {
  pushTask: (task: MarqueeTask) => void;
};

export type MarqueeProps = {
  propsRef: React.RefObject<MarqueeRef>;
  height?: number;
  width?: number;
  letterWidth?: number;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<TextStyle>;
  contentContainerStyle?: StyleProp<TextStyle>;
  icon?: {
    iconName?: IconNameType;
    iconStyle?: StyleProp<ImageStyle>;
  };
};

export function Marquee(props: MarqueeProps) {
  const {
    width: marqueeWidth,
    height: marqueeHeight = 20,
    propsRef,
    letterWidth,
    containerStyle,
    contentStyle,
    contentContainerStyle,
    icon,
  } = props;

  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    color: {
      light: colors.barrage[100],
      dark: colors.barrage[100],
    },
  });

  const [contentWidth, setContentWidth] = React.useState(1);
  const { width: winWidth } = useWindowDimensions();
  const width = marqueeWidth ?? winWidth;
  const [content, setContent] = React.useState('Asdf');
  const contentState = React.useRef(0);

  const x = React.useRef(new Animated.Value(0)).current;
  const tasks: Queue<MarqueeTask> = React.useRef(
    new Queue<MarqueeTask>()
  ).current;
  const preTask = React.useRef<MarqueeTask | undefined>(undefined);
  const curTask = React.useRef<MarqueeTask | undefined>(undefined);

  if (propsRef.current) {
    propsRef.current.pushTask = async (task: MarqueeTask) => {
      tasks.enqueue(task);
      execTask();
    };
  }

  const execTask = () => {
    if (curTask.current === undefined) {
      const task = tasks.dequeue();
      if (task) {
        curTask.current = task;
        if (task.content === content) {
          setContent(task.content + ' ');
        } else {
          setContent(task.content);
        }
      }
    }
  };

  return (
    <View
      style={[
        {
          width: width,
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'scroll',
          paddingLeft: marqueeHeight,
          borderRadius: 10,
          paddingHorizontal: 4,
        },
        containerStyle,
      ]}
    >
      <PresetCalcTextWidth
        content={content}
        textProps={{ textType: 'small', paletteType: 'body' }}
        onWidth={function (width: number): void {
          contentState.current = 1;
          setContentWidth(width);
        }}
      />
      <Animated.View
        style={[
          {
            height: marqueeHeight,
            width: contentWidth + 8,
            justifyContent: 'center',
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            paddingHorizontal: 4,
            backgroundColor: colors.error[7],
            transform: [{ translateX: x }],
          },
          contentContainerStyle,
        ]}
        onLayout={() => {
          if (contentState.current === 1) {
            contentState.current = 0;
            if (curTask.current === undefined) {
              return;
            }
            createCompose({
              x: x,
              startX: 0,
              endX: width - contentWidth,
              contentWidth: contentWidth,
              width: width,
              letterWidth: letterWidth,
            }).compose(() => {
              preTask.current = curTask.current;
              curTask.current = undefined;
              execTask();
            });
          }
        }}
      >
        <Text
          textType={'small'}
          paletteType={'body'}
          numberOfLines={1}
          style={[{ color: getColor('color') }, contentStyle]}
        >
          {content}
        </Text>
      </Animated.View>
      <View
        style={{
          height: marqueeHeight,
          width: marqueeHeight,
          backgroundColor: colors.error[7],
          position: 'absolute',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Icon
          name={icon?.iconName ?? 'spkeaker_n_vertical_bar'}
          style={[
            {
              marginLeft: 4,
              tintColor: colors.neutral[98],
              height: 16,
              width: 16,
              backgroundColor: colors.error[7],
            },
            icon?.iconStyle,
          ]}
        />
      </View>
    </View>
  );
}
