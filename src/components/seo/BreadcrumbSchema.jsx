import Schema from './Schema';
import { breadcrumbSchema } from '../../utils/schemaHelpers';
export default function BreadcrumbSchema({ items }) { return <Schema data={breadcrumbSchema(items)}/>; }
