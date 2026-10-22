export default function Container({ children, className = '', as: Component = 'div' }) {
  return <Component className={`site-container mx-auto w-full max-w-7xl px-4 sm:px-7 md:px-10 ${className}`}>{children}</Component>;
}
