import * as React from 'react';
import { Animated } from 'react-native';
import { View } from 'react-native';

import type { IconNameType } from '../../assets';
import { useDispatchContext } from '../../dispatch';
import { ErrorCode, UIKitError } from '../../error';
import { useColors } from '../../hook';
import { usePaletteContext } from '../../theme';
import { Icon } from '../../ui/Image';
import { PresetCalcTextWidth, Text } from '../../ui/Text';
import { msgTs } from '../../utils';
import { Avatar } from '../Avatar';

// const AnimatedText = Animated.createAnimatedComponent(Text);

export type TextContent = {
  text: string;
};
export type GiftContent = {
  gift: string;
  text: string;
};
export type VoiceContent = {
  icon: IconNameType;
  length: number;
};

export type MessageListItemContent = TextContent | GiftContent | VoiceContent;

export type MessageListItemProps = {
  id: string;
  type: 'voice' | 'text' | 'gift';
  content: MessageListItemContent;
};

export function MessageListItem(props: MessageListItemProps) {
  const { emitSync } = useDispatchContext();
  const { colors } = usePaletteContext();
  const { getColor } = useColors({
    backgroundColor: {
      light: colors.barrage[2],
      dark: colors.barrage[2],
    },
  });
  const headerWidth = React.useRef(0);
  const width = React.useRef(0);
  const { type } = props;
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
        console.log('test:onLayout:3:', e.nativeEvent.layout);
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
              console.log('test:onLayout:2:', e.nativeEvent.layout);
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
              <Text textType={'medium'} paletteType={'body'}>
                {msgTs(Date.now())}
              </Text>
            </View>
            <View>
              <Icon name={'achievement'} style={{ height: 18, width: 18 }} />
            </View>
            <View>
              <Avatar
                url={'http://www.sdf.com/x'}
                size={18}
                borderRadius={18}
              />
            </View>
            <View style={{ marginRight: 4 }}>
              <Text textType={'medium'} paletteType={'label'}>
                {'name'}
              </Text>
            </View>
          </View>

          {sub()}
        </Animated.View>
      </View>
    </View>
  );
}

const MessageListTextItem = (props: MessageListItemProps) => {
  const { content } = props;
  const { fonts } = usePaletteContext();
  const { addListener, removeListener } = useDispatchContext();
  const c = content as TextContent;
  const contentWidth = React.useRef(0);
  const unitSpaceWidth = React.useRef(3.5);
  const [text, setText] = React.useState(c.text);
  const translateX = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    const listener = (cId: string, width: number, headerWidth: number) => {
      if (props.id === cId) {
        if (width === 0 || headerWidth === 0) {
          return;
        }
        // @ts-ignore
        if (headerWidth === -translateX.__getValue()) {
          return;
        }
        if (width - headerWidth > contentWidth.current) {
          // todo: one line
        } else {
          translateX.setValue(-headerWidth);
          const spacesString = Array(
            Math.round(headerWidth / unitSpaceWidth.current)
          )
            .fill(' ')
            .join('');
          setText(spacesString + c.text);
        }
      }
    };
    addListener(`_$${MessageListTextItem.name}`, listener);
    return () => {
      removeListener(`_$${MessageListTextItem.name}`, listener);
    };
  }, [addListener, c.text, props.id, removeListener, translateX]);
  return (
    <>
      <PresetCalcTextWidth
        content={' '}
        textProps={{ style: fonts.body.medium }}
        onWidth={(width: number) => {
          unitSpaceWidth.current = width;
        }}
      />
      <PresetCalcTextWidth
        content={c.text}
        textProps={{ style: fonts.body.medium }}
        onWidth={(width: number) => {
          contentWidth.current = width;
        }}
      />
      <Animated.Text
        // textType={'medium'}
        // paletteType={'body'}
        style={[
          {
            transform: [{ translateX: translateX }],
          },
          {
            ...fonts.body.medium,
          },
        ]}
      >
        {text}
      </Animated.Text>
    </>
  );
};

const MessageListVoiceItem = (props: MessageListItemProps) => {
  const { content } = props;
  const c = content as VoiceContent;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Icon name={'2_bars_in_circle'} style={{ height: 10, width: 43 }} />
      <Text textType={'medium'} paletteType={'body'}>{`${c.length}''`}</Text>
    </View>
  );
};

const MessageListGiftItem = (props: MessageListItemProps) => {
  const { content } = props;
  const c = content as GiftContent;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text textType={'medium'} paletteType={'body'}>
        {c.text}
      </Text>
      <Icon name={'link'} style={{ height: 18, width: 18 }} />
    </View>
  );
};
