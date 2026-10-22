import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
export function render(url) {
  const helmetContext = {};
  const html = renderToString(<HelmetProvider context={helmetContext}><StaticRouter location={url}><App/></StaticRouter></HelmetProvider>);
  const { helmet } = helmetContext;
  const head = [helmet.title.toString(), helmet.meta.toString(), helmet.link.toString(), helmet.script.toString()].join('\n');
  return { html, head };
}
