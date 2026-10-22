import Schema from './Schema';
import { serviceSchema } from '../../utils/schemaHelpers';
export default function ServiceSchema({ name, description, path }) { return <Schema data={serviceSchema(name,description,path)}/>; }
