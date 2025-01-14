import { useCallback, useEffect, useState } from "react";

import { allowScroll, preventScroll } from "@/utils/scroll";

type UseModalReturn = [boolean, () => void, Element | null, () => void];

const useModal = (): UseModalReturn => {
  const [show, setShow] = useState(false);
  const [portalElement, setPortalElement] = useState<Element | null>(null);

  useEffect(() => {
    const portal = document.getElementById('modal-overlay')

    setPortalElement(portal);

    if (portal) {
      if (show) {
        portal.className = portal.style.display = 'flex'
        portal.addEventListener('click', handleClickToClose)

        preventScroll()
      } else if (portal.children.length === 0) {

        portal.className = portal.style.display = 'none'
        portal.removeEventListener('click', handleClickToClose)

        allowScroll()
      }
    }
  }, [show]);

  const modalHandler = () => {
    setShow(!show);
  };

  const handleClickToClose = useCallback((event: HTMLElementEventMap['click']) => {
    const {clientX, clientY} = event
    const portal = document.getElementById("modal-overlay")
    const {top, bottom, left, right} = portal?.children[0]?.getBoundingClientRect() ?? {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    }

    if (
      (left <= clientX && clientX <= right) &&
      (top <= clientY && clientY <= bottom)
    ) {
      event.stopPropagation()
    } else {
      // modalHandler()
    }
  }, [modalHandler])

  return [show, modalHandler, portalElement, () => setShow(false)];
};

export default useModal;