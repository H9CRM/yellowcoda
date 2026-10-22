import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
export default function Breadcrumbs({ items }) {
  return <nav aria-label="Breadcrumb" className="breadcrumbs pt-6 text-xs text-muted"><ol><li><Link to="/">Home</Link></li>{items.map((item, i) => <li key={`${item.name}-${i}`}><ChevronRight size={14} aria-hidden="true" />{item.path ? <Link to={item.path}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}</li>)}</ol></nav>;
}
