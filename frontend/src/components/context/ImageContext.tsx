// contexts/ImageContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SelectedImage {
  preview: string;
  file: File;
}

interface DiseaseInfo {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
  confidence: number;
  class: number;
  name: string;
}

interface ImageContextType {
  selectedImage: SelectedImage | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<SelectedImage | null>>;
  diseaseInfo: DiseaseInfo[] | null;
  setDiseaseInfo: React.Dispatch<React.SetStateAction<DiseaseInfo[] | null>>;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );
  const [diseaseInfo, setDiseaseInfo] = useState<DiseaseInfo[] | null>(null);

  return (
    <ImageContext.Provider value={{ selectedImage, setSelectedImage, diseaseInfo, setDiseaseInfo }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error("useImage must be used within a ImageProvider");
  }
  return context;
};
