import * as React from 'react';
import { View } from 'react-native';

import { useColors } from '../../hook';
import { useI18nContext } from '../../i18n';
import { usePaletteContext } from '../../theme';
import { BottomSheetMenu, BottomSheetMenuRef } from './BottomSheetMenu';
import { BottomSheetMenuItem } from './BottomSheetMenu.item';

type InitItemsType = {
  name: string;
  isHigh: boolean;
  onClicked?: (name: string) => void;
};
export type BottomSheetNameMenuRef = Omit<
  BottomSheetMenuRef,
  'startShowWithInit'
> & {
  startShowWithInit: (initItems: InitItemsType[]) => void;
};
export type BottomSheetNameMenuProps = {
  onRequestModalClose: () => void;
  title?: string;
  /**
   * The maximum number should not exceed 6.
   */
  initItems: InitItemsType[];
};

export const BottomSheetNameMenu = React.forwardRef<
  BottomSheetNameMenuRef,
  BottomSheetNameMenuProps
>(function (
  props: BottomSheetNameMenuProps,
  ref?: React.ForwardedRef<BottomSheetNameMenuRef>
) {
  const { onRequestModalClose, title } = props;
  const { getItems } = useGetListItems();
  const menuRef = React.useRef<BottomSheetMenuRef>({} as any);
  React.useImperativeHandle(
    ref,
    () => {
      return {
        startShow: () => {
          menuRef?.current?.startShow?.();
        },
        startHide: (onFinished?: () => void) => {
          menuRef?.current?.startHide?.(onFinished);
        },
        startShowWithInit: (initItems: InitItemsType[]) => {
          const items = getItems({ initItems, onRequestModalClose });
          menuRef?.current?.startShowWithInit?.(items);
        },
      };
    },
    [getItems, onRequestModalClose]
  );
  return (
    <BottomSheetMenu
      ref={menuRef}
      onRequestModalClose={onRequestModalClose}
      initItems={getItems(props)}
      title={title}
    />
  );
});

function useGetListItems() {
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    divider: {
      light: colors.neutral[9],
      dark: colors.neutral[0],
    },
  });
  const { tr } = useI18nContext();
  const getItems = React.useCallback(
    (props: BottomSheetNameMenuProps) => {
      const { initItems, onRequestModalClose } = props;
      const d = initItems
        .map((v, i) => {
          if (v.isHigh !== true) {
            return (
              <BottomSheetMenuItem
                key={i}
                id={i.toString()}
                initState={'enabled'}
                text={tr(v.name)}
                onPress={() => {
                  v.onClicked?.(v.name);
                }}
              />
            );
          } else {
            return (
              <BottomSheetMenuItem
                key={i}
                id={i.toString()}
                initState={'warned'}
                text={tr(v.name)}
                onPress={() => {
                  v.onClicked?.(v.name);
                }}
              />
            );
          }
        })
        .filter((v) => v !== null) as React.JSX.Element[];

      const data = [
        ...d,
        <View
          key={99}
          style={{
            height: 8,
            width: '100%',
            backgroundColor: getColor('divider'),
          }}
        />,
        <BottomSheetMenuItem
          key={100}
          id={'100'}
          initState={'enabled'}
          text={tr('Cancel')}
          onPress={onRequestModalClose}
        />,
      ];
      return data;
    },
    [getColor, tr]
  );
  return {
    getItems,
  };
}
