import { useEffect } from "react";

import {allowScroll, preventScroll} from "@/utils/scroll";

const usePreventScroll = () => {
    useEffect(() => {
        const prevScrollY = preventScroll();

        return () => {
            allowScroll(prevScrollY);
        };
    }, []);
};

export default usePreventScroll;