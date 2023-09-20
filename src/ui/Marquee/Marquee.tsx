import * as React from 'react';
import type { ImageStyle, TextStyle } from 'react-native';
import type { ViewStyle } from 'react-native';
import type { StyleProp } from 'react-native';
import { Animated, useWindowDimensions } from 'react-native';
import { View } from 'react-native';
import type { IconNameType } from 'src/assets';

import { usePaletteContext, useThemeContext } from '../../theme';
import { Queue } from '../../utils';
import { Icon } from '../Image';
import { PresetCalcTextWidth, Text } from '../Text';
import { createCompose } from './Marquee.hooks';
import type { Task } from './types';

export type MarqueeRef = {
  pushTask: (task: Task) => void;
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
  const { style } = useThemeContext();

  const [contentWidth, setContentWidth] = React.useState(1);
  const { width: winWidth } = useWindowDimensions();
  const width = marqueeWidth ?? winWidth;
  const [content, setContent] = React.useState('Asdf');
  const contentState = React.useRef(0);

  const x = React.useRef(new Animated.Value(0)).current;
  const tasks: Queue<Task> = React.useRef(new Queue<Task>()).current;
  const preTask = React.useRef<Task | undefined>(undefined);
  const curTask = React.useRef<Task | undefined>(undefined);

  const contentColor = () => {
    console.log('test:color:', colors.barrage[100], style);
    return style === 'light' ? colors.barrage[100] : colors.barrage[100];
  };

  if (propsRef.current) {
    propsRef.current.pushTask = async (task: Task) => {
      tasks.enqueue(task);
      execTask();
    };
  }

  const execTask = () => {
    console.log('test:execTask:start:');
    if (curTask.current === undefined) {
      const task = tasks.dequeue();
      if (task) {
        console.log('test:execTask:ing:');
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
          console.log('test:zuoyu:onWidth:', width);
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
          console.log('test:zuoyu:onLayout:');
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
              console.log('test:execTask:finish:');
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
          style={[{ color: contentColor() }, contentStyle]}
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
