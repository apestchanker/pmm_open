import { useCallback, useState } from 'react';

export default function useToggle(value = false): [boolean, () => void] {
  const [toggleState, setToggleState] = useState(value);
  const toggle = useCallback(() => {
    setToggleState((toggleState) => !toggleState);
  }, []);
  return [toggleState, toggle];
}
