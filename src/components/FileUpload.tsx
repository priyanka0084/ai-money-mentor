import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, X, CheckCircle2 } from "lucide-react";

interface FileUploadProps {
  onFileContent: (text: string, fileName: string) => void;
  isProcessing: boolean;
}

const FileUpload = ({ onFileContent, isProcessing }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFile = useCallback(async (f: File) => {
    setFile({ name: f.name, size: f.size });
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + 15, 90));
    }, 200);

    try {
      if (f.type === "application/pdf") {
  const arrayBuffer = await f.arrayBuffer();
  const pdfjsLib = await import("pdfjs-dist");
  
  // Use unpkg instead of cdnjs - it's more reliable
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`;
  
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(" ") + "\n";
  }
  clearInterval(progressInterval);
  setProgress(100);
  onFileContent(text, f.name);
}else {
        const text = await f.text();
        clearInterval(progressInterval);
        setProgress(100);
        onFileContent(text, f.name);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      setFile(null);
      console.error("File parsing error:", err);
    }
  }, [onFileContent]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  }, [handleFile]);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!file ? (
          <motion.label
            key="dropzone"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center gap-3 p-8 cursor-pointer transition-all rounded-2xl border-2 border-dashed ${
              dragActive ? "border-primary bg-primary/5" : "border-primary/30 bg-primary/[0.02] hover:border-primary/50 hover:bg-primary/5"
            }`}
          >
            <motion.div animate={dragActive ? { scale: 1.1 } : { scale: 1 }}>
              <div className="p-3 rounded-xl bg-primary/10">
                <Upload className="w-6 h-6 text-primary" />
              </div>
            </motion.div>
            <div className="text-center">
              <p className="font-medium text-foreground">Drop your financial document here</p>
              <p className="text-sm text-muted-foreground mt-1">PDF, TXT, CSV supported</p>
            </div>
            <input type="file" className="hidden" accept=".pdf,.txt,.csv" onChange={handleInput} />
          </motion.label>
        ) : (
          <motion.div
            key="filecard"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/10">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              {progress === 100 && !isProcessing ? (
                <CheckCircle2 className="w-5 h-5 text-score-excellent" />
              ) : (
                <button onClick={() => { setFile(null); setProgress(0); }}>
                  <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
                </button>
              )}
            </div>
            {progress < 100 && (
              <div className="mt-3 h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
            {isProcessing && (
              <motion.p
                className="text-xs text-primary mt-2"
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                🧠 AI is analyzing your document...
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUpload;
