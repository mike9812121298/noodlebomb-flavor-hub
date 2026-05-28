import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { trackMetaPageView } from "@/lib/meta-pixel";

const MetaPixelPageViewTracker = () => {
  const location = useLocation();
  const didSkipInitial = useRef(false);

  useEffect(() => {
    if (!didSkipInitial.current) {
      didSkipInitial.current = true;
      return;
    }
    trackMetaPageView();
  }, [location.pathname, location.search]);

  return null;
};

export default MetaPixelPageViewTracker;
