import * as React from 'react';
import { useWindowDimensions, View } from 'react-native';

import { ErrorCode, UIKitError } from '../../error';
import { TabPageBody, type TabPageBodyRef } from './TabPageBody';
import { TabPageHeader, type TabPageHeaderRef } from './TabPageHeader';

export type TabPageProps = {
  header: {
    Header?: typeof TabPageHeader;
    titles: string[];
  };
  body: {
    Body?: typeof TabPageBody;
    BodyPages: React.ReactNode[];
  };
  height?: number;
  width?: number;
};

const _TabPage = (props: TabPageProps) => {
  const { header, body, height, width: initWidth } = props;
  const { Header, titles } = header;
  const { Body, BodyPages } = body;
  const { width } = useWindowDimensions();
  const headerRef = React.useRef<TabPageHeaderRef>({} as any);
  const bodyRef = React.useRef<TabPageBodyRef>({} as any);
  const preIndex = React.useRef(0);
  const count = titles.length;
  const _TabPageHeader = Header ?? TabPageHeader;
  const _TabPageBody = Body ?? TabPageBody;
  const w = initWidth ?? width;

  if (titles.length <= 0 || titles.length !== BodyPages?.length) {
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
    <View style={{ width: w }}>
      <_TabPageHeader
        propRef={headerRef}
        onClicked={(index: number) => {
          bodyRef.current?.scrollTo(index);
        }}
        titles={titles}
        width={initWidth}
      />
      <_TabPageBody
        propsRef={bodyRef}
        onMomentumScrollEnd={(e) => {
          const index = calculateIndex({
            width: w,
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
        children={BodyPages}
        height={height}
        width={initWidth}
      />
    </View>
  );
};

_TabPage.DefaultHeader = TabPageHeader;
_TabPage.DefaultBody = TabPageBody;

export const TabPage = _TabPage;
