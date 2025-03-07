"use client";

import * as React from "react";

type Item = {
  id: string | number;
};

/**
 * Props for the FreshScroll component
 * @template T - Type extending Item with an id property
 */
type FreshScrollProps<T extends Item> = {
  /**
   * Component configuration object
   */
  components: {
    /** Component to render each content item */
    content: React.ComponentType<T>;
    /** Loading indicator component */
    loader: React.ReactNode;
    /** Error component or function returning an error component */
    error?: React.ReactNode | ((retry: () => void) => React.ReactNode);
    /** Empty state component or function returning an empty state component */
    empty?: React.ReactNode | ((retry: () => void) => React.ReactNode);
  };
  /** Function to load the next batch of data */
  loadNext: () => Promise<T[] | undefined>;
  /** Initial data to populate the list */
  initialData?: T[];
  /** IntersectionObserver configuration options */
  observerOptions?: IntersectionObserverInit;
  /** Props to be spread on the container div */
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

const DEFAULT_CONTAINER_ID = "__FRESH_SCROLL_CONTAINER__";
const ERROR_CODES = {
  INVALID_DATA_FORMAT: {
    message:
      "Invalid data format received from loadNext! loadNext must return an array!",
    cause: "INVALID_DATA_FORMAT",
  },
};

function FreshScroll<T extends Item>({
  components,
  loadNext,
  initialData = [],
  observerOptions,
  containerProps,
}: FreshScrollProps<T>) {
  const [data, setData] = React.useState<T[]>(initialData);
  const [status, setStatus] = React.useState<
    "loading" | "idle" | "error" | "empty"
  >("idle");

  const sentinelRef = React.useRef<HTMLDivElement>(null);

  const initObserverOptions: IntersectionObserverInit = {
    threshold: 0,
    rootMargin: "0px 0px 0px 0px",
    root: null,
    ...observerOptions,
  };

  const initContainerProps = {
    id: DEFAULT_CONTAINER_ID,
    ...containerProps,
  };

  const getFreshData = React.useCallback(async () => {
    if (status !== "idle") return;

    try {
      setStatus("loading");
      const freshData = await loadNext();

      if (!Array.isArray(freshData)) {
        throw new Error(ERROR_CODES.INVALID_DATA_FORMAT.message, {
          cause: ERROR_CODES.INVALID_DATA_FORMAT.cause,
        });
      }

      if (!freshData.length) {
        setStatus("empty");
        return;
      }

      setData(prev => [...prev, ...freshData]);
      setStatus("idle");
    } catch (_error) {
      setStatus("error");
    }
  }, [loadNext, status]);

  function retry() {
    setStatus("idle");
    getFreshData();
  }

  React.useEffect(() => {
    let observer: IntersectionObserver | null = null;
    const sentinel = sentinelRef.current;

    if (sentinel) {
      observer = new IntersectionObserver(entries => {
        const [entry] = entries;
        if (!entry) return;
        if (entry.isIntersecting) {
          getFreshData();
        }
      }, initObserverOptions);

      observer.observe(sentinel);
    } else {
      getFreshData();
    }

    return () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };
  }, [initObserverOptions, getFreshData]);

  return (
    <div {...initContainerProps}>
      {data.map((item, index) => {
        const Comp = components.content;
        const isLast = index === data.length - 1;
        return (
          <div key={item.id} ref={isLast ? sentinelRef : undefined}>
            <Comp {...item} />
          </div>
        );
      })}
      {status === "loading" && components.loader}
      {status === "error" &&
        (typeof components.error === "function"
          ? components.error(retry)
          : components.error)}
      {status === "empty" &&
        (typeof components.empty === "function"
          ? components.empty(retry)
          : components.empty)}
    </div>
  );
}

export {FreshScroll, type FreshScrollProps, DEFAULT_CONTAINER_ID};
