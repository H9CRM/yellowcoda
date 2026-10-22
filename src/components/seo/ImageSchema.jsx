import Schema from './Schema';
import { imageSchema } from '../../utils/schemaHelpers';
export default function ImageSchema({ name, path, caption }) { return <Schema data={imageSchema(name,path,caption)}/>; }
