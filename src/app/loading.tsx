import { WolfLoader } from "@/components/brand/WolfLoader";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505]">
      <WolfLoader state="loading" size={100} />
    </div>
  );
}
