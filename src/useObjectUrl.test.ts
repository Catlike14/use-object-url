import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { MockInstance } from 'vitest';
import useObjectUrl from './index';

describe('useObjectUrl', () => {
  let createObjectURLSpy: MockInstance<typeof URL.createObjectURL> | undefined;
  let revokeObjectURLSpy: MockInstance<typeof URL.revokeObjectURL> | undefined;

  beforeEach(() => {
    createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
    revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  afterEach(() => {
    createObjectURLSpy?.mockRestore();
    revokeObjectURLSpy?.mockRestore();
  });

  it('creates an object URL for a blob', () => {
    const blob = new Blob(['test']);
    const { result } = renderHook(() => useObjectUrl(blob));

    expect(createObjectURLSpy).toHaveBeenCalledWith(blob);
    expect(result.current).toBe('blob:mock-url');
  });

  it('revokes the object URL on unmount', () => {
    const blob = new Blob(['test']);
    const { unmount } = renderHook(() => useObjectUrl(blob));

    unmount();

    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
  });

  it('reuses the same object URL for the same blob', () => {
    const blob = new Blob(['test']);

    const { result: result1 } = renderHook(() => useObjectUrl(blob));
    const { result: result2 } = renderHook(() => useObjectUrl(blob));

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);
    expect(result1.current).toBe(result2.current);
  });

  it('does not revoke the URL when there are multiple references', () => {
    const blob = new Blob(['test']);

    const { unmount: unmount1 } = renderHook(() => useObjectUrl(blob));
    const { unmount: unmount2 } = renderHook(() => useObjectUrl(blob));

    unmount1();
    expect(revokeObjectURLSpy).not.toHaveBeenCalled();

    unmount2();
    expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1);
  });

  it('revokes the URL only when all references are gone', () => {
    const blob = new Blob(['test']);

    const { unmount: unmount1 } = renderHook(() => useObjectUrl(blob));
    const { unmount: unmount2 } = renderHook(() => useObjectUrl(blob));
    const { unmount: unmount3 } = renderHook(() => useObjectUrl(blob));

    expect(createObjectURLSpy).toHaveBeenCalledTimes(1);

    unmount1();
    expect(revokeObjectURLSpy).not.toHaveBeenCalled();

    unmount2();
    expect(revokeObjectURLSpy).not.toHaveBeenCalled();

    unmount3();
    expect(revokeObjectURLSpy).toHaveBeenCalledTimes(1);
  });

  it('creates different URLs for different blobs', () => {
    createObjectURLSpy?.mockRestore();
    createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValueOnce('blob:url-1')
      .mockReturnValueOnce('blob:url-2');

    const blob1 = new Blob(['test1']);
    const blob2 = new Blob(['test2']);

    const { result: result1 } = renderHook(() => useObjectUrl(blob1));
    const { result: result2 } = renderHook(() => useObjectUrl(blob2));

    expect(result1.current).toBe('blob:url-1');
    expect(result2.current).toBe('blob:url-2');
    expect(createObjectURLSpy).toHaveBeenCalledTimes(2);
  });

  it('handles blob changes correctly', () => {
    const blob1 = new Blob(['test1']);
    const blob2 = new Blob(['test2']);

    createObjectURLSpy?.mockRestore();
    createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValueOnce('blob:url-1')
      .mockReturnValueOnce('blob:url-2');

    const { result, rerender } = renderHook(({ blob }) => useObjectUrl(blob), {
      initialProps: { blob: blob1 },
    });

    expect(result.current).toBe('blob:url-1');

    rerender({ blob: blob2 });

    expect(result.current).toBe('blob:url-2');
    expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:url-1');
    expect(createObjectURLSpy).toHaveBeenCalledTimes(2);
  });
});
