import Schema from './Schema';
import { organizationSchema } from '../../utils/schemaHelpers';
// Render only when verified locality/contact details are supplied.
export default function LocalBusinessSchema({ address, telephone }) { return address && telephone ? <Schema data={{ ...organizationSchema, '@type': 'LocalBusiness', address, telephone }}/> : null; }
