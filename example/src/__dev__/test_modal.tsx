import * as React from 'react';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import { Modal, ModalRef } from 'react-native-chat-room';

export function ModalComponent(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const modalRef = React.useRef<ModalRef>({} as any);
  return (
    <View style={{ flex: 1, paddingTop: 100 }}>
      <Pressable
        onPress={() => {
          modalRef.current.startShow();
        }}
      >
        <View style={{ width: width, height: 50, backgroundColor: 'orange' }} />
      </Pressable>
      <Modal
        propsRef={modalRef}
        modalAnimationType="slide"
        backgroundColor={'rgba(1,1,1, 0.2)'}
        backgroundTransparent={false}
        onRequestModalClose={() => {
          modalRef.current.startHide();
        }}
      >
        <Pressable
        // style={{ height: 400, backgroundColor: 'yellow' }}
        // onPress={() => {
        //   modalRef.current.startHide();
        // }}
        >
          <View style={{ height: 400, backgroundColor: 'yellow' }} />
        </Pressable>
      </Modal>
    </View>
  );
}

export function AlertComponent(): React.JSX.Element {
  const { width } = useWindowDimensions();
  const modalRef = React.useRef<ModalRef>({} as any);
  return (
    <View style={{ flex: 1, paddingTop: 100 }}>
      <Pressable
        onPress={() => {
          modalRef.current.startShow();
        }}
      >
        <View style={{ width: width, height: 50, backgroundColor: 'orange' }} />
      </Pressable>
      <Modal
        propsRef={modalRef}
        modalAnimationType="fade"
        backgroundColor={'rgba(1,1,1, 0.2)'}
        backgroundTransparent={false}
        onRequestModalClose={() => {
          modalRef.current.startHide();
        }}
        modalStyle={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <Pressable
          style={{ height: 200, width: 200, backgroundColor: 'yellow' }}
          onPress={() => {
            modalRef.current.startHide();
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
