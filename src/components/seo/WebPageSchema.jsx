import Schema from './Schema';
import { webpageSchema } from '../../utils/schemaHelpers';
export default function WebPageSchema({ path, title, description }) { return <Schema data={webpageSchema(path,title,description)}/>; }
