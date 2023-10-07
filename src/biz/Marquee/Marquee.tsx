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
  speed?: number;
  containerStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<TextStyle>;
  contentContainerStyle?: StyleProp<TextStyle>;
  icon?: {
    iconName?: IconNameType;
    iconStyle?: StyleProp<ImageStyle>;
  };
  onFinished?: () => void;
};

export function Marquee(props: MarqueeProps) {
  const {
    width: marqueeWidth,
    height: marqueeHeight = 20,
    propsRef,
    speed,
    containerStyle,
    contentStyle,
    contentContainerStyle,
    icon,
    onFinished,
  } = props;

  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    color: {
      light: colors.barrage[100],
      dark: colors.barrage[100],
    },
    backgroundColor: {
      light: colors.error[7],
      dark: colors.error[7],
    },
    tintColor: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
  });

  const [contentWidth, setContentWidth] = React.useState(0);
  const { width: winWidth } = useWindowDimensions();
  const width = marqueeWidth ?? winWidth;
  const [content, setContent] = React.useState(' ');
  const [isShow, setIsShow] = React.useState(false);
  const isSameContent = React.useRef(false);

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
        setIsShow(true);
        if (task.content === content) {
          isSameContent.current = true;
          execAnimating(contentWidth);
        } else {
          isSameContent.current = false;
          setContent(task.content);
        }
      } else {
        setIsShow(false);
        onFinished?.();
      }
    }
  };

  const execAnimating = (w: number) => {
    createCompose({
      x: x,
      startX: 0,
      endX: width - w,
      contentWidth: w,
      width: width,
      speed: speed,
    }).compose(() => {
      preTask.current = curTask.current;
      curTask.current = undefined;
      execTask();
    });
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
          display: isShow ? 'flex' : 'none',
        },
        containerStyle,
      ]}
    >
      <PresetCalcTextWidth
        content={content}
        textProps={{ textType: 'small', paletteType: 'body' }}
        onWidth={(w: number) => {
          setContentWidth(w);
          if (curTask.current === undefined) {
            return;
          }
          if (isSameContent.current === true) {
            return;
          }
          execAnimating(w);
        }}
      />
      <Animated.View
        style={[
          {
            height: marqueeHeight,
            width: contentWidth,
            justifyContent: 'center',
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            paddingHorizontal: 4,
            backgroundColor: getColor('backgroundColor'),
            transform: [{ translateX: x }],
          },
          contentContainerStyle,
        ]}
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
          backgroundColor: getColor('backgroundColor'),
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
              tintColor: getColor('tintColor'),
              height: 16,
              width: 16,
              backgroundColor: getColor('backgroundColor'),
            },
            icon?.iconStyle,
          ]}
        />
      </View>
    </View>
  );
}
