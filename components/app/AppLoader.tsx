import Image from "next/image";

export default function AppLoader() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      {/* 
        Wrap the <Image> in a fixed-size, relative container so that
        our shimmer overlay (absolutely positioned) has the same dimensions. 
      */}
      <div className="relative w-[100px] h-[100px]">
        <Image src="/ptw.png" alt="PTW Logo" width={100} height={100} />
        {/* 
          This is the shimmer “stripe” that will slide across the PNG.
          We use absolute inset-0 so it sits exactly over the image. 
        */}
        <div className="absolute inset-0 shimmer-overlay pointer-events-none" />
      </div>
    </div>
  );
}
