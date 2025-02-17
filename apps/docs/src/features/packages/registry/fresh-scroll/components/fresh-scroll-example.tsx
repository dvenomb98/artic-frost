"use client";

import { Button, Skeleton } from "@ui/components";
import { FreshScroll } from "@artic-frost/fresh-scroll";
import * as React from "react";

const MAX_ITEMS_PER_EXAMPLE = 15;
const DELAY = 2000;

type ContentItem = {
  id: string;
  title: string;
  description: string;
};

const INITIAL_DATA: ContentItem[] = [
  {
    id: "1__1",
    title: "Initial Item",
    description: "This is a sample description for the initial item.",
  },
  {
    id: "2__2",
    title: "Initial Item",
    description: "This is a sample description for the initial item.",
  }
];

function loadNext(
  trackedIndex: React.MutableRefObject<number>
): Promise<ContentItem[]> {
  return new Promise<ContentItem[]>(resolve => {
    setTimeout(() => {
      const items: ContentItem[] = Array.from({ length: 5 }, (_, index) => ({
        id: crypto.randomUUID(),
        title: `Item ${trackedIndex.current + index + 1}`,
        description: `This is a sample description for item ${trackedIndex.current + index + 1}.`,
      }));

      trackedIndex.current += items.length;
      resolve(items);
    }, DELAY);
  });
}

function ContentCard({ title, description }: ContentItem) {
  return (
    <div className="p-4 border rounded-md w-full space-y-4 h-32 bg-card">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
}

function Loader() {
  return (
    <div className="w-full h-32">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

function Empty({ retry }: { retry: () => void }) {
  return (
    <div className="space-y-4">
      <p>No more items found</p>
      <Button onClick={retry}>Retry</Button>
    </div>
  );
}

function ErrorComponent({ retry }: { retry: () => void }) {
  return (
    <div className="space-y-4">
      <p>Error loading items</p>
      <Button variant="destructive" onClick={retry}>
        Retry
      </Button>
    </div>
  );
}

function FreshScrollExample() {
  const trackedIndex = React.useRef(0);

  async function loadNextWithEmpty() {
    if (trackedIndex.current >= MAX_ITEMS_PER_EXAMPLE) {
      return new Promise<ContentItem[]>(resolve =>
        setTimeout(() => resolve([]), DELAY)
      );
    }
    return await loadNext(trackedIndex);
  }

  return (
    <FreshScroll<ContentItem>
      containerProps={{
        className: "flex flex-col gap-4",
      }}
      components={{
        content: ContentCard,
        loader: <Loader />,
        empty: retry => <Empty retry={retry} />,
      }}
      loadNext={loadNextWithEmpty}
    />
  );
}

function FreshScrollExampleWithError() {
  const trackedIndex = React.useRef(0);

  async function loadNextWithError() {
    if (trackedIndex.current >= MAX_ITEMS_PER_EXAMPLE) {
      return new Promise<ContentItem[]>((_, reject) =>
        setTimeout(() => reject(new Error("Failed to load items")), DELAY)
      );
    }
    return await loadNext(trackedIndex);
  }

  return (
    <FreshScroll<ContentItem>
      containerProps={{
        className: "flex flex-col gap-4",
      }}
      components={{
        content: ContentCard,
        loader: <Loader />,
        error: retry => <ErrorComponent retry={retry} />,
      }}
      loadNext={loadNextWithError}
    />
  );
}

function FreshScrollExampleWithInitialData() {
  const trackedIndex = React.useRef(0);

  async function loadNextWithEmpty() {
    if (trackedIndex.current >= MAX_ITEMS_PER_EXAMPLE) {
      return new Promise<ContentItem[]>(resolve =>
        setTimeout(() => resolve([]), DELAY)
      );
    }
    return await loadNext(trackedIndex);
  }

  return (
    <FreshScroll<ContentItem>
      containerProps={{
        className: "flex flex-col gap-4",
      }}
      initialData={INITIAL_DATA}
      components={{
        content: ContentCard,
        loader: <Loader />,
        empty: retry => <Empty retry={retry} />,
      }}
      loadNext={loadNextWithEmpty}
    />
  );
}

export { FreshScrollExample, FreshScrollExampleWithError, FreshScrollExampleWithInitialData };
