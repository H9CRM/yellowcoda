import { catalogProducts } from './catalogue';
import { products as conceptProducts } from './products';

export function findBagProduct(id) {
  return catalogProducts.find(product => product.id === id) || conceptProducts.find(product => product.id === id);
}

export function bagProductPath(product) {
  return product.id.toString().startsWith('catalog-') ? `/products/${product.slug}` : '/products/watch-straps';
}
