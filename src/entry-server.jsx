import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import { basePath } from './utils/sitePath';
export function render(url) {
  const helmetContext = {};
  const location = `${basePath.replace(/\/$/, '')}${url}`;
  const html = renderToString(<HelmetProvider context={helmetContext}><StaticRouter basename={basePath} location={location}><App/></StaticRouter></HelmetProvider>);
  const { helmet } = helmetContext;
  const head = [helmet.title.toString(), helmet.meta.toString(), helmet.link.toString(), helmet.script.toString()].join('\n');
  return { html, head };
}
