import { Link } from 'react-router-dom';
import { LoaderCircle } from 'lucide-react';
import { buttonClass } from './buttonStyles';

export default function Button({ to, children, variant = 'dark', className = '', loading = false, disabled = false, onClick, ...props }) {
  const style = buttonClass(variant, className);
  const content = <>{loading && <LoaderCircle size={16} className="animate-spin motion-reduce:animate-none" aria-hidden="true"/>}{children}</>;
  if (to) return <Link to={to} className={style} aria-disabled={disabled || loading || undefined} aria-busy={loading || undefined} tabIndex={disabled || loading ? -1 : undefined} onClick={event => { if (disabled || loading) event.preventDefault(); else onClick?.(event); }} {...props}>{content}</Link>;
  return <button className={style} disabled={disabled || loading} aria-busy={loading || undefined} onClick={onClick} {...props}>{content}</button>;
}
