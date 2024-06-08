import React, { ReactElement, useEffect, useRef } from 'react';

function useOutClicked(ref, cb) {
  const staticCb = useRef(cb).current;

  useEffect(
    () => {
      const checkIfClickedOutside = e => {
        if (ref.current && !ref.current.contains(e.target)) {
          staticCb();
        }
      };
      document.addEventListener('mousedown', checkIfClickedOutside);
      document.addEventListener('touchstart', checkIfClickedOutside);
      return () => {
        // Cleanup the event listener
        document.removeEventListener('mousedown', checkIfClickedOutside);
        document.removeEventListener('touchstart', checkIfClickedOutside);
      };
    },
    [staticCb]
  );
}
export default useOutClicked;
