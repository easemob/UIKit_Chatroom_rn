import * as React from 'react';
import { Animated } from 'react-native';
import { View } from 'react-native';
import type { IconNameType } from 'src/assets';

import { useDispatchContext } from '../../dispatch';
import { ErrorCode, UIKitError } from '../../error';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { Text } from '../../ui/Text';
import { formatTs } from '../../utils';
import { Avatar } from '../Avatar';
import { MessageListGiftItem } from './MessageList.item.gift';
import { MessageListTextItem } from './MessageList.item.text';
import { MessageListVoiceItem } from './MessageList.item.voice';
import type { MessageListItemProps } from './types';

// const AnimatedText = Animated.createAnimatedComponent(Text);

export function MessageListItem(props: MessageListItemProps) {
  const { emitSync } = useDispatchContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.barrage[2],
      dark: colors.barrage[2],
    },
    time: {
      light: colors.secondary[8],
      dark: colors.secondary[8],
    },
    name: {
      light: colors.primary[8],
      dark: colors.primary[8],
    },
  });
  const headerWidth = React.useRef(0);
  const width = React.useRef(0);
  const { type, basic } = props;
  const sub = () => {
    switch (type) {
      case 'gift':
        return <MessageListGiftItem {...props} />;
      case 'text':
        return <MessageListTextItem {...props} />;
      case 'voice':
        return <MessageListVoiceItem {...props} />;
      default:
        throw new UIKitError({ code: ErrorCode.params });
    }
  };

  return (
    <View
      style={{
        flexDirection: 'column',
      }}
      onLayout={(e) => {
        width.current = e.nativeEvent.layout.width;
        if (type === 'text') {
          emitSync(
            `_$${MessageListTextItem.name}`,
            props.id,
            width.current,
            headerWidth.current
          );
        }
      }}
    >
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <Animated.View
          style={[
            {
              flexDirection: 'row',
              backgroundColor: getColor('backgroundColor'),
              flexShrink: 1,
              marginVertical: 2,
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 10,
            },
          ]}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: type === 'text' ? 'flex-start' : 'center',
            }}
            onLayout={(e) => {
              headerWidth.current = e.nativeEvent.layout.width;
              if (type === 'text') {
                emitSync(
                  `_$${MessageListTextItem.name}`,
                  props.id,
                  width.current,
                  headerWidth.current
                );
              }
            }}
          >
            <View>
              <Text
                textType={'medium'}
                paletteType={'body'}
                style={{
                  color: getColor('time'),
                }}
              >
                {formatTs(basic.timestamp)}
              </Text>
            </View>
            <View>
              <Icon
                name={(basic.tag as IconNameType) ?? 'achievement'}
                style={{ height: 18, width: 18 }}
              />
            </View>
            <View>
              <Avatar
                url={basic.avatar ?? 'http://www.sdf.com/x'}
                size={18}
                borderRadius={18}
              />
            </View>
            <View style={{ marginRight: 4 }}>
              <Text
                textType={'medium'}
                paletteType={'label'}
                style={{ color: getColor('name') }}
              >
                {basic.nickName}
              </Text>
            </View>
          </View>

          {sub()}
        </Animated.View>
      </View>
    </View>
  );
}

export const MessageListItemMemo = React.memo(MessageListItem);
