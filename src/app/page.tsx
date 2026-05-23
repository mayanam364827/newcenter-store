'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

interface Series {
  id: number;
  key: string;
  name: string;
  order: number;
}

interface Model {
  id: number;
  seriesId: number;
  name: string;
  price: number;
  storages: string[];
  colors: string[];
  status: string;
  note: string;
  imageUrl: string;
}

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + '₫';
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'in_stock') {
    return (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        Còn hàng
      </span>
    );
  }
  if (status === 'out_of_stock') {
    return (
      <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        Hết hàng
      </span>
    );
  }
  return (
    <span className="inline-block px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
      Đặt trước
    </span>
  );
}

export default function HomePage() {
  const [series, setSeries] = useState<Series[]>([]);
  const [selectedSeries, setSelectedSeries] = useState<Series | null>(null);
  const [models, setModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<Model | null>(null);
  const [loadingSeries, setLoadingSeries] = useState(true);
  const [loadingModels, setLoadingModels] = useState(false);
  const modelsRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/series')
      .then((r) => r.json())
      .then((data) => setSeries(data.series ?? []))
      .catch(console.error)
      .finally(() => setLoadingSeries(false));
  }, []);

  async function handleSelectSeries(s: Series) {
    setSelectedSeries(s);
    setSelectedModel(null);
    setLoadingModels(true);
    try {
      const res = await fetch(`/api/series/${s.key}/models`);
      const data = await res.json();
      setModels(data.models ?? []);
    } catch (e) {
      console.error(e);
      setModels([]);
    } finally {
      setLoadingModels(false);
      setTimeout(() => modelsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    }
  }

  function handleSelectModel(m: Model) {
    setSelectedModel(m);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  }

  return (
    <div className="min-h-screen bg-white text-dark">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-dark shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2">
            <span className="text-primary font-black text-xl tracking-tight">NEWCENTER</span>
            <span className="text-white font-light text-xl">.STORE</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#hero" className="text-gray-300 hover:text-primary transition-colors">Trang chủ</a>
            <a href="#series" className="text-gray-300 hover:text-primary transition-colors">Sản phẩm</a>
            <a href="#contact" className="text-gray-300 hover:text-primary transition-colors">Liên hệ</a>
            <a href="#address" className="text-gray-300 hover:text-primary transition-colors">Địa chỉ</a>
          </nav>
          <a
            href="tel:0826000291"
            className="bg-primary text-dark font-bold text-sm px-4 py-2 rounded-full hover:bg-primary-dark transition-colors"
          >
            📞 Gọi ngay
          </a>
        </div>
      </header>

      {/* Hero */}
      <section id="hero" className="bg-dark text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-primary font-semibold uppercase tracking-widest text-sm mb-3">
            Chuyên mua bán iPhone chính hãng
          </p>
          <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4">
            Mua Bán iPhone
            <br />
            <span className="text-primary">Chính Hãng Giá Tốt</span>
          </h1>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Cam kết hàng chính hãng, giá cạnh tranh nhất thị trường. Bảo hành rõ ràng, hỗ trợ
            tận tâm.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://zalo.me/0826000291"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-dark font-bold px-8 py-3 rounded-full hover:bg-primary-dark transition-colors text-lg"
            >
              💬 Chat Zalo ngay
            </a>
            <a
              href="#series"
              className="border border-primary text-primary font-bold px-8 py-3 rounded-full hover:bg-primary hover:text-dark transition-colors text-lg"
            >
              Xem sản phẩm ↓
            </a>
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <span className="text-primary text-2xl">✓</span> Hàng chính hãng
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary text-2xl">✓</span> Giá tốt nhất
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary text-2xl">✓</span> Bảo hành uy tín
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary text-2xl">✓</span> Hỗ trợ 24/7
            </div>
          </div>
        </div>
      </section>

      {/* Series picker */}
      <section id="series" className="py-14 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black text-dark mb-2 text-center">Chọn dòng iPhone</h2>
          <p className="text-gray-500 text-center mb-8">Chọn dòng máy bạn quan tâm để xem các mẫu có sẵn</p>
          {loadingSeries ? (
            <div className="flex justify-center py-8">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {series.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleSelectSeries(s)}
                  className={`py-3 px-2 rounded-xl font-semibold text-sm border-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-primary ${
                    selectedSeries?.id === s.id
                      ? 'bg-primary border-primary text-dark shadow-lg scale-105'
                      : 'bg-white border-gray-200 text-dark hover:border-primary hover:bg-yellow-50'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Models list */}
      {selectedSeries && (
        <section ref={modelsRef} className="py-10 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-black text-dark mb-6">
              📱 Các mẫu{' '}
              <span className="text-primary">{selectedSeries.name}</span>
            </h2>
            {loadingModels ? (
              <div className="flex justify-center py-8">
                <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : models.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Chưa có sản phẩm nào trong dòng này.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {models.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleSelectModel(m)}
                    className={`text-left bg-white rounded-2xl border-2 p-4 transition-all duration-150 hover:shadow-lg hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary ${
                      selectedModel?.id === m.id ? 'border-primary shadow-lg' : 'border-gray-100'
                    }`}
                  >
                    {m.imageUrl ? (
                      <div className="relative w-full h-40 mb-3 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={m.imageUrl}
                          alt={m.name}
                          fill
                          className="object-contain p-2"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                    ) : (
                      <div className="w-full h-40 mb-3 rounded-xl bg-gray-100 flex items-center justify-center text-5xl">
                        📱
                      </div>
                    )}
                    <p className="font-bold text-dark text-sm leading-snug mb-1">{m.name}</p>
                    <p className="text-primary font-black text-lg">{formatPrice(m.price)}</p>
                    <div className="mt-2">
                      <StatusBadge status={m.status} />
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Model detail */}
      {selectedModel && (
        <section ref={detailRef} className="py-10 px-4 bg-white border-t-4 border-primary">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={() => setSelectedModel(null)}
              className="text-gray-500 hover:text-dark text-sm mb-4 flex items-center gap-1"
            >
              ← Quay lại danh sách
            </button>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image */}
              <div className="flex items-center justify-center">
                {selectedModel.imageUrl ? (
                  <div className="relative w-72 h-72 rounded-2xl overflow-hidden bg-gray-100">
                    <Image
                      src={selectedModel.imageUrl}
                      alt={selectedModel.name}
                      fill
                      className="object-contain p-4"
                      sizes="288px"
                    />
                  </div>
                ) : (
                  <div className="w-72 h-72 rounded-2xl bg-gray-100 flex items-center justify-center text-9xl">
                    📱
                  </div>
                )}
              </div>
              {/* Info */}
              <div>
                <StatusBadge status={selectedModel.status} />
                <h3 className="text-2xl font-black text-dark mt-2 mb-1">{selectedModel.name}</h3>
                <p className="text-primary font-black text-3xl mb-4">{formatPrice(selectedModel.price)}</p>

                {selectedModel.storages.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-500 text-sm font-semibold mb-2">Dung lượng</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedModel.storages.map((s) => (
                        <span
                          key={s}
                          className="px-3 py-1 rounded-full border-2 border-dark text-dark text-sm font-bold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedModel.colors.length > 0 && (
                  <div className="mb-4">
                    <p className="text-gray-500 text-sm font-semibold mb-2">Màu sắc</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedModel.colors.map((c) => (
                        <span
                          key={c}
                          className="px-3 py-1 rounded-full bg-gray-100 text-dark text-sm font-medium border border-gray-200"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedModel.note && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-primary rounded-xl">
                    <p className="text-sm text-dark">{selectedModel.note}</p>
                  </div>
                )}

                {/* CTAs */}
                <div className="flex flex-col gap-3 mt-6">
                  <a
                    href="https://zalo.me/0826000291"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-primary text-dark font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    💬 Liên hệ Zalo: 0826 000 291
                  </a>
                  <a
                    href="https://zalo.me/0377324973"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-primary text-dark font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors"
                  >
                    💬 Liên hệ Zalo: 0377 324 973
                  </a>
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="tel:0826000291"
                      className="flex items-center justify-center gap-2 border-2 border-dark text-dark font-bold py-3 rounded-xl hover:bg-dark hover:text-white transition-colors"
                    >
                      📞 0826 000 291
                    </a>
                    <a
                      href="tel:0377324973"
                      className="flex items-center justify-center gap-2 border-2 border-dark text-dark font-bold py-3 rounded-xl hover:bg-dark hover:text-white transition-colors"
                    >
                      📞 0377 324 973
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Contact */}
      <section id="contact" className="py-14 px-4 bg-dark text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-black mb-2">Liên hệ với chúng tôi</h2>
          <p className="text-gray-400 mb-8">Hỗ trợ tư vấn miễn phí, phản hồi nhanh</p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://zalo.me/0826000291"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-dark font-bold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
            >
              💬 Zalo: 0826 000 291
            </a>
            <a
              href="https://zalo.me/0377324973"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary text-dark font-bold px-6 py-3 rounded-full hover:bg-primary-dark transition-colors"
            >
              💬 Zalo: 0377 324 973
            </a>
            <a
              href="tel:0826000291"
              className="border border-primary text-primary font-bold px-6 py-3 rounded-full hover:bg-primary hover:text-dark transition-colors"
            >
              📞 Gọi: 0826 000 291
            </a>
            <a
              href="tel:0377324973"
              className="border border-primary text-primary font-bold px-6 py-3 rounded-full hover:bg-primary hover:text-dark transition-colors"
            >
              📞 Gọi: 0377 324 973
            </a>
          </div>
        </div>
      </section>

      {/* Address */}
      <section id="address" className="py-10 px-4 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-xl font-black text-dark mb-2">Địa chỉ cửa hàng</h2>
          <p className="text-gray-600 flex items-center justify-center gap-2 text-lg">
            📍 13, NE8 Phường Thới Hòa, TP HCM
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-gray-500 text-center text-sm py-6">
        <p>© {new Date().getFullYear()} NEWCENTER.STORE — Mua Bán iPhone Chính Hãng Giá Tốt</p>
        <p className="mt-1">📍 13, NE8 Phường Thới Hòa, TP HCM | ☎️ 0826 000 291</p>
      </footer>
    </div>
  );
}
