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

import { useI18nContext } from '../../i18n';
import { BorderButton, CmnButton } from '../../ui/Button';
import { gBottomSheetHeaderHeight } from '../const';
import { gTabHeaderHeight } from './ReportList.const';
import { useReportListApi, useScrollGesture } from './ReportList.hooks';
import { ReportListItemMemo, ReportListItemProps } from './ReportList.item';
import type { ReportItemModel } from './types';

/**
 * Properties of the `ReportList` component.
 */
export type ReportListProps = {
  /**
   * Callback function when the gesture is used.
   * When used together with `Modal` or `SimuModal`, the pull-down gesture conflicts with the scrolling gift list gesture and cannot be resolved using bubbling events. Resolved by manually controlling usage rights.
   */
  requestUseScrollGesture?: (finished: boolean) => void;
  /**
   * Callback function when cancel button is clicked.
   */
  onCancel: () => void;
  /**
   * Callback function when report button is clicked.
   */
  onReport: (result?: ReportItemModel) => void;
  /**
   * data source. {@link ReportItemModel}
   */
  data: ReportItemModel[];
  /**
   * The height of the component.
   */
  height?: number;
};

/**
 * Component for reporting messages.
 *
 * This component is mainly used for reporting illegal messages.
 *
 * @param props {@link ReportListProps}
 * @returns React.JSX.Element
 *
 */
export function ReportList(props: ReportListProps) {
  const {
    requestUseScrollGesture,
    onCancel,
    data: propData,
    onReport,
    height: propsHeight,
  } = props;
  const { data, onUpdate } = useReportListApi(propData);
  const { isScrollingRef, handles } = useScrollGesture(requestUseScrollGesture);
  const ref = React.useRef<FlatList<ReportListItemProps>>({} as any);
  const { height: winHeight } = useWindowDimensions();
  const { bottom } = useSafeAreaInsets();
  const { tr } = useI18nContext();
  let height =
    propsHeight ??
    (winHeight * 3) / 5 -
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
                onUpdate(item);
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
          text={tr('Cancel')}
          style={{ width: '42%', height: 40 }}
          onPress={onCancel}
        />
        <CmnButton
          sizesType={'large'}
          radiusType={'large'}
          contentType={'only-text'}
          text={tr('Report')}
          style={{ width: '42%', height: 40 }}
          onPress={() => {
            onReport?.(
              data.map((v) => v.data).filter((v) => v.checked === true)[0]
            );
          }}
        />
      </View>
    </View>
  );
}
