import React, { useRef, useEffect, useState } from 'react';
import Button from './ui/Button';

interface SignatureCanvasProps {
  onApply: (dataUrl: string) => void;
  onClose: () => void;
}

// Define a Point type for clarity
type Point = { x: number; y: number };

const SignatureCanvas: React.FC<SignatureCanvasProps> = ({ onApply, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null); // Ref for the direct parent of canvas

  const [isDrawing, setIsDrawing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Store strokes as an array of paths, where each path is an array of points
  const [strokes, setStrokes] = useState<Point[][]>([]);
  const currentPath = useRef<Point[]>([]);
  const lastDimensions = useRef<{ width: number; height: number }>({ width: 0, height: 0 });

  // Lock/unlock orientation on mobile
  useEffect(() => {
    if (!/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
      return;
    }

    const orientation = screen.orientation as any;

    if (orientation && orientation.lock) {
      const lockOrientation = async () => {
        try {
          await orientation.lock('landscape');
        } catch (err) {
          console.warn('Could not lock screen orientation:', err);
        }
      };

      lockOrientation();

      return () => {
        if (orientation && orientation.unlock) {
          orientation.unlock();
        }
      };
    }
  }, []);

  // Helper to get correct coordinates for mouse and touch events
  const getPos = (canvas: HTMLCanvasElement, e: MouseEvent | TouchEvent): Point => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e instanceof MouseEvent) {
      return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
    }
    // Touch event
    return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
  };

  // Redraws the entire canvas from the strokes data.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.width || !canvas.height) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    context.clearRect(0, 0, canvas.width, canvas.height);

    context.strokeStyle = '#000000';
    context.lineWidth = 2;
    context.lineCap = 'round';
    context.lineJoin = 'round';

    strokes.forEach(path => {
      if (path.length < 2) return;
      context.beginPath();
      context.moveTo(path[0].x, path[0].y);
      for (let i = 1; i < path.length; i++) {
        context.lineTo(path[i].x, path[i].y);
      }
      context.stroke();
    });
  }, [strokes]);

  // Handles resizing the canvas and scaling the existing drawing.
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resizeCanvas = () => {
      const { width: oldWidth, height: oldHeight } = lastDimensions.current;

      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      if (oldWidth === newWidth && oldHeight === newHeight) return;

      if (oldWidth > 0 && oldHeight > 0) {
        const scaleX = newWidth / oldWidth;
        const scaleY = newHeight / oldHeight;

        setStrokes(prevStrokes =>
          prevStrokes.map(path =>
            path.map(point => ({
              x: point.x * scaleX,
              y: point.y * scaleY,
            }))
          )
        );
      }

      canvas.width = newWidth;
      canvas.height = newHeight;
      lastDimensions.current = { width: newWidth, height: newHeight };
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);

    return () => resizeObserver.disconnect();
  }, []);

  // Drawing event handlers
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const startDrawing = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      context.beginPath();
      const pos = getPos(canvas, e);
      context.moveTo(pos.x, pos.y);
      currentPath.current = [pos];
      setIsDrawing(true);
      setError(null);
    };

    const draw = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      if (!isDrawing) return;
      const pos = getPos(canvas, e);
      context.lineTo(pos.x, pos.y);
      context.stroke();
      currentPath.current.push(pos);
    };

    const stopDrawing = () => {
      if (isDrawing && currentPath.current.length > 1) { // Only save if more than a dot
        setStrokes(prev => [...prev, currentPath.current]);
      }
      setIsDrawing(false);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseleave', stopDrawing);
    canvas.addEventListener('touchstart', startDrawing, { passive: false });
    canvas.addEventListener('touchmove', draw, { passive: false });
    canvas.addEventListener('touchend', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseleave', stopDrawing);
      canvas.removeEventListener('touchstart', startDrawing);
      canvas.removeEventListener('touchmove', draw);
      canvas.removeEventListener('touchend', stopDrawing);
    };
  }, [isDrawing]);

  const clearCanvas = () => {
    setStrokes([]);
    setError(null);
  };

  const handleApply = () => {
    if (strokes.length === 0) {
      setError("Please draw your signature before applying.");
      return;
    }

    const canvas = canvasRef.current;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      try {
        localStorage.setItem('slp-saved-signature', dataUrl);
      } catch (error) {
        console.error("Could not save signature to localStorage:", error);
      }
      onApply(dataUrl);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-signature p-safe">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full h-auto max-w-4xl max-h-screen-dvh md:max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header - Minimal on mobile */}
        <div className="flex items-center justify-between p-3 md:p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h2 className="text-lg md:text-xl font-bold dark:text-white">Draw Your Signature</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Close"
          >
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Canvas Area - Flexible height */}
        <div className="flex-grow p-3 md:p-6 overflow-hidden">
          <div
            ref={containerRef}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg w-full h-full bg-white relative"
            style={{ minHeight: '200px' }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{
                touchAction: 'none',
                WebkitTouchCallout: 'none',
                WebkitUserSelect: 'none',
                userSelect: 'none',
              }}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-3 md:px-6 pb-2">
            <p className="text-red-500 text-sm text-center bg-red-50 dark:bg-red-900/20 p-2 rounded">
              {error}
            </p>
          </div>
        )}

        {/* Actions - Fixed at bottom with safe-area */}
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 p-3 md:p-6 pb-safe bg-gray-50 dark:bg-gray-900">
          <div className="flex justify-between items-center gap-2">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                onClick={onClose}
                className="text-sm md:text-base px-3 md:px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                onClick={clearCanvas}
                className="text-sm md:text-base px-3 md:px-4 py-2"
              >
                Clear
              </Button>
            </div>
            <Button
              onClick={handleApply}
              className="text-sm md:text-base px-4 md:px-6 py-2 shadow-lg"
            >
              Apply Signature
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignatureCanvas;