export type BuildCardProps = {
  title: string;
  price: string;
  status: "GOOD" | "BETTER" | "ULTIMATE";
  gpu: string;
  imageUrl: string;
  href: string;
  processorWidth: string;
  graphicsWidth: string;
  memoryWidth: string;
  storageWidth: string;
}

export type ProductCardProps = {
  category: string;
  name: string;
  price: number;
  imageUrl: string;
  hasVR?: boolean;
}
