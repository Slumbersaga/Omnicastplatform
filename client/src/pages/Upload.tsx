import { useState } from "react";
import UploadForm from "@/components/upload/UploadForm";
import UploadProgress from "@/components/upload/UploadProgress";

export default function Upload() {
  const [activeUploadId, setActiveUploadId] = useState<number | null>(null);

  const handleUploadStart = (uploadId: number) => {
    setActiveUploadId(uploadId);
  };

  const handleCancelUpload = () => {
    setActiveUploadId(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Upload Video</h1>
      
      {activeUploadId ? (
        <UploadProgress 
          uploadId={activeUploadId} 
          onCancel={handleCancelUpload} 
        />
      ) : (
        <UploadForm onUploadStart={handleUploadStart} />
      )}
    </div>
  );
}
