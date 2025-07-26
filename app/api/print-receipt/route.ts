import { NextRequest, NextResponse } from 'next/server';

interface ReceiptData {
  receiptNumber: string;
  date: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  customerName?: string;
  paymentMethod: string;
}

export async function POST(request: NextRequest) {
  try {
    const receiptData: ReceiptData = await request.json();
    
    // Validate receipt data
    if (!receiptData.receiptNumber || !receiptData.items || receiptData.items.length === 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid receipt data' 
      }, { status: 400 });
    }

    // For web applications, we'll return the receipt data
    // The actual printing will be handled by the client-side printer service
    console.log('Receipt print request:', receiptData.receiptNumber);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Receipt ready for printing',
      receiptData: receiptData
    });
    
  } catch (error) {
    console.error('Print API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to process print request' 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    message: 'Receipt printing API is available',
    endpoints: {
      POST: '/api/print-receipt - Print a receipt',
      GET: '/api/print-receipt - Get API status'
    }
  });
} 