import type {
  ProductPresentationDetailResponse,
  PromoResponse,
  Product,
} from '@pharmatech/sdk';

export type ExtendedProduct = ProductPresentationDetailResponse & {
  product: Product;
  promo?: PromoResponse | PromoResponse[] | null;
};
