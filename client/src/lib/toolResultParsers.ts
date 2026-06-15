import type {
  Product,
  ProductDetail,
  Category,
  DeliveryCity,
  DeliveryInfo,
  OrderConfirmation,
  OrderTracking
} from '../types';


function unwrapToolOutput(output: unknown): unknown {
  if (output == null) return null;

  // If it's a string, try to parse it as JSON
  if (typeof output === 'string') {
    try {
      return unwrapToolOutput(JSON.parse(output));
    } catch {
      return output;
    }
  }

  if (typeof output !== 'object') return output;

  const obj = output as Record<string, unknown>;

  // MCP content wrapper: { content: [{ type: 'text', text: '...' }] }
  if (Array.isArray(obj.content) && obj.content.length > 0) {
    const textItem = obj.content.find((c: any) => c.type === 'text' && typeof c.text === 'string');
    if (textItem) {
      return unwrapToolOutput((textItem as any).text);
    }
  }

  // Nested result wrapper
  if ('result' in obj && obj.result != null) {
    return unwrapToolOutput(obj.result);
  }

  return output;
}

export function parseSearchResults(result: unknown): Product[] {
  const data = unwrapToolOutput(result);

  let rawArray: any[] = [];

  // If already structured data, use it directly
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const obj = data as Record<string, unknown>;
    if (Array.isArray(obj.products)) rawArray = obj.products;
    else if (Array.isArray(obj.items)) rawArray = obj.items;
    else if (Array.isArray(obj.results)) rawArray = obj.results;
    else if (Array.isArray(obj.data)) rawArray = obj.data;
  } else if (Array.isArray(data)) {
    rawArray = data;
  }

  if (rawArray.length > 0) {
    return rawArray.map(item => {
      // Handle the Kapruka JSON schema format
      const priceVal = typeof item.price === 'object' && item.price !== null ? item.price.amount : (item.price || 0);
      const currencyVal = typeof item.price === 'object' && item.price !== null ? item.price.currency : (item.currency || 'LKR');
      
      return {
        id: item.id || '',
        name: item.name || '',
        price: typeof priceVal === 'string' ? parseFloat(priceVal.replace(/,/g, '')) || 0 : priceVal,
        currency: currencyVal,
        imageUrl: item.image_url || item.imageUrl,
        inStock: item.in_stock !== undefined ? item.in_stock : (item.inStock !== undefined ? item.inStock : true),
        brand: item.brand,
        vendor: item.vendor || 'Kapruka',
        url: item.url || item.link
      };
    });
  }

  // The Kapruka MCP returns markdown-formatted results. Parse them.
  if (typeof data === 'string') {
    return parseMarkdownProducts(data);
  }

  return [];
}

function parseMarkdownProducts(markdown: string): Product[] {
  const products: Product[] = [];

  const productRegex = /\*\*\d+\.\s+(.+?)\*\*\s*\n\s*ID:\s*`([^`]+)`\s*·\s*(?:([A-Z]+)\s+)?([\d,]+(?:\.\d+)?)\s*·\s*(.*?)(?:\n\s*\[View product\]\(([^)]+)\))?/g;

  let match;
  while ((match = productRegex.exec(markdown)) !== null) {
    const [, name, id, currency = 'LKR', priceStr, stockInfo, url] = match;
    const price = parseFloat(priceStr.replace(/,/g, ''));
    const inStock = stockInfo ? stockInfo.toLowerCase().includes('in stock') : true;

    products.push({
      id,
      name: name.trim(),
      price,
      currency: currency || 'LKR',
      inStock,
      imageUrl: undefined,
      vendor: 'Kapruka',
      url
    });
  }

  return products;
}

export function parseProductDetail(result: unknown): ProductDetail | null {
  const data = unwrapToolOutput(result);
  if (!data || typeof data !== 'object') return null;
  return data as ProductDetail;
}

export function parseCategories(result: unknown): Category[] {
  const data = unwrapToolOutput(result);
  if (!data || typeof data !== 'object') return [];
  if (Array.isArray(data)) return data;
  const obj = data as Record<string, unknown>;
  if (Array.isArray(obj.categories)) return obj.categories;
  return [];
}

export function parseDeliveryCities(result: unknown): DeliveryCity[] {
  const data = unwrapToolOutput(result);
  if (!data || typeof data !== 'object') return [];
  if (Array.isArray(data)) return data;
  const obj = data as Record<string, unknown>;
  if (Array.isArray(obj.cities)) return obj.cities;
  return [];
}

export function parseDeliveryCheck(result: unknown): DeliveryInfo | null {
  const data = unwrapToolOutput(result);
  if (!data || typeof data !== 'object') return null;
  return data as DeliveryInfo;
}

export function parseOrderResult(result: unknown): OrderConfirmation | null {
  const data = unwrapToolOutput(result);
  if (!data || typeof data !== 'object') return null;
  return data as OrderConfirmation;
}

export function parseOrderTracking(result: unknown): OrderTracking | null {
  const data = unwrapToolOutput(result);
  if (!data || typeof data !== 'object') return null;
  return data as OrderTracking;
}
