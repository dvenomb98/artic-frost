"use client";
import {useEffect, useState} from "react";

const useMounted = (): boolean => {
  const [mounted, setMounted] = useState<boolean>(false);
  useEffect(() => setMounted(true), []);
  return mounted;
};

export {useMounted};
