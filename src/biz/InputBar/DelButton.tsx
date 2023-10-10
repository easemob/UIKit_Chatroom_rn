import * as React from 'react';
import { ColorValue, Platform, View } from 'react-native';

import { useThemeContext } from '../../theme';
import { IconButton } from '../../ui/Button';

export function DelButton(params: {
  getColor: (key: string) => ColorValue | undefined;
  emojiHeight: number;
  onClicked: () => void;
}) {
  const { getColor, emojiHeight, onClicked } = params;
  const { shadow } = useThemeContext();
  const b = (
    <View style={{ ...shadow.style.small[0] }}>
      <View style={{ ...shadow.style.small[1] }}>
        <View
          style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            backgroundColor: getColor('backgroundColor'),
            borderRadius: 40,
          }}
        >
          <IconButton
            iconName={'arrow_left_thick'}
            style={{
              width: 40,
              height: 40,
            }}
            onPress={onClicked}
          />
        </View>
      </View>
    </View>
  );
  if (Platform.OS === 'ios') {
    return b;
  } else {
    if (emojiHeight === 0) {
      return null;
    }
    return b;
  }
}
