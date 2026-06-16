import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import App from './src/App.jsx';

// Mock browser globals needed for rendering
globalThis.window = {
  location: { pathname: '/' },
  history: { pushState: () => {}, replaceState: () => {}, state: null },
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {},
  matchMedia: () => ({ matches: false, addListener: () => {}, removeListener: () => {} }),
};
globalThis.localStorage = {
  getItem: () => 'dark',
  setItem: () => {},
  removeItem: () => {}
};
globalThis.document = {
  createElement: () => ({ style: {} }),
  documentElement: { style: {}, classList: { toggle: () => {} } },
};
globalThis.navigator = { userAgent: 'node' };

try {
  console.log("Starting React dry-run render test...");
  const html = ReactDOMServer.renderToString(
    <MemoryRouter initialEntries={['/analysis']}>
      <App />
    </MemoryRouter>
  );
  console.log("✅ Render test succeeded! HTML output length:", html.length);
  process.exit(0);
} catch (error) {
  console.error("❌ Render test failed with error:");
  console.error(error);
  process.exit(1);
}
