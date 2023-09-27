import * as React from 'react';
import { Keyboard } from 'react-native';

export function useKeyboardHeight(useCache: boolean) {
  const [keyboardHeight, setKeyboardHeight] = React.useState(0);

  React.useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
      if (useCache === true) {
        if (keyboardHeight !== e.endCoordinates.height) {
          setKeyboardHeight(e.endCoordinates.height);
        }
      } else {
        setKeyboardHeight(e.endCoordinates.height);
      }
    });
    const hideSubscription = Keyboard.addListener('keyboardWillHide', () => {
      if (useCache === true) {
      } else {
        setKeyboardHeight(0);
      }
    });
    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, [keyboardHeight, setKeyboardHeight, useCache]);

  console.log('test:useKeyboardHeight:', keyboardHeight);
  return keyboardHeight;
}
