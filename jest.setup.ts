import '@testing-library/jest-dom';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
  })),
});

HTMLCanvasElement.prototype.getContext = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter() {
    return { push: jest.fn(), replace: jest.fn(), prefetch: jest.fn() };
  },
  usePathname() { return '/'; },
  useSearchParams() { return new URLSearchParams(); },
}));

jest.mock('next-auth/react', () => ({
  useSession() { return { data: null, status: 'unauthenticated' }; },
  signIn: jest.fn(),
  signOut: jest.fn(),
}));
