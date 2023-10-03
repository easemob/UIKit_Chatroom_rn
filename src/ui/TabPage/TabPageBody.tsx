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
};
export function TabPageBody(props: TabPageBodyProps) {
  const {
    style,
    children,
    propsRef,
    height: initHeight,
    width: initWidth,
    containerStyle,
    ...others
  } = props;
  const ref = React.useRef<ScrollView>({} as any);
  const { width: winWidth, height } = useWindowDimensions();
  const w = initWidth ?? winWidth;
  const [pageY, setPageY] = React.useState(0);
  let viewRef = React.useRef<View | undefined>();
  if (propsRef.current) {
    propsRef.current.scrollTo = (index: number) => {
      ref.current.scrollTo({ x: index * w });
    };
  }
  return (
    <View
      style={[
        { height: initHeight ? initHeight : height - pageY },
        containerStyle,
      ]}
      ref={(ref) => {
        if (ref) {
          viewRef.current = ref;
        }
      }}
      onLayout={() => {
        if (viewRef.current) {
          viewRef.current.measureInWindow((_, __, ___, ____) => {});
          viewRef.current.measure((_, __, ___, ____, _____, pageY) => {
            if (initHeight === undefined) {
              setPageY(pageY);
            }
          });
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
