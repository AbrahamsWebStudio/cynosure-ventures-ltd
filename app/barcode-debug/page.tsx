'use client';

import React, { useEffect, useState } from 'react';

export default function BarcodeDebugPage() {
  const [keyEvents, setKeyEvents] = useState<Array<{key: string, keyCode: number, timestamp: Date}>>([]);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      console.log('KeyDown Event:', {
        key: event.key,
        keyCode: event.keyCode,
        code: event.code,
        which: event.which,
        timestamp: new Date().toISOString()
      });

      setKeyEvents(prev => [...prev.slice(-9), {
        key: event.key,
        keyCode: event.keyCode,
        timestamp: new Date()
      }]);
    };

    const handleKeyPress = (event: KeyboardEvent) => {
      console.log('KeyPress Event:', {
        key: event.key,
        keyCode: event.keyCode,
        code: event.code,
        which: event.which,
        timestamp: new Date().toISOString()
      });
    };

    if (isListening) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keypress', handleKeyPress);
      
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keypress', handleKeyPress);
      };
    }
  }, [isListening]);

  const clearEvents = () => {
    setKeyEvents([]);
  };

  const openConsole = () => {
    if (typeof window !== 'undefined') {
      window.open('', '_blank')?.document.write(`
        <html>
          <head><title>Console</title></head>
          <body>
            <h1>Barcode Scanner Debug Console</h1>
            <p>Open browser developer tools (F12) to see console logs</p>
            <script>
              console.log('Debug console ready');
              console.log('Connect your barcode scanner and scan a barcode');
              console.log('You should see key events logged here');
            </script>
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Barcode Scanner Debug</h1>
            <p className="text-gray-600">Debug your barcode scanner key events</p>
          </div>

          {/* Controls */}
          <div className="mb-6 flex gap-4 justify-center">
            <button
              onClick={() => setIsListening(!isListening)}
              className={`px-4 py-2 rounded-lg transition ${
                isListening 
                  ? 'bg-red-600 text-white hover:bg-red-700' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {isListening ? 'Stop Listening' : 'Start Listening'}
            </button>
            
            <button
              onClick={clearEvents}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Clear Events
            </button>

            <button
              onClick={openConsole}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Open Console
            </button>
          </div>

          {/* Status */}
          <div className={`mb-6 p-4 rounded-lg border ${
            isListening 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <p className={`font-medium ${
              isListening ? 'text-green-700' : 'text-red-700'
            }`}>
              Status: {isListening ? 'Listening for key events' : 'Not listening'}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {isListening 
                ? 'Connect your barcode scanner and scan a barcode to see events below'
                : 'Click "Start Listening" to begin debugging'
              }
            </p>
          </div>

          {/* Key Events */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Recent Key Events</h3>
            {keyEvents.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No key events detected</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {keyEvents.map((event, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-sm">
                        Key: &quot;{event.key}&quot; (Code: {event.keyCode})
                      </span>
                      <span className="text-xs text-gray-500">
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Debug Instructions</h3>
            <ol className="text-blue-700 text-sm space-y-1">
              <li>1. Click "Start Listening" above</li>
              <li>2. Connect your Syble barcode scanner</li>
              <li>3. Point scanner at any barcode and scan</li>
              <li>4. Watch the &quot;Recent Key Events&quot; section</li>
              <li>5. Open browser console (F12) for detailed logs</li>
              <li>6. Look for patterns in the key events</li>
              <li>7. A successful scan should show multiple key events ending with Enter</li>
            </ol>
          </div>

          {/* Expected Behavior */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2">Expected Behavior</h3>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• Barcode scanner should send characters rapidly</li>
              <li>• Each character should appear as a separate key event</li>
              <li>• Scan should end with an Enter key event</li>
              <li>• Example: &quot;1234567890123&quot; + Enter</li>
              <li>• If you see random characters, scanner may need configuration</li>
              <li>• If no events appear, check USB connection and scanner mode</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 