import * as React from 'react';
import { AlertButton, View } from 'react-native';

import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { BorderButton, CmnButton } from '../Button';
import { Modal, ModalRef } from '../Modal';
import { Text } from '../Text';

export type AlertRef = {
  alert: () => void;
  close: () => void;
};
export type AlertProps = {
  title: string;
  message?: string;
  buttons?: Omit<AlertButton, 'isPreferred'>[];
};
export const Alert = React.forwardRef<AlertRef, AlertProps>(
  (props: AlertProps, ref?: React.ForwardedRef<AlertRef>) => {
    const { title, message, buttons } = props;
    const modalRef = React.useRef<ModalRef>({} as any);
    const { colors } = usePaletteContext();
    const { getColor } = useColors({
      bg: {
        light: colors.neutral[98],
        dark: colors.neutral[1],
      },
      text: {
        light: colors.neutral[1],
        dark: colors.neutral[98],
      },
    });
    const getButton = () => {
      if (buttons) {
        const count = buttons.length;
        const list = buttons.map((v, i) => {
          if (v.text === 'Cancel') {
            return (
              <BorderButton
                key={i}
                sizesType={'large'}
                radiusType={'large'}
                contentType={'only-text'}
                onPress={() => v.onPress?.(v.text)}
                text={v.text}
                style={{ height: 48 }}
              />
            );
          }
          return (
            <CmnButton
              key={i}
              sizesType={'large'}
              radiusType={'large'}
              contentType={'only-text'}
              onPress={() => v.onPress?.(v.text)}
              text={v.text}
              style={{ height: 48 }}
            />
          );
        });
        const ret = [] as React.JSX.Element[];
        for (let index = 0; index < list.length; index++) {
          const element = list[index];
          if (element) {
            ret.push(element);
            if (index < list.length - 1) {
              ret.push(<View key={count + index} style={{ width: 16 }} />);
            }
          }
        }
        return ret;
      }

      return [
        <CmnButton
          key={99}
          sizesType={'large'}
          radiusType={'large'}
          contentType={'only-text'}
          onPress={onRequestModalClose}
          text={'Confirm'}
          style={{ height: 48 }}
        />,
      ];
    };
    const onRequestModalClose = React.useCallback(() => {
      modalRef?.current?.startHide?.();
    }, []);
    React.useImperativeHandle(
      ref,
      () => {
        return {
          alert: () => {
            modalRef?.current?.startShow?.();
          },
          close: () => {
            modalRef?.current?.startHide?.();
          },
        };
      },
      []
    );
    return (
      <Modal
        propsRef={modalRef}
        modalAnimationType={'fade'}
        onRequestModalClose={onRequestModalClose}
        modalStyle={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <View
          style={{
            backgroundColor: getColor('bg'),
            paddingHorizontal: 16,
            paddingTop: 24,
            paddingBottom: 16,
            borderRadius: 16,
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text
              textType={'large'}
              paletteType={'title'}
              style={{
                color: getColor('text'),
              }}
            >
              {title}
            </Text>
          </View>
          <View style={{ height: 12 }} />
          <View style={{ alignItems: 'center' }}>
            <Text
              textType={'medium'}
              paletteType={'label'}
              style={{
                color: getColor('text'),
              }}
            >
              {message}
            </Text>
          </View>
          <View style={{ height: 24 }} />
          <View>
            <View
              style={{
                flexDirection: 'row',
                // justifyContent: 'space-evenly',
              }}
            >
              {getButton()}
            </View>
          </View>
        </View>
      </Modal>
    );
  }
);
