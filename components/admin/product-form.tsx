"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImagePlus, Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { categories } from "@/lib/site-config";
import { cn, slugify } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { saveProduct, type ProductInput } from "@/app/admin/actions";

export interface ProductFormInitial {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  category: string;
  subcategory: string | null;
  images: string[];
  sizes: string[];
  fabric: string;
  care: string | null;
  stock: number;
  isNew: boolean;
}

const labelCls = "mb-1.5 block text-sm font-medium text-wine";
const fieldCls =
  "w-full rounded-2xl border border-flamingo-tint bg-white px-4 py-3 text-sm focus:border-flamingo-deep focus:outline-none";

export function ProductForm({ initial }: { initial?: ProductFormInitial }) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const editing = Boolean(initial);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(editing);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [compareAt, setCompareAt] = useState(
    initial?.compareAtPrice ? String(initial.compareAtPrice) : ""
  );
  const [category, setCategory] = useState(initial?.category ?? categories[0].slug);
  const [subcategory, setSubcategory] = useState(initial?.subcategory ?? "");
  const [sizes, setSizes] = useState((initial?.sizes ?? []).join(", "));
  const [fabric, setFabric] = useState(initial?.fabric ?? "");
  const [care, setCare] = useState(initial?.care ?? "");
  const [stock, setStock] = useState(initial ? String(initial.stock) : "0");
  const [isNew, setIsNew] = useState(initial?.isNew ?? false);
  const [images, setImages] = useState<string[]>(initial?.images ?? []);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const subOptions = categories.find((c) => c.slug === category)?.subcategories ?? [];

  const onNameChange = (v: string) => {
    setName(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const uploadFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${slug || slugify(name) || "product"}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("product-images")
        .upload(path, file, { upsert: false, contentType: file.type });
      if (upErr) {
        setError(`Image upload failed: ${upErr.message}`);
        continue;
      }
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setImages((imgs) => [...imgs, data.publicUrl]);
    }
    setUploading(false);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const priceNum = Number(price);
    if (!name.trim()) return setError("Please enter a product name.");
    if (!slug.trim()) return setError("Please enter a slug.");
    if (!priceNum || priceNum <= 0) return setError("Please enter a valid price.");

    const input: ProductInput = {
      name: name.trim(),
      slug: slug.trim(),
      description: description.trim(),
      price: Math.round(priceNum),
      compareAtPrice: compareAt ? Math.round(Number(compareAt)) : null,
      category,
      subcategory: subcategory || null,
      images,
      sizes: sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      fabric: fabric.trim(),
      care: care.trim() || null,
      stock: Math.max(0, Math.round(Number(stock) || 0)),
      isNew,
    };

    setSaving(true);
    const res = await saveProduct(initial?.id ?? null, input);
    setSaving(false);
    if ("error" in res) return setError(res.error);
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={submit} className="max-w-2xl space-y-6">
      <div>
        <label className={labelCls}>Product name</label>
        <Input value={name} onChange={(e) => onNameChange(e.target.value)} placeholder="e.g. Gulbagh Block-Print Bedsheet" />
      </div>

      <div>
        <label className={labelCls}>Slug (URL)</label>
        <Input
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          placeholder="gulbagh-block-print-bedsheet"
        />
        <p className="mt-1 text-xs text-ink/45">/product/{slug || "…"}</p>
      </div>

      <div>
        <label className={labelCls}>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className={cn(fieldCls, "resize-y")}
          placeholder="A short, lovely description…"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelCls}>Price (₹)</label>
          <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="1899" />
        </div>
        <div>
          <label className={labelCls}>Compare-at price (₹, optional)</label>
          <Input type="number" value={compareAt} onChange={(e) => setCompareAt(e.target.value)} placeholder="2299" />
        </div>
        <div>
          <label className={labelCls}>Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSubcategory("");
            }}
            className={fieldCls}
          >
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Subcategory (optional)</label>
          <select
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            className={fieldCls}
            disabled={subOptions.length === 0}
          >
            <option value="">None</option>
            {subOptions.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Sizes (comma-separated)</label>
          <Input value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="S, M, L, XL" />
        </div>
        <div>
          <label className={labelCls}>Stock</label>
          <Input type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="20" />
        </div>
        <div>
          <label className={labelCls}>Fabric</label>
          <Input value={fabric} onChange={(e) => setFabric(e.target.value)} placeholder="100% cotton" />
        </div>
        <div>
          <label className={labelCls}>Care (optional)</label>
          <Input value={care} onChange={(e) => setCare(e.target.value)} placeholder="Gentle wash, line dry" />
        </div>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={isNew}
          onChange={(e) => setIsNew(e.target.checked)}
          className="h-4 w-4 accent-flamingo-deep"
        />
        <span className="text-sm font-medium text-wine">
          Mark as “New” (shows the New badge)
        </span>
      </label>

      {/* Images */}
      <div>
        <label className={labelCls}>Photos</label>
        <div className="flex flex-wrap gap-3">
          {images.map((url) => (
            <div key={url} className="relative h-24 w-20 overflow-hidden rounded-xl bg-cream">
              <Image src={url} alt="" fill sizes="80px" className="object-cover" />
              <button
                type="button"
                onClick={() => setImages((imgs) => imgs.filter((u) => u !== url))}
                aria-label="Remove photo"
                className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-wine/80 text-white"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <label className="grid h-24 w-20 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-flamingo-tint text-flamingo-deep transition-colors hover:border-flamingo-deep">
            {uploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ImagePlus className="h-5 w-5" />
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => uploadFiles(e.target.files)}
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-ink/45">
          The first photo is the main image. Drag isn&apos;t needed — just click +.
        </p>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button type="submit" size="lg" disabled={saving || uploading}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {editing ? "Save changes" : "Create product"}
        </Button>
        <Button type="button" size="lg" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
