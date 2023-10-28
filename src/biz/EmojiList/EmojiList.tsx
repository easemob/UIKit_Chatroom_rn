import * as React from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import {
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import emoji from 'twemoji';

import { FACE_ASSETS } from '../../assets';
import { useConfigContext } from '../../config';
import {
  useCheckType,
  useColors,
  useCompare,
  useGetStyleSize,
} from '../../hook';
import { usePaletteContext } from '../../theme';
import { Text } from '../../ui/Text';
import { gAspectRatio, gCountPerRow } from './EmojiList.const';

export type EmojiListProps = {
  onFace: (id: string) => void;
  containerStyle?: StyleProp<ViewStyle>;
  countPerRow?: number;
};

export function EmojiList(props: EmojiListProps) {
  const { colors } = usePaletteContext();
  const { width: winWidth } = useWindowDimensions();
  const { getColor } = useColors({
    bg1: {
      light: colors.neutral[98],
      dark: colors.neutral[1],
    },
  });
  const { onFace, containerStyle, countPerRow = gCountPerRow } = props;
  const { getViewStyleSize } = useGetStyleSize();
  const { width: propsWidth } = getViewStyleSize(containerStyle);
  const { checkType } = useCheckType();
  if (propsWidth) {
    checkType(propsWidth, 'number');
  }
  const getUnitSize = () => {
    if (propsWidth) {
      return (propsWidth as number) / countPerRow - 1;
    }
    return winWidth / countPerRow - 1;
  };
  const { enableCompare } = useConfigContext();
  useCompare(getColor, { enabled: enableCompare });
  return (
    <View
      style={[
        {
          height: gAspectRatio * winWidth,
          backgroundColor: getColor('bg1'),
        },
        containerStyle,
      ]}
    >
      <ScrollView>
        <View style={styles.group}>
          <View style={styles.list}>
            {FACE_ASSETS.map((v, i) => {
              const r = emoji.convert.fromCodePoint(v.substring(2));
              return (
                <View
                  key={i}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: getUnitSize(),
                    height: getUnitSize(),
                    // alignSelf: 'baseline', // !!! crash
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      onFace?.(v);
                    }}
                  >
                    <Text style={{ fontSize: Platform.OS === 'ios' ? 32 : 26 }}>
                      {r}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const EmojiListCompare = (
  _prevProps: Readonly<EmojiListProps>,
  _nextProps: Readonly<EmojiListProps>
) => {
  return true;
};

const styles = StyleSheet.create({
  group: { alignItems: 'center', flex: 1 },
  title: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  list: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
  },
});

export const EmojiListMemo = React.memo(EmojiList, EmojiListCompare);
