import * as React from 'react';

import {
  BottomSheetGift as BottomSheetModalGift,
  BottomSheetGiftProps as BottomSheetGiftModalProps,
  BottomSheetGiftRef as BottomSheetGiftModalRef,
} from './BottomSheetGift.modal';
import {
  BottomSheetGift as BottomSheetSimuGift,
  BottomSheetGiftProps as BottomSheetGiftSimuProps,
  BottomSheetGiftRef as BottomSheetGiftSimuRef,
} from './BottomSheetGift.simu';

export {
  BottomSheetGiftProps as BottomSheetGiftModalProps,
  BottomSheetGiftRef as BottomSheetGiftModalRef,
  BottomSheetGift as BottomSheetModalGift,
} from './BottomSheetGift.modal';
export {
  BottomSheetGiftProps as BottomSheetGiftSimuProps,
  BottomSheetGiftRef as BottomSheetGiftSimuRef,
  BottomSheetGift as BottomSheetSimuGift,
} from './BottomSheetGift.simu';

export const BottomSheetGift = React.forwardRef<
  BottomSheetGiftModalRef,
  BottomSheetGiftModalProps
>(function (
  props: BottomSheetGiftModalProps,
  ref?: React.ForwardedRef<BottomSheetGiftModalRef>
) {
  return <BottomSheetModalGift ref={ref} {...props} />;
});

export const BottomSheetGift2 = React.forwardRef<
  BottomSheetGiftSimuRef,
  BottomSheetGiftSimuProps
>(function (
  props: BottomSheetGiftSimuProps,
  ref?: React.ForwardedRef<BottomSheetGiftSimuRef>
) {
  return <BottomSheetSimuGift ref={ref} {...props} />;
});
