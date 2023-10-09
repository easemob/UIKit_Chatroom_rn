import * as React from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';

import { ErrorCode, UIKitError } from '../../error';
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
    scrollEventThrottle,
    ...BodyOtherProps
  } = BodyProps;
  const { width: winWidth } = useWindowDimensions();
  const headerRef = React.useRef<TabPageHeaderRef>(null);
  const bodyRef = React.useRef<TabPageBodyRef>(null);
  const count = headerTitles.length;
  const _TabPageHeader = Header ?? TabPageHeader;
  const _TabPageBody = Body ?? TabPageBody;
  const width = initWidth ?? winWidth;
  const { headerStartScrolling } = useHeaderStartScrolling(count, headerRef);

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
        {...HeaderProps}
      />
    );
  };

  return (
    <View
      style={{
        flex: 1,
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
        height={height}
        width={width}
        children={bodyChildren}
        {...BodyOtherProps}
      />

      {headerPosition !== 'up' ? getHeader() : null}
    </View>
  );
};

_TabPage.DefaultHeader = TabPageHeader;
_TabPage.DefaultBody = TabPageBody;

export const TabPage = _TabPage;
