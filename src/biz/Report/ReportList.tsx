import * as React from 'react';
import {
  FlatList,
  ListRenderItemInfo,
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
import { useReportListApi, useScrollGesture } from './ReportList.hooks';
import { ReportListItemMemo, ReportListItemProps } from './ReportList.item';
import type { ReportItemModel } from './types';

export type ReportListRef = SimulativeModalRef & {};

export type ReportListProps = {
  requestUseScrollGesture?: (finished: boolean) => void;
  onCancel: () => void;
  onReport: (result: ReportItemModel[]) => void;
  data: ReportItemModel[];
};

export function ReportList(props: ReportListProps) {
  const { requestUseScrollGesture, onCancel, data: propData, onReport } = props;
  const { data, onUpdate } = useReportListApi(propData);
  const { isScrollingRef, handles } = useScrollGesture(requestUseScrollGesture);
  const ref = React.useRef<FlatList<ReportListItemProps>>({} as any);
  const { width: winWidth } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  let height =
    winWidth / gAspectRatio -
    gBottomSheetHeaderHeight -
    gTabHeaderHeight -
    bottom -
    (StatusBar.currentHeight ?? 0);

  return (
    <View
      style={{
        height: height,
      }}
      {...handles}
    >
      <FlatList
        ref={ref}
        data={data}
        renderItem={(info: ListRenderItemInfo<ReportListItemProps>) => {
          const { item } = info;
          return (
            <ReportListItemMemo
              data={item.data}
              onChecked={() => {
                onUpdate({
                  ...item,
                  data: { ...item.data, checked: !item.data.checked },
                });
              }}
            />
          );
        }}
        keyExtractor={(item: ReportListItemProps) => {
          return item.data.id;
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
            onReport?.(data.map((v) => v.data));
          }}
        />
      </View>
    </View>
  );
}
