import Schema from './Schema';
import { faqSchema } from '../../utils/schemaHelpers';
export default function FAQSchema({ entries }) { return <Schema data={faqSchema(entries)}/>; }
