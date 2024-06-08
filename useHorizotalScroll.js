import { useState, useMemo, useEffect, useCallback } from "react";
import debounce from "lodash.debounce";

const SCROLL_DISTANCE = 300;

export default function useHorizontalScroll(listRef) {
  const [curPosition, setCurPosition] = useState(0);
  const [visibleWidth, setVisibleWidth] = useState(0);
  const [scrollWidth, setScrollWidth] = useState(0);

  const scrollableWidth = useMemo(() => {
    if (!listRef.current) return 0;
    return scrollWidth - visibleWidth;
  }, [scrollWidth, visibleWidth]);

  useEffect(
    function onElementResize() {
      if (!listRef.current) return;

      const handleElementResize = () => {
        setVisibleWidth(listRef.current.getBoundingClientRect().width);
        setScrollWidth(listRef.current.scrollWidth);
        console.log("listRef.current.scrollWidth::", listRef.current.scrollWidth)
        console.log("listRef.current.getBoundingClientRect().width::", listRef.current.getBoundingClientRect().width)
        
      };
      handleElementResize();

      const resizeObserver = new ResizeObserver(handleElementResize);
      resizeObserver.observe(listRef.current);

      return () => {
        resizeObserver.unobserve(listRef.current);
      };
    },
    [listRef.current]
  );

  useEffect(function onElementScroll() {
    if (!listRef.current) return;

    const debouncedHandleElementScroll = debounce((e) => {
      setCurPosition(e.target.scrollLeft);
    }, 50);

    listRef.current.addEventListener("scroll", debouncedHandleElementScroll);
  }, []);

  const scrollRight = useCallback(() => {
    let newPosition = curPosition + SCROLL_DISTANCE;
    if (newPosition > scrollableWidth) {
      newPosition = scrollableWidth;
    }
    listRef.current.scroll({ left: newPosition, behavior: "smooth" });
  }, [curPosition, scrollableWidth]);

  const scrollLeft = useCallback(() => {
    let newPosition = curPosition - SCROLL_DISTANCE;
    if (newPosition < 0) {
      newPosition = 0;
    }
    listRef.current.scroll({ left: newPosition, behavior: "smooth" });
  }, [curPosition, scrollableWidth]);

  return { scrollLeft, scrollRight };
}
