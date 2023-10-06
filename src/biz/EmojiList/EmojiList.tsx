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
import moji from 'twemoji';

import { FACE_ASSETS } from '../../assets';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Text } from '../../ui/Text';
import { gAspectRatio } from './EmojiList.const';

export type EmojiListProps = {
  onFace: (id: string) => void;
  style?: StyleProp<ViewStyle>;
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
  const { onFace, style } = props;
  const getUnitSize = () => {
    return winWidth / 7 - 1;
  };
  return (
    <View
      style={[
        {
          height: gAspectRatio * winWidth,
          backgroundColor: getColor('bg1'),
        },
        style,
      ]}
    >
      <ScrollView>
        <View style={styles.group}>
          <View style={styles.list}>
            {FACE_ASSETS.map((v, i) => {
              const r = moji.convert.fromCodePoint(v);
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

export const EmojiListMemo = React.memo(EmojiList);