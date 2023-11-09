import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { usePaletteContext } from '../../theme';
import { Queue, timeoutTask } from '../../utils';

export type SimpleToastRef = {
  pushTask: (message: string) => void;
};
export type SimpleToastProps = {
  propsRef: React.RefObject<SimpleToastRef>;
  timeout?: number;
};
export function SimpleToast(props: SimpleToastProps) {
  const { propsRef, timeout = 3000 } = props;
  const tasks: Queue<string> = React.useRef(new Queue<string>()).current;
  const preTask = React.useRef<string | undefined>(undefined);
  const curTask = React.useRef<string | undefined>(undefined);
  const { colors } = usePaletteContext();

  const [text, setText] = React.useState<string | undefined>(undefined);
  const [isShow, setIsShow] = React.useState(false);

  const execTask = () => {
    if (curTask.current === undefined) {
      const task = tasks.dequeue();
      if (task) {
        curTask.current = task;
        execAnimation(() => {
          execTask();
        });
      } else {
        setIsShow(false);
      }
    }
  };

  const execAnimation = (onFinished?: () => void) => {
    setIsShow(true);
    setText(curTask.current ?? '');
    timeoutTask(timeout, () => {
      preTask.current = curTask.current;
      curTask.current = undefined;
      onFinished?.();
    });
  };

  if (propsRef.current) {
    propsRef.current.pushTask = (message: string) => {
      tasks.enqueue(message);
      execTask();
    };
  }
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          justifyContent: 'center',
          alignItems: 'center',
          top: '70%',
          display: isShow === true ? 'flex' : 'none',
        },
      ]}
      pointerEvents={'none'}
    >
      <View
        style={{
          paddingHorizontal: 20,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: 'hsla(0, 0%, 0%, 0.35)',
        }}
      >
        <Text
          style={{
            maxWidth: '50%',
            color: colors.neutral[98],
            fontSize: 14,
            fontWeight: '500',
            lineHeight: 18,
          }}
        >
          {text}
        </Text>
      </View>
    </View>
  );
}
