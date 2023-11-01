import * as React from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';

import { ErrorCode, UIKitError } from '../../error';
import { gHeaderHeight, gIndicatorHeight } from './TabPage.const';
import { useHeaderStartScrolling } from './TabPage.hooks';
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
  initIndex?: number;
  onCurrentIndex?: (currentIndex: number) => void;
};

const _TabPage = (props: TabPageProps) => {
  const {
    header,
    body,
    height,
    width: initWidth,
    headerPosition = 'up',
    initIndex = 0,
    onCurrentIndex,
  } = props;
  const { Header, HeaderProps } = header;
  const { titles: headerTitles } = HeaderProps;
  const { Body, BodyProps } = body;
  const {
    children: bodyChildren,
    onMomentumScrollEnd,
    scrollEventThrottle,
    ...BodyOtherProps
  } = BodyProps;
  const { width: winWidth } = useWindowDimensions();
  const headerRef = React.useRef<TabPageHeaderRef>({} as any);
  const bodyRef = React.useRef<TabPageBodyRef>({} as any);
  const count = headerTitles.length;
  const _TabPageHeader = Header ?? TabPageHeader;
  const _TabPageBody = Body ?? TabPageBody;
  const width = initWidth ?? winWidth;
  const { headerStartScrolling } = useHeaderStartScrolling(
    count,
    headerRef,
    initIndex
  );

  if (
    headerTitles.length <= 0 ||
    headerTitles.length !== bodyChildren?.length
  ) {
    throw new UIKitError({ code: ErrorCode.params });
  }

  const getHeader = () => {
    return (
      <_TabPageHeader
        propRef={headerRef}
        onClicked={(index: number) => {
          bodyRef.current?.scrollTo(index);
          if (Platform.OS === 'android') {
            headerStartScrolling(width, width * index);
          }
        }}
        width={width}
        initIndex={initIndex}
        {...HeaderProps}
      />
    );
  };

  return (
    <View
      style={{
        // flex: 1,
        flexGrow: 1,
        width: width,
      }}
    >
      {headerPosition === 'up' ? getHeader() : null}

      <_TabPageBody
        propsRef={bodyRef}
        onMomentumScrollEnd={(e) => {
          // !!! On the android platform, when using `scrollTo`, this callback is not triggered. shit.
          onMomentumScrollEnd?.(e);
          headerStartScrolling(width, e.nativeEvent.contentOffset.x);
        }}
        scrollEventThrottle={scrollEventThrottle ?? 16}
        height={
          height ? height - (gHeaderHeight + gIndicatorHeight) : undefined
        }
        width={width}
        children={bodyChildren}
        initIndex={initIndex}
        onCurrentIndex={onCurrentIndex}
        {...BodyOtherProps}
      />

      {headerPosition !== 'up' ? getHeader() : null}
    </View>
  );
};

_TabPage.DefaultHeader = TabPageHeader;
_TabPage.DefaultBody = TabPageBody;

export const TabPage = _TabPage;
