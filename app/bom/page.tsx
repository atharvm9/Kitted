"use client";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function BomDetailFrame() {
  const params = useSearchParams();
  const id = params.get("id") || "mctrl";
  return (
    <iframe
      src={`/stitch/bom-detail.html?id=${id}`}
      style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", border: "none", display: "block" }}
      title="BOM Detail"
    />
  );
}

export default function BomDetailPage() {
  return (
    <Suspense>
      <BomDetailFrame />
    </Suspense>
  );
}
