import type { Product } from "@/data/products";

/**
 * Zellerfeld tarzı ürün plakası.
 * Gerçek ürün fotoğrafları hazır olana kadar görsel yerine kullanılır:
 * plaster kart üzerinde beyaz bir kaide, ortasında ürün adı.
 */
export function ProductPlate({
  product,
  ratio = "1 / 1",
}: {
  product: Product;
  ratio?: string;
}) {
  // Gerçek ürün görseli varsa onu göster
  if (product.gallery?.length) {
    return (
      <img
        src={product.gallery[0]}
        alt={product.name}
        loading="lazy"
        style={{
          aspectRatio: ratio,
          width: "100%",
          objectFit: "cover",
          borderRadius: "10px",
          display: "block",
        }}
      />
    );
  }

  const initial = product.name.replace(/[^A-Za-zÇĞİÖŞÜçğıöşü]/g, "").charAt(0).toLocaleUpperCase("tr");

  return (
    <div
      style={{
        aspectRatio: ratio,
        background: "#ffffff",
        borderRadius: "10px",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        textAlign: "center",
      }}
    >
      {/* Arka plandaki soluk monogram */}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "clamp(120px, 22vw, 200px)",
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: "#f2f3f4",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {initial}
      </span>

      {/* Ürün adı */}
      <p
        style={{
          position: "relative",
          zIndex: 1,
          fontSize: "18px",
          fontWeight: 600,
          letterSpacing: "-0.04em",
          lineHeight: 1.2,
          color: "#111111",
          maxWidth: "80%",
        }}
      >
        {product.name}
      </p>

      {/* Kategori */}
      <p
        className="text-brand-credit"
        style={{
          position: "relative",
          zIndex: 1,
          marginTop: "8px",
          textTransform: "uppercase",
          fontSize: "11px",
        }}
      >
        {product.categoryLabel}
      </p>
    </div>
  );
}
