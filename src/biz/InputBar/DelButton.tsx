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
    <View
      style={{
        //  WARN  (ADVICE) View #3647 of type RCTView has a shadow set but cannot calculate shadow efficiently. Consider setting a background color to fix this, or apply the shadow to a more specific component.
        // backgroundColor: getColor('backgroundColor'),
        ...shadow.style.small[0],
      }}
    >
      <View
        style={{
          //  WARN  (ADVICE) View #3645 of type RCTView has a shadow set but cannot calculate shadow efficiently. Consider setting a background color to fix this, or apply the shadow to a more specific component.
          // backgroundColor: getColor('backgroundColor'),
          ...shadow.style.small[1],
        }}
      >
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

export const DelButtonMemo = React.memo(DelButton);
