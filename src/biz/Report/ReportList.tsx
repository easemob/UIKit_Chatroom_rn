import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  PanResponder,
  Platform,
  StatusBar,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { BorderButton, CmnButton } from '../../ui/Button';
import type { SimulativeModalRef } from '../../ui/Modal';
import {
  gAspectRatio,
  gBottomSheetHeaderHeight,
  gTabHeaderHeight,
} from './ReportList.const';
import { useReportListApi } from './ReportList.hooks';
import { ReportListItemMemo, ReportListItemProps } from './ReportList.item';

export type ReportListRef = SimulativeModalRef & {};

export type ReportListProps = {
  requestUseScrollGesture?: (finished: boolean) => void;
  onCancel: () => void;
};

export function ReportList(props: ReportListProps) {
  const { requestUseScrollGesture, onCancel } = props;
  const { data, onUpdate, report } = useReportListApi();
  const isScrollingRef = React.useRef(false);
  const ref = React.useRef<FlatList<ReportListItemProps>>({} as any);
  const { width: winWidth } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  let height =
    winWidth / gAspectRatio -
    gBottomSheetHeaderHeight -
    gTabHeaderHeight -
    bottom -
    (StatusBar.currentHeight ?? 0);

  const r = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        if (isScrollingRef.current === false) {
          isScrollingRef.current = true;
          requestUseScrollGesture?.(false);
        }
        if (isScrollingRef.current === true) {
          return false;
        }
        return true;
      },
      onMoveShouldSetPanResponder: () => {
        if (isScrollingRef.current === false) {
          isScrollingRef.current = true;
          requestUseScrollGesture?.(false);
        }
        if (isScrollingRef.current === true) {
          return false;
        }
        return true;
      },
    })
  ).current;

  return (
    <View
      style={{
        height: height,
      }}
      {...r.panHandlers}
    >
      <FlatList
        ref={ref}
        data={data}
        renderItem={(info: ListRenderItemInfo<ReportListItemProps>) => {
          const { item } = info;
          return (
            <ReportListItemMemo
              id={item.id}
              checked={item.checked}
              onChecked={() => {
                onUpdate({ ...item, checked: !item.checked });
              }}
            />
          );
        }}
        keyExtractor={(item: ReportListItemProps) => {
          return item.id;
        }}
        onMomentumScrollEnd={() => {
          if (Platform.OS !== 'ios') {
            isScrollingRef.current = false;
            requestUseScrollGesture?.(true);
          }
        }}
        onResponderEnd={() => {
          if (Platform.OS === 'ios') {
            isScrollingRef.current = false;
            requestUseScrollGesture?.(true);
          }
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          paddingVertical: 8,
        }}
      >
        <BorderButton
          sizesType={'large'}
          radiusType={'large'}
          contentType={'only-text'}
          text={'Cancel'}
          style={{ width: '42%', height: 40 }}
          onPress={onCancel}
        />
        <CmnButton
          sizesType={'large'}
          radiusType={'large'}
          contentType={'only-text'}
          text={'Report'}
          style={{ width: '42%', height: 40 }}
          onPress={() => {
            report();
          }}
        />
      </View>
    </View>
  );
}
