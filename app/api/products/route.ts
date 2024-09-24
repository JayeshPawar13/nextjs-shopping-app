import { NextRequest } from 'next/server';

import { getApiUtil } from '@/lib/apiUtils';

export async function GET(request: NextRequest) {
  return getApiUtil(request, 'products');
}
