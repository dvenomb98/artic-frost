"use client";

// IMPORT BEFORE REACT
import {scan} from "react-scan";

import {useEffect} from "react";

function ReactScan() {
  useEffect(() => {
    scan({
      enabled: process.env.NEXT_PUBLIC_REACT_SCAN_ENABLED === "true",
    });
  }, []);

  return null;
}

export {ReactScan};
