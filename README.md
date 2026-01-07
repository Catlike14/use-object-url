# @catlike14/use-object-url

React hook for `URL.createObjectURL` with automatic cleanup (`URL.revokeObjectURL`) and reference counting.

## Features

- 🚀 **Automatic cleanup**: Object URLs are automatically revoked when no longer needed
- 🔄 **Reference counting**: Reuses the same URL for the same Blob across multiple components
- 💾 **Memory efficient**: Uses WeakMap for automatic garbage collection
- 🎯 **TypeScript support**: Full type definitions included
- ⚡ **Lightweight**: Minimal bundle size

## Installation

```bash
npm install @catlike14/use-object-url
```


## Usage

```tsx
import useObjectUrl from '@catlike14/use-object-url';

function ImagePreview({ imageBlob }: { imageBlob: Blob }) {
  const imageUrl = useObjectUrl(imageBlob);

  return <img src={imageUrl} alt="Preview" />;
}
```

## Requirements

- React >= 16.8.0 (hooks support)

## TypeScript

This package is written in TypeScript and includes type definitions out of the box.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
