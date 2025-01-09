import { MouseEvent, useCallback, useEffect, useState } from "react";

import { allowScroll, preventScroll } from "@/utils/scroll";

type UseModalReturn = [boolean, () => void, Element | null, () => void];

const useModal = (): UseModalReturn => {
  const [show, setShow] = useState(false);
  const [portalElement, setPortalElement] = useState<Element | null>(null);

  useEffect(() => {
    const portal = document.getElementById("modal-overlay")

    setPortalElement(portal);

    if (portal) {
      if (show) {
        portal.className = portal.style.display = 'flex'
        portal.addEventListener('click', handleClickToClose.bind(this, portal))

        preventScroll()
      } else if (portal.children.length === 0) {

        portal.className = portal.style.display = 'none'
        portal.removeEventListener('click', handleClickToClose.bind(this, portal))

        allowScroll()
      }
    }
  }, [show]);

  const modalHandler = () => {
    setShow(!show);
  };

  const handleClickToClose = useCallback((portal: Element, event: MouseEvent<Element>) => {
    const {clientX, clientY} = event
    const {top, bottom, left, right} = portal.children[0]?.getBoundingClientRect() ?? {}

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