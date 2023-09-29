import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';

import { ErrorCode, UIKitError } from '../../error';
import {
  TabPageBody,
  TabPageBodyProps,
  type TabPageBodyRef,
} from './TabPageBody';
import {
  TabPageHeader,
  type TabPageHeaderProps,
  type TabPageHeaderRef,
} from './TabPageHeader';

export type TabPageProps = {
  header: {
    Header?: typeof TabPageHeader;
    HeaderProps: Omit<TabPageHeaderProps, 'propRef' | 'onClicked' | 'width'>;
  };
  body: {
    Body?: typeof TabPageBody;
    BodyProps: Omit<TabPageBodyProps, 'propsRef' | 'height' | 'width'>;
  };
  height?: number;
  width?: number;
  headerPosition?: 'up' | 'down';
};

const _TabPage = (props: TabPageProps) => {
  const {
    header,
    body,
    height,
    width: initWidth,
    headerPosition = 'up',
  } = props;
  const { Header, HeaderProps } = header;
  const { titles: headerTitles } = HeaderProps;
  const { Body, BodyProps } = body;
  const {
    children: bodyChildren,
    onMomentumScrollEnd,
    ...BodyOtherProps
  } = BodyProps;
  const { width: winWidth } = useWindowDimensions();
  const headerRef = React.useRef<TabPageHeaderRef>({} as any);
  const bodyRef = React.useRef<TabPageBodyRef>({} as any);
  const preIndex = React.useRef(0);
  const count = headerTitles.length;
  const _TabPageHeader = Header ?? TabPageHeader;
  const _TabPageBody = Body ?? TabPageBody;
  const width = initWidth ?? winWidth;

  if (
    headerTitles.length <= 0 ||
    headerTitles.length !== bodyChildren?.length
  ) {
    throw new UIKitError({ code: ErrorCode.params });
  }

  const calculateIndex = (params: {
    width: number;
    contentOffsetX: number;
  }) => {
    const { width, contentOffsetX } = params;
    return Math.floor(contentOffsetX / width);
  };

  return (
    <View style={{ width: width }}>
      {headerPosition === 'up' ? (
        <_TabPageHeader
          propRef={headerRef}
          onClicked={(index: number) => {
            bodyRef.current?.scrollTo(index);
          }}
          width={width}
          {...HeaderProps}
        />
      ) : null}

      <_TabPageBody
        propsRef={bodyRef}
        onMomentumScrollEnd={(e) => {
          onMomentumScrollEnd?.(e);
          const index = calculateIndex({
            width: width,
            contentOffsetX: e.nativeEvent.contentOffset.x,
          });
          const current = index;
          const pre = preIndex.current;
          const c = Math.abs(current - pre);
          preIndex.current = current;
          if (current > pre) {
            if (current < count) {
              headerRef.current?.toRight(c);
            }
          } else if (current < pre) {
            if (current >= 0) {
              headerRef.current?.toLeft(c);
            }
          }
        }}
        height={height}
        width={width}
        children={bodyChildren}
        {...BodyOtherProps}
      />

      {headerPosition !== 'up' ? (
        <_TabPageHeader
          propRef={headerRef}
          onClicked={(index: number) => {
            bodyRef.current?.scrollTo(index);
          }}
          width={width}
          {...HeaderProps}
        />
      ) : null}
    </View>
  );
};

_TabPage.DefaultHeader = TabPageHeader;
_TabPage.DefaultBody = TabPageBody;

export const TabPage = _TabPage;
