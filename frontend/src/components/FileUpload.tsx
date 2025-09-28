import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

interface FileWithText extends File {
  extractedText?: string;
}

interface Preview {
  name: string;
  size: string;
  type: string;
  content: string;
}

interface FileUploadProps {
  onFileSelect: (file: FileWithText) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [preview, setPreview] = useState<Preview | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const isValidMarkdown = (content: string): boolean => {
    return content.trim().startsWith('#') || content.includes('##') || content.includes('') || content.includes('>') || content.length > 10;
  };

  const extractTextFromPDF = (pdfFile: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        try {
          if (!e.target?.result) {
            reject(new Error('No se pudo leer el archivo'));
            return;
          }
          const typedarray = new Uint8Array(e.target.result as ArrayBuffer);
          const loadingTask = pdfjsLib.getDocument(typedarray);
          const pdf = await loadingTask.promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n\n';
          }
          resolve(fullText.trim());
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsArrayBuffer(pdfFile);
    });
  };

  const validateFile = (selectedFile: File): Promise<{ valid: boolean; error?: string; text?: string }> => {
    const allowedExt = ['.pdf', '.md'];
    const ext = selectedFile.name.toLowerCase().slice(selectedFile.name.lastIndexOf('.'));
    if (!allowedExt.includes(ext)) {
      return Promise.resolve({ valid: false, error: '¡Solo PDF o Markdown, por favor! No acepto sorpresas.' });
    }

    return new Promise(async (resolve) => {
      const reader = new FileReader();
      reader.onload = async (e: ProgressEvent<FileReader>) => {
        let content = e.target?.result;
        if (ext === '.md') {
          if (typeof content === 'string' && !isValidMarkdown(content)) {
            resolve({ valid: false, error: 'Esto no parece Markdown válido. Intenta con uno real.' });
          } else if (typeof content === 'string') {
            resolve({ valid: true, text: content });
          } else {
            resolve({ valid: false, error: 'Error al leer el contenido Markdown.' });
          }
        } else {
          // For PDF
          try {
            const text = await extractTextFromPDF(selectedFile);
            if (text && text.length > 0) {
              resolve({ valid: true, text });
            } else {
              resolve({ valid: false, error: 'El PDF parece vacío o imposible de leer. ¿Está corrupto?' });
            }
          } catch (err) {
            console.error('PDF Parse Error:', err);
            resolve({ valid: false, error: 'Error al procesar el PDF. Asegúrate de que sea válido y no esté protegido.' });
          }
        }
      };
      reader.onerror = () => resolve({ valid: false, error: 'Error al leer el archivo.' });
      
      if (ext === '.md') {
        reader.readAsText(selectedFile);
      } else {
        reader.readAsArrayBuffer(selectedFile);
      }
    });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setError('');
      const validation = await validateFile(selectedFile);
      if (validation.valid) {
        setFile(selectedFile);
        setError('');
        let textPreview = 'Contenido no disponible para vista previa.';
        if (validation.text && typeof validation.text === 'string') {
          textPreview = validation.text.substring(0, 200).replace(/\n/g, ' ') + (validation.text.length > 200 ? '...' : '');
        }
        setPreview({
          name: selectedFile.name,
          size: (selectedFile.size / 1024).toFixed(2) + ' KB',
          type: selectedFile.name.endsWith('.md') ? 'Markdown' : 'PDF',
          content: textPreview
        });
        const fileData: FileWithText = Object.create(selectedFile);
        if (validation.text && typeof validation.text === 'string') {
          fileData.extractedText = validation.text;
        }
        onFileSelect(fileData);
      } else {
        setError(validation.error || '');
        setPreview(null);
        setFile(null);
      }
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const dropFile = e.dataTransfer.files[0];
      const fileEvent = { target: { files: [dropFile] } } as React.ChangeEvent<HTMLInputElement>;
      handleFile(fileEvent);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 flex-1 flex flex-col justify-center ${
          dragActive ? 'dark:border-sunglo-400 border-sunglo-400 dark:bg-sunglo-900/50 bg-sunglo-50' : 'dark:border-sunglo-700 border-sunglo-300 dark:bg-sunglo-800/50 bg-sunglo-100/50'
        } shadow-md hover:shadow-lg`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept=".pdf,.md"
          onChange={handleFile}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center gap-2 dark:text-sunglo-200 text-sunglo-700 hover:dark:text-sunglo-300 hover:text-sunglo-500"
        >
          <div className="w-12 h-12 mx-auto dark:bg-sunglo-700 bg-sunglo-200 rounded-full flex items-center justify-center mb-2">
            📁
          </div>
          <p className="font-medium">Arrastra o elige un archivo</p>
          <p className="text-sm dark:text-sunglo-400 text-sunglo-600">Solo PDF y Markdown 😏</p>
        </label>
      </div>
      {error && (
        <p className="p-3 dark:bg-sunglo-900/50 bg-sunglo-100 border dark:border-sunglo-700 border-sunglo-300 rounded-lg dark:text-sunglo-300 text-sunglo-700 text-sm font-medium">
          {error}
        </p>
      )}
      {preview && (
        <div className="p-4 dark:bg-sunglo-900/50 bg-sunglo-50 border dark:border-sunglo-700 border-sunglo-200 rounded-xl shadow-sm max-h-[300px] overflow-y-auto">
          <h3 className="font-semibold dark:text-sunglo-200 text-sunglo-800 mb-2">Vista Previa</h3>
          <p className="text-sm dark:text-sunglo-300 text-sunglo-700"><strong>Archivo:</strong> {preview.name}</p>
          <p className="text-sm dark:text-sunglo-300 text-sunglo-700"><strong>Tamaño:</strong> {preview.size}</p>
          <p className="text-sm dark:text-sunglo-300 text-sunglo-700 mb-3"><strong>Tipo:</strong> {preview.type}</p>
          <p className="text-xs dark:text-sunglo-400 text-sunglo-600 bg-sunglo-100 dark:bg-sunglo-800 p-2 rounded whitespace-pre-wrap overflow-hidden">
            {preview.content}
          </p>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
