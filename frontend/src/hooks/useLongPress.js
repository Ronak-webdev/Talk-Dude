import { useState, useRef, useEffect } from "react";

const useLongPress = (callback = () => { }, options = {}) => {
  const {
    shouldPreventDefault = true,
    delay = 500, // 500ms for long press
    touchThreshold = 10, // Movement threshold in pixels
  } = options;

  const [longPressTriggered, setLongPressTriggered] = useState(false);
  const timeout = useRef(null);
  const startPosition = useRef({ x: 0, y: 0 });
  const targetElement = useRef(null);

  const start = (event) => {
    // Get touch or mouse position
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    startPosition.current = { x: clientX, y: clientY };
    targetElement.current = event.currentTarget;

    if (shouldPreventDefault && event.target) {
      event.target.addEventListener("dragend", preventDefault, { passive: false });
    }

    timeout.current = setTimeout(() => {
      event.persist();
      setLongPressTriggered(true);
      callback(event);
    }, delay);
  };

  const move = (event) => {
    if (!timeout.current) return;

    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;

    const deltaX = clientX - startPosition.current.x;
    const deltaY = clientY - startPosition.current.y;

    // Cancel if moved beyond threshold
    if (Math.abs(deltaX) > touchThreshold || Math.abs(deltaY) > touchThreshold) {
      clear();
    }
  };

  const clear = () => {
    if (timeout.current) {
      clearTimeout(timeout.current);
      timeout.current = null;
    }
  };

  const stop = (event) => {
    if (targetElement.current && shouldPreventDefault) {
      targetElement.current.removeEventListener("dragend", preventDefault);
    }
    clear();
  };

  const preventDefault = (event) => {
    if (!event.cancelable) return;
    event.preventDefault();
  };

  // For touch events
  useEffect(() => {
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return {
    handlers: {
      onTouchStart: start,
      onTouchMove: move,
      onTouchEnd: stop,
      onMouseDown: start,
      onMouseUp: stop,
      onMouseLeave: stop,
    },
    longPressTriggered,
  };
};

export default useLongPress;
