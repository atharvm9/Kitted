export default function SearchPage() {
  return (
    <iframe
      src="/stitch/search.html"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        border: "none",
        display: "block",
      }}
      title="Part Search"
    />
  );
}
