import { Helmet } from 'react-helmet-async';
export default function Schema({ data }) { return <Helmet><script type="application/ld+json">{JSON.stringify(data)}</script></Helmet>; }
