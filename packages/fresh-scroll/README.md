# Fresh Scroll 🚀

[Link to documentation](https://danielbilek.com/fresh-scroll)

A zero-dependency, TypeScript-ready infinite scroll component for React. Perfect for social feeds, product listings, and content streams with blazing fast performance.

This component is headless and does not include any styling. You have full control over the component's appearance.

```tsx
 <FreshScroll<ContentItem>
      containerProps={{
        className: "flex flex-col gap-4",
      }}
      components={{
        content: ContentCard,
        loader: <div>Loading...</div>,
        empty: retry => <button onClick={retry}>Retry</button>,
        error: retry => <button onClick={retry}>Retry</button>,
      }}
      loadNext={loadNext}
    />
```

## Features

- 🪶 Zero dependencies
- 📦 TypeScript ready
- ⚡️ Minimal and performant
- 🎯 Simple API
- 🔄 Built-in loading, error, and empty states
- ⚙️ Customizable IntersectionObserver options

## Documentation

[Documentation](https://danielbilek.com/fresh-scroll)

## Installation

```bash
npm install fresh-scroll
```

or

```bash
yarn add fresh-scroll
```

or

```bash
pnpm add fresh-scroll
```
## License

MIT © [Daniel Bílek](https://danielbilek.com)
