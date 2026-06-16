declare module "*.png" {
  const image: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };
  export default image;
}

declare module "*.jpg" {
  const image: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };
  export default image;
}

declare module "*.webp" {
  const image: {
    src: string;
    height: number;
    width: number;
    blurDataURL?: string;
  };
  export default image;
}
