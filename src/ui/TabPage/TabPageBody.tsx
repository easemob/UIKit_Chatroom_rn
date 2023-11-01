import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  ScrollView,
  ScrollViewProps,
  useWindowDimensions,
  View,
} from 'react-native';

export type TabPageBodyItemProps = ScrollViewProps;
export function TabPageBodyItem(props: TabPageBodyItemProps) {
  const { style, children, ...others } = props;
  return (
    <ScrollView style={[style]} {...others}>
      {children}
    </ScrollView>
  );
}

export type TabPageBodyRef = {
  scrollTo: (index: number) => void;
};
export type TabPageBodyProps = Omit<
  ScrollViewProps,
  | 'pagingEnabled'
  | 'showsHorizontalScrollIndicator'
  | 'bounces'
  | 'horizontal'
  | 'children'
> & {
  propsRef: React.RefObject<TabPageBodyRef>;
  children: React.ReactNode[];
  height?: number;
  width?: number;
  containerStyle?: StyleProp<ViewStyle>;
  initIndex?: number;
};
export function TabPageBody(props: TabPageBodyProps) {
  const {
    style,
    children,
    propsRef,
    height: initHeight,
    width: initWidth,
    containerStyle,
    initIndex = 0,
    onLayout: propsOnLayout,
    ...others
  } = props;
  const ref = React.useRef<ScrollView>({} as any);
  const { width: winWidth } = useWindowDimensions();
  const w = initWidth ?? winWidth;
  let viewRef = React.useRef<View | undefined>();
  if (propsRef.current) {
    propsRef.current.scrollTo = (index: number, animated?: boolean) => {
      ref.current?.scrollTo({ x: index * w, animated: animated });
    };
  }
  return (
    <View
      style={[
        {
          height: initHeight ? initHeight : undefined,
          flexGrow: 1,
        },
        containerStyle,
      ]}
      ref={(ref) => {
        if (ref) {
          viewRef.current = ref;
        }
      }}
    >
      <ScrollView
        ref={ref}
        style={[style]}
        horizontal={true}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onLayout={(e) => {
          if (propsOnLayout) {
            propsOnLayout(e);
          }
          if (initIndex > 0) {
            ref.current?.scrollTo({ x: initIndex * w, animated: false });
          }
        }}
        {...others}
      >
        {children.map((Body, i) => {
          return (
            <View key={i} style={{ width: w }}>
              {Body}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
