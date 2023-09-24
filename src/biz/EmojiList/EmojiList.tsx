import * as React from 'react';
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
import { usePaletteContext, useThemeContext } from '../../theme';
import { Text } from '../../ui/Text';
import { gAspectRatio } from './EmojiList.const';

export type EmojiListProps = {
  onFace: (id: string) => void;
};

export function EmojiList(props: EmojiListProps) {
  console.log('test:EmojiList');
  const { colors } = usePaletteContext();
  const { style } = useThemeContext();
  const { width: winWidth } = useWindowDimensions();
  const [unitWidth, setUnitWidth] = React.useState(44);
  const unitHeight = unitWidth * 1;
  const { onFace } = props;
  return (
    <View
      style={{
        height: gAspectRatio * winWidth,
        backgroundColor:
          style === 'light' ? colors.neutral[98] : colors.neutral[1],
      }}
    >
      <ScrollView>
        <View
          style={styles.group}
          onLayout={(e) => {
            const s = e.nativeEvent.layout.width / 7;
            setUnitWidth(Math.floor(s));
          }}
        >
          <View style={styles.title}>
            <Text
              textType={'small'}
              paletteType={'title'}
              style={{
                color:
                  style === 'light' ? colors.neutral[5] : colors.neutral[6],
              }}
            >
              {'All Emojis'}
            </Text>
          </View>
          <View style={styles.list}>
            {FACE_ASSETS.map((v, i) => {
              const r = moji.convert.fromCodePoint(v);
              return (
                <TouchableOpacity
                  key={i}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: unitWidth,
                    height: unitHeight,
                    // alignSelf: 'baseline', // !!! crash
                  }}
                  onPress={() => {
                    onFace?.(v);
                  }}
                >
                  <Text style={{ fontSize: Platform.OS === 'ios' ? 32 : 26 }}>
                    {r}
                  </Text>
                </TouchableOpacity>
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
