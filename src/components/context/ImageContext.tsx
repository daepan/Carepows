// contexts/ImageContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

interface SelectedImage {
  preview: string;
  file: File;
}

interface ImageContextType {
  selectedImage: SelectedImage | null;
  setSelectedImage: React.Dispatch<React.SetStateAction<SelectedImage | null>>;
}

const ImageContext = createContext<ImageContextType | undefined>(undefined);

export const ImageProvider = ({ children }: { children: ReactNode }) => {
  const [selectedImage, setSelectedImage] = useState<SelectedImage | null>(
    null
  );

  return (
    <ImageContext.Provider value={{ selectedImage, setSelectedImage }}>
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
