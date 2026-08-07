import { HttpClient } from '../utils';
import type {
  ProductCategory,
  ProductCategoryTreeNode,
  CreateProductCategoryRequest,
  UpdateProductCategoryRequest,
  ListProductCategoriesParams,
} from '../types';

interface ListProductCategoriesResponse {
  data: ProductCategory[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

interface ProductCategoriesTreeResponse {
  data: ProductCategoryTreeNode[];
}

/**
 * ProductCategories resource for managing the org-scoped product category tree.
 *
 * Category IDs returned here can be passed as `product_category_id` when creating
 * a waybill.
 */
export class ProductCategories {
  constructor(private readonly http: HttpClient) {}

  /**
   * List product categories as a flat, paginated list.
   *
   * @param params - Query parameters for filtering
   * @returns Paginated list of product categories
   *
   * @example
   * ```typescript
   * const categories = await client.productCategories.list({ is_active: true });
   * console.log(categories.data); // Array of product categories
   * ```
   */
  async list(params?: ListProductCategoriesParams): Promise<ListProductCategoriesResponse> {
    return this.http.get<ListProductCategoriesResponse>(
      '/product-categories',
      params as Record<string, unknown>,
    );
  }

  /**
   * Fetch the full category hierarchy as a nested tree.
   *
   * @returns The category tree (roots with nested `children`)
   *
   * @example
   * ```typescript
   * const { data } = await client.productCategories.tree();
   * data.forEach(root => console.log(root.name, root.children.length));
   * ```
   */
  async tree(): Promise<ProductCategoriesTreeResponse> {
    return this.http.get<ProductCategoriesTreeResponse>('/product-categories', {
      tree: true,
    });
  }

  /**
   * Create a new product category.
   *
   * @param data - Category creation data (omit `parent_id` for a root category)
   * @returns The created product category
   *
   * @example
   * ```typescript
   * const root = await client.productCategories.create({ name: 'Electronics' });
   * const child = await client.productCategories.create({
   *   name: 'Batteries',
   *   parent_id: root.id,
   * });
   * ```
   */
  async create(data: CreateProductCategoryRequest): Promise<ProductCategory> {
    return this.http.post<ProductCategory>(
      '/product-categories',
      data as unknown as Record<string, unknown>,
    );
  }

  /**
   * Update a product category. Setting `parent_id` re-parents the node.
   *
   * @param id - Product category ID
   * @param data - Fields to update
   * @returns The updated product category
   *
   * @example
   * ```typescript
   * await client.productCategories.update('category-uuid', { is_active: false });
   * ```
   */
  async update(id: string, data: UpdateProductCategoryRequest): Promise<ProductCategory> {
    return this.http.patch<ProductCategory>(
      `/product-categories/${encodeURIComponent(id)}`,
      data as unknown as Record<string, unknown>,
    );
  }

  /**
   * Delete a product category and its subtree.
   *
   * @param id - Product category ID
   */
  async delete(id: string): Promise<void> {
    await this.http.delete(`/product-categories/${encodeURIComponent(id)}`);
  }
}
