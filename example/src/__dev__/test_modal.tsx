import * as React from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Modal } from 'react-native-chat-room';

export function ModalComponent(): React.JSX.Element {
  const [visible, setVisible] = React.useState(false);
  const { width } = useWindowDimensions();
  return (
    <View
      style={{ flex: 1, paddingTop: 100 }}
      onLayout={(e) => {
        console.log('test:onLayout:', e.nativeEvent.layout);
      }}
    >
      <Pressable
        onPress={() => {
          setVisible(!visible);
        }}
      >
        <View style={{ width: width, height: 50, backgroundColor: 'orange' }} />
      </Pressable>
      <Modal
        modalAnimationType="slide"
        backgroundColor={'rgba(1,1,1, 0.2)'}
        backgroundTransparent={false}
        modalVisible={visible}
        onRequestModalClose={() => {
          setVisible(false);
        }}
      >
        <Pressable
          style={{ height: 400, backgroundColor: 'yellow' }}
          onPress={() => {
            setVisible(false);
          }}
        />
      </Modal>
    </View>
  );
}

export function AlertComponent(): React.JSX.Element {
  const [visible, setVisible] = React.useState(false);
  const { width } = useWindowDimensions();
  return (
    <View
      style={{ flex: 1, paddingTop: 100 }}
      onLayout={(e) => {
        console.log('test:onLayout:', e.nativeEvent.layout);
      }}
    >
      <Pressable
        onPress={() => {
          setVisible(!visible);
        }}
      >
        <View style={{ width: width, height: 50, backgroundColor: 'orange' }} />
      </Pressable>
      <Modal
        modalAnimationType="fade"
        backgroundColor={'rgba(1,1,1, 0.2)'}
        backgroundTransparent={false}
        modalVisible={visible}
        onRequestModalClose={() => {
          setVisible(false);
        }}
        modalStyle={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <Pressable
          style={{ height: 200, width: 200, backgroundColor: 'yellow' }}
          onPress={() => {
            setVisible(false);
          }}
        />
      </Modal>
    </View>
  );
}

const S = ({ type }: { type: number }) => {
  if (type === 1) {
    return <AlertComponent />;
  } else {
    return <ModalComponent />;
  }
};

export function TestModal() {
  const [type, setType] = React.useState<number>(1);
  return (
    <View>
      <Pressable
        style={{
          height: 100,
          backgroundColor: 'blue',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
        onPress={() => {
          setType(type === 1 ? 2 : 1);
        }}
      >
        <Text> change alert or modal </Text>
      </Pressable>
      <S type={type} />
    </View>
  );
}

export default function test_modal() {
  return <TestModal />;
}
