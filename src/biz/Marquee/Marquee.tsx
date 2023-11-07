import * as React from 'react';
import {
  Animated,
  ColorValue,
  StyleProp,
  // Text as RNText,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import { useConfigContext } from '../../config';
import { useCheckType, useColors, useGetStyleSize } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { PresetCalcTextWidth, Text } from '../../ui/Text';
import { Queue } from '../../utils';
import { gMarqueeHeight } from './Marquee.const';
import { createCompose } from './Marquee.hooks';
import type { MarqueeTask } from './types';

/**
 * Referencing value of the `Marquee` component.
 */
export type MarqueeRef = {
  /**
   * Push a task to the queue.
   */
  pushTask: (task: MarqueeTask) => void;
};

/**
 * Properties of the `Marquee` component.
 */
export type MarqueeProps = {
  /**
   * Whether to display the component.
   *
   * Changing the display or hiding in this way usually does not trigger the loading and unloading of components.
   */
  visible?: boolean;
  /**
   * The speed of the animation.
   * default: 8.0.
   * Range [0, 100]
   */
  playSpeed?: number;
  /**
   * The style of the container.
   */
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * The style of the text.
   */
  textStyle?: StyleProp<TextStyle>;
  /**
   * The icon component.
   */
  icon?: React.ReactElement;
  /**
   * Callback function when the animation is finished.
   */
  onFinished?: () => void;
};

/**
 * The Marquee component provides a floating text animation.
 *
 * Messages can be displayed in sequence through a queue.
 *
 * @param props {@link MarqueeProps}
 * @param ref {@link MarqueeRef}
 * @returns JSX.Element
 *
 * @test {@link https://github.com/AsteriskZuo/react-native-chat-room/blob/a9379f61a7b19be6b87b277f5669a6e7bcf3d45c/example/src/__dev__/test_marquee.tsx}
 *
 * @example
 *
 * ```tsx
 * const ref = React.useRef<MarqueeRef>({} as any);
 * // ...
 * <Marquee ref={ref} />
 * // ...
 * ref.current?.pushTask?.({
 *   model: {
 *     id: count.toString(),
 *     content: count.toString() + content,
 *   },
 * });
 * ```
 */
export const Marquee = React.forwardRef<MarqueeRef, MarqueeProps>(function (
  props: MarqueeProps,
  ref?: React.ForwardedRef<MarqueeRef>
) {
  const {
    visible = true,
    playSpeed,
    containerStyle,
    textStyle,
    onFinished,
  } = props;
  const { getViewStyleSize } = useGetStyleSize();
  const { colors, lineGradient } = usePaletteContext();
  const { getColor, getColors } = useColors({
    color: {
      light: colors.barrage[100],
      dark: colors.barrage[100],
    },
    backgroundColor: {
      light: colors.error[7],
      dark: colors.error[7],
    },
    backgroundColor3: {
      light: ['hsla(350, 100%, 70%, 0)', colors.error[7]],
      dark: ['hsla(350, 100%, 70%, 0)', colors.error[7]],
    },
    tintColor: {
      light: colors.neutral[98],
      dark: colors.neutral[98],
    },
  });
  const { start, end } = lineGradient.leftToRight;

  const containerSize = getViewStyleSize(containerStyle);
  const { enableCheckType } = useConfigContext();
  const { checkType } = useCheckType({ enabled: enableCheckType });
  if (containerSize?.height) {
    checkType(containerSize.height, 'number');
  }
  if (containerSize?.width) {
    checkType(containerSize.width, 'number');
  }

  const { width: winWidth } = useWindowDimensions();
  const containerWidth = (containerSize?.width ?? winWidth) as number;
  const containerHeight = (containerSize?.height ?? gMarqueeHeight) as number;

  const [contentWidth, setContentWidth] = React.useState(0);
  const [content, setContent] = React.useState('1234567890');
  const [isShow, setIsShow] = React.useState(false);
  const isSameContent = React.useRef(false);

  const x = React.useRef(new Animated.Value(0)).current;
  const tasks: Queue<MarqueeTask> = React.useRef(
    new Queue<MarqueeTask>()
  ).current;
  const preTask = React.useRef<MarqueeTask | undefined>(undefined);
  const curTask = React.useRef<MarqueeTask | undefined>(undefined);

  const execTask = () => {
    if (curTask.current === undefined) {
      const task = tasks.dequeue();
      if (task) {
        curTask.current = task;
        setIsShow(true);
        if (task.model.content === content) {
          isSameContent.current = true;
          execAnimating(contentWidth);
        } else {
          isSameContent.current = false;
          setContent(task.model.content);
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
      endX: containerWidth - w,
      contentWidth: w,
      width: containerWidth,
      speed: playSpeed,
    }).compose(() => {
      preTask.current = curTask.current;
      curTask.current = undefined;
      execTask();
    });
  };

  const pushTask = (task: MarqueeTask) => {
    tasks.enqueue(task);
    execTask();
  };

  React.useImperativeHandle(
    ref,
    () => {
      return {
        pushTask: (task: MarqueeTask) => {
          pushTask(task);
        },
      };
    },
    // !!!
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <View
      style={[
        {
          width: containerWidth,
          height: containerHeight,
          justifyContent: 'center',
          alignItems: 'flex-start',
          overflow: 'scroll',
          // paddingLeft: containerHeight,
          borderRadius: 10,
          paddingHorizontal: 10,
          display: visible === true && isShow === true ? 'flex' : 'none',
          backgroundColor: getColor('backgroundColor'),
          // backgroundColor: '#ffd700',
        },
        containerStyle,
      ]}
    >
      <PresetCalcTextWidth
        content={content}
        textProps={{
          textType: 'small',
          paletteType: 'body',
          style: textStyle,
        }}
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
            // height: containerHeight,
            width: contentWidth,
            // justifyContent: 'center',
            // borderTopRightRadius: 10,
            // borderBottomRightRadius: 10,
            // paddingHorizontal: 4,
            marginLeft: containerHeight,
            backgroundColor: getColor('backgroundColor'),
            transform: [{ translateX: x }],
          },
        ]}
      >
        <Text
          textType={'small'}
          paletteType={'body'}
          numberOfLines={1}
          style={[{ color: getColor('color') }, textStyle]}
        >
          {content}
        </Text>
      </Animated.View>
      <MarqueeIcon
        getColor={getColor}
        containerHeight={containerHeight}
        {...props}
      />
      <LinearGradient
        colors={getColors('backgroundColor3') as (string | number)[]}
        start={end}
        end={start}
        style={{
          position: 'absolute',
          // backgroundColor: getColor('backgroundColor'),
          height: containerHeight,
          width: containerHeight / 2,
          left: containerHeight,
        }}
      />
      <LinearGradient
        colors={getColors('backgroundColor3') as (string | number)[]}
        start={start}
        end={end}
        style={{
          position: 'absolute',
          // backgroundColor: getColor('backgroundColor'),
          height: containerHeight,
          width: containerHeight / 2,
          right: 0,
        }}
      />
    </View>
  );
});

const MarqueeIcon = ({
  containerHeight,
  icon,
  getColor,
}: MarqueeProps & {
  containerHeight: number;
  getColor: (key: string) => ColorValue | undefined;
}) => {
  return icon ? (
    <>{icon}</>
  ) : (
    <View
      style={{
        height: containerHeight,
        width: containerHeight,
        backgroundColor: getColor('backgroundColor'),
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Icon
        name={'spkeaker_n_vertical_bar'}
        style={[
          {
            marginLeft: 4,
            tintColor: getColor('tintColor'),
            height: 16,
            width: 16,
            backgroundColor: getColor('backgroundColor'),
          },
        ]}
      />
    </View>
  );
};

export type MarqueeComponent = typeof Marquee;
