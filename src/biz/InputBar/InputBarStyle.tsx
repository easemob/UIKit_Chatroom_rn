import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ErrorCode, UIKitError } from '../../error';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import {
  gInputBarStyleHeight,
  gInputBarStyleItemHeight,
} from './InputBar.const';

export type InputBarStyleProps = {
  onClickInput: () => void;
  first?: React.ReactNode;
  after?: React.ReactNode[];
};

export function InputBarStyle(props: InputBarStyleProps) {
  const { onClickInput, first, after } = props;
  const { colors } = usePaletteContext();
  const { bottom } = useSafeAreaInsets();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.barrage[2],
      dark: colors.barrage[2],
    },
    tintColor: {
      light: colors.barrage[8],
      dark: colors.barrage[8],
    },
  });

  if (after && after?.length > 3) {
    throw new UIKitError({ code: ErrorCode.params, extra: 'after count > 3' });
  }

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: bottom,
        },
      ]}
    >
      {first ? <View style={styles.button}>{first}</View> : null}

      <View
        style={[
          styles.input,
          {
            backgroundColor: getColor('backgroundColor'),
          },
        ]}
        onTouchEnd={() => {
          onClickInput();
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 8,
          }}
        >
          <Icon
            name={'bubble_fill'}
            style={{
              width: 20,
              height: 20,
              tintColor: getColor('tintColor'),
            }}
          />
          <View style={{ width: 4 }} />
          <Text
            paletteType="body"
            textType="large"
            style={{
              color: getColor('tintColor'),
            }}
          >
            {'Input'}
          </Text>
        </View>
      </View>

      {after?.map((v, i) => {
        return (
          <View key={i} style={styles.button}>
            {v}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: gInputBarStyleHeight,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 12,
  },
  button: {
    height: gInputBarStyleItemHeight,
    width: gInputBarStyleItemHeight,
    marginHorizontal: 4,
  },
  input: {
    flex: 1,
    height: gInputBarStyleItemHeight,
    borderRadius: 38,
    marginHorizontal: 12,
  },
});
