// lib/printerService.js
// XPrinter integration using ESC/POS commands

class PrinterService {
  constructor() {
    this.isConnected = false;
    this.device = null;
    this.printer = null;
  }

  async connect() {
    try {
      // For web applications, we'll use browser print API
      // In a Node.js environment, you would use escpos library
      this.isConnected = true;
      console.log('Printer service initialized');
    } catch (error) {
      console.error('Printer connection error:', error);
      throw error;
    }
  }

  async printReceipt(receiptData) {
    try {
      // Generate ESC/POS formatted receipt
      const receiptText = this.generateEscPosReceipt(receiptData);
      
      // For web applications, use browser print
      await this.printToBrowser(receiptText);
      
      // Log receipt for tracking
      console.log('Receipt printed:', receiptData.receiptNumber);
      
      return { success: true, message: 'Receipt printed successfully' };
    } catch (error) {
      console.error('Print error:', error);
      throw error;
    }
  }

  generateEscPosReceipt(receiptData) {
    const width = 48; // 80mm paper width in characters
    const center = (text) => {
      const padding = Math.max(0, Math.floor((width - text.length) / 2));
      return ' '.repeat(padding) + text;
    };

    let receipt = '';
    
    // Initialize printer
    receipt += '\x1B\x40'; // ESC @ - Initialize printer
    
    // Header
    receipt += '\x1B\x61\x01'; // ESC a 1 - Center alignment
    receipt += '\x1B\x45\x01'; // ESC E 1 - Bold on
    receipt += '\x1B\x21\x10'; // ESC ! 16 - Font size
    receipt += 'CYNOSURE VENTURES LTD\n';
    receipt += '========================\n';
    receipt += 'RECEIPT\n';
    receipt += '========================\n\n';
    
    // Receipt details
    receipt += '\x1B\x61\x00'; // ESC a 0 - Left alignment
    receipt += '\x1B\x45\x00'; // ESC E 0 - Bold off
    receipt += `Receipt No: ${receiptData.receiptNumber}\n`;
    receipt += `Date: ${receiptData.date}\n`;
    if (receiptData.customerName) {
      receipt += `Customer: ${receiptData.customerName}\n`;
    }
    receipt += '\n';
    
    // Items
    receipt += 'ITEMS:\n';
    receipt += '-'.repeat(width) + '\n';
    
    receiptData.items.forEach(item => {
      receipt += `${item.name}\n`;
      receipt += `  ${item.quantity} x ${item.price.toFixed(2)} = ${item.total.toFixed(2)}\n`;
    });
    
    receipt += '-'.repeat(width) + '\n';
    
    // Totals
    receipt += `Subtotal: ${receiptData.subtotal.toFixed(2)}\n`;
    receipt += `Tax: ${receiptData.tax.toFixed(2)}\n`;
    receipt += '\x1B\x45\x01'; // Bold on
    receipt += `TOTAL: ${receiptData.total.toFixed(2)}\n`;
    receipt += '\x1B\x45\x00'; // Bold off
    receipt += '\n';
    
    // Payment method
    receipt += `Payment: ${receiptData.paymentMethod}\n\n`;
    
    // Footer
    receipt += '\x1B\x61\x01'; // Center alignment
    receipt += 'Thank you for your business!\n';
    receipt += 'Visit us again\n';
    receipt += 'www.cynosureventures.com\n';
    
    // Feed and cut paper
    receipt += '\x0A\x0A\x0A'; // Feed paper
    receipt += '\x1D\x56\x00'; // GS V 0 - Cut paper
    
    return receipt;
  }

  async printToBrowser(receiptText) {
    return new Promise((resolve, reject) => {
      try {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
          throw new Error('Popup blocked. Please allow popups for printing.');
        }

        // Format receipt for browser printing
        const formattedReceipt = this.formatForBrowser(receiptText);
        
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt</title>
              <style>
                body {
                  font-family: 'Courier New', monospace;
                  font-size: 12px;
                  line-height: 1.2;
                  margin: 0;
                  padding: 10px;
                  width: 80mm;
                  max-width: 80mm;
                }
                .receipt {
                  white-space: pre-wrap;
                  word-wrap: break-word;
                }
                @media print {
                  body { margin: 0; }
                  .receipt { font-size: 10px; }
                }
              </style>
            </head>
            <body>
              <div class="receipt">${formattedReceipt}</div>
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() {
                    window.close();
                  }, 1000);
                };
              </script>
            </body>
          </html>
        `);
        
        printWindow.document.close();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  formatForBrowser(escPosText) {
    // Convert ESC/POS commands to HTML
    let html = escPosText
      .replace(/\x1B\x40/g, '') // Remove initialize
      .replace(/\x1B\x61\x01/g, '<div style="text-align: center;">') // Center alignment
      .replace(/\x1B\x61\x00/g, '<div style="text-align: left;">') // Left alignment
      .replace(/\x1B\x45\x01/g, '<strong>') // Bold on
      .replace(/\x1B\x45\x00/g, '</strong>') // Bold off
      .replace(/\x1B\x21\x10/g, '<span style="font-size: 14px;">') // Font size
      .replace(/\x0A/g, '<br>') // Line breaks
      .replace(/\x1D\x56\x00/g, '') // Remove cut command
      .replace(/\x1B\x21\x00/g, '</span>'); // Reset font size
    
    // Close any open tags
    html = html.replace(/<div/g, '</div><div');
    html = html.replace(/<strong/g, '</strong><strong');
    html = html.replace(/<span/g, '</span><span');
    
    return html;
  }

  async downloadReceipt(receiptData) {
    try {
      const receiptText = this.generateEscPosReceipt(receiptData);
      const blob = new Blob([receiptText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `receipt_${receiptData.receiptNumber}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      return { success: true, message: 'Receipt downloaded successfully' };
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  }

  getPrinterStatus() {
    return {
      connected: this.isConnected,
      device: this.device ? 'XPrinter' : 'Browser Print',
      status: this.isConnected ? 'Ready' : 'Not Connected'
    };
  }

  disconnect() {
    this.isConnected = false;
    this.device = null;
    this.printer = null;
    console.log('Printer disconnected');
  }
}

// Export for Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PrinterService;
}

// Export for browser environment
if (typeof window !== 'undefined') {
  window.PrinterService = PrinterService;
} 