import Schema from './Schema';
import { officialContactPoint } from '../../data/schemaData';
export default function ContactPointSchema({ contact = officialContactPoint }) { return <Schema data={{ '@context': 'https://schema.org', ...contact }}/>; }
