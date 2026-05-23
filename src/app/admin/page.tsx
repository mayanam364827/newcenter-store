'use client';

import { useEffect, useState, useRef } from 'react';
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
  series?: { id: number; key: string; name: string };
  name: string;
  price: number;
  storages: string[];
  colors: string[];
  status: string;
  note: string;
  imageUrl: string;
}

interface FormData {
  seriesId: string;
  name: string;
  price: string;
  storages: string;
  colors: string;
  status: string;
  note: string;
  imageUrl: string;
}

const emptyForm: FormData = {
  seriesId: '',
  name: '',
  price: '',
  storages: '',
  colors: '',
  status: 'in_stock',
  note: '',
  imageUrl: '',
};

function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + '₫';
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'in_stock')
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        Còn hàng
      </span>
    );
  if (status === 'out_of_stock')
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-700">
        Hết hàng
      </span>
    );
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
      Đặt trước
    </span>
  );
}

export default function AdminPage() {
  const [token, setToken] = useState('');
  const [inputToken, setInputToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const [series, setSeries] = useState<Series[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [allModels, setAllModels] = useState<Model[]>([]);
  const [selectedSeriesFilter, setSelectedSeriesFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [formError, setFormError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Restore token from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('admin_token');
    if (saved) {
      setToken(saved);
      setIsAuthenticated(true);
    }
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadSeries();
      loadAllModels();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Filter models
  useEffect(() => {
    let filtered = allModels;
    if (selectedSeriesFilter !== null) {
      filtered = filtered.filter((m) => m.seriesId === selectedSeriesFilter);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.series?.name.toLowerCase().includes(q) ||
          m.status.toLowerCase().includes(q)
      );
    }
    setModels(filtered);
  }, [allModels, selectedSeriesFilter, searchQuery]);

  async function loadSeries() {
    try {
      const res = await fetch('/api/series');
      const data = await res.json();
      setSeries(data.series ?? []);
    } catch (e) {
      console.error(e);
    }
  }

  async function loadAllModels() {
    setLoading(true);
    try {
      const seriesRes = await fetch('/api/series');
      const seriesData = await seriesRes.json();
      const allSeries: Series[] = seriesData.series ?? [];
      const modelPromises = allSeries.map((s) =>
        fetch(`/api/series/${s.key}/models`).then((r) => r.json())
      );
      const results = await Promise.all(modelPromises);
      const flat: Model[] = results.flatMap((r, i) =>
        (r.models ?? []).map((m: Model) => ({ ...m, series: allSeries[i] }))
      );
      flat.sort((a, b) => (a.series?.order ?? 0) - (b.series?.order ?? 0));
      setAllModels(flat);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    try {
      const res = await fetch('/api/auth/verify', {
        headers: { 'x-admin-token': inputToken },
      });
      if (res.ok) {
        sessionStorage.setItem('admin_token', inputToken);
        setToken(inputToken);
        setIsAuthenticated(true);
      } else {
        setAuthError('Mật khẩu không đúng. Vui lòng thử lại.');
      }
    } catch {
      setAuthError('Lỗi kết nối. Vui lòng thử lại.');
    } finally {
      setAuthLoading(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_token');
    setToken('');
    setIsAuthenticated(false);
    setAllModels([]);
    setSeries([]);
  }

  function openAddModal() {
    setEditingModel(null);
    setFormData({ ...emptyForm, seriesId: series[0]?.id.toString() ?? '' });
    setImagePreview('');
    setFormError('');
    setShowModal(true);
  }

  function openEditModal(m: Model) {
    setEditingModel(m);
    setFormData({
      seriesId: m.seriesId.toString(),
      name: m.name,
      price: m.price.toString(),
      storages: m.storages.join(', '),
      colors: m.colors.join(', '),
      status: m.status,
      note: m.note,
      imageUrl: m.imageUrl,
    });
    setImagePreview(m.imageUrl);
    setFormError('');
    setShowModal(true);
  }

  async function handleDeleteModel(m: Model) {
    if (!confirm(`Xóa sản phẩm "${m.name}"?`)) return;
    try {
      const res = await fetch(`/api/models/${m.id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token },
      });
      if (res.ok) {
        await loadAllModels();
      } else {
        alert('Lỗi khi xóa sản phẩm.');
      }
    } catch {
      alert('Lỗi kết nối.');
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-admin-token': token },
        body: fd,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
        setImagePreview(data.url);
      } else {
        alert('Lỗi upload ảnh: ' + (data.error ?? 'Unknown'));
      }
    } catch {
      alert('Lỗi kết nối khi upload.');
    } finally {
      setUploading(false);
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);

    const payload = {
      seriesId: Number(formData.seriesId),
      name: formData.name.trim(),
      price: Number(formData.price),
      storages: formData.storages.split(',').map((s) => s.trim()).filter(Boolean),
      colors: formData.colors.split(',').map((s) => s.trim()).filter(Boolean),
      status: formData.status,
      note: formData.note.trim(),
      imageUrl: formData.imageUrl.trim(),
    };

    if (!payload.name || !payload.seriesId || !payload.price) {
      setFormError('Vui lòng điền đầy đủ các trường bắt buộc.');
      setFormLoading(false);
      return;
    }

    try {
      const url = editingModel ? `/api/models/${editingModel.id}` : '/api/models';
      const method = editingModel ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': token,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        await loadAllModels();
      } else {
        const data = await res.json();
        setFormError(data.error ?? 'Lỗi lưu dữ liệu.');
      }
    } catch {
      setFormError('Lỗi kết nối.');
    } finally {
      setFormLoading(false);
    }
  }

  // ── Login Screen ──────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-black text-dark">
              <span className="text-primary">NEWCENTER</span>.STORE
            </h1>
            <p className="text-gray-500 text-sm mt-1">Trang quản trị</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-dark mb-1">Mật khẩu admin</label>
              <input
                type="password"
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                placeholder="Nhập mật khẩu..."
                required
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-dark focus:outline-none focus:border-primary text-sm"
              />
            </div>
            {authError && (
              <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{authError}</p>
            )}
            <button
              type="submit"
              disabled={authLoading}
              className="w-full bg-primary text-dark font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              {authLoading ? 'Đang xác thực...' : 'Đăng nhập'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Admin Dashboard ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-dark text-white px-6 py-4 flex items-center justify-between shadow-md">
        <h1 className="font-black text-lg">
          <span className="text-primary">NEWCENTER</span>.STORE{' '}
          <span className="text-gray-400 font-normal text-sm">Admin</span>
        </h1>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-white text-sm border border-gray-600 px-4 py-1.5 rounded-lg transition-colors"
        >
          Đăng xuất
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Dòng máy</p>
          </div>
          <nav className="flex-1 overflow-y-auto p-3 space-y-1">
            <button
              onClick={() => setSelectedSeriesFilter(null)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedSeriesFilter === null
                  ? 'bg-primary text-dark'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tất cả
            </button>
            {series.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSeriesFilter(s.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSeriesFilter === s.id
                    ? 'bg-primary text-dark'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {s.name}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-auto p-6">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-3 mb-5 items-center">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-2 border-gray-200 rounded-xl px-4 py-2 text-sm text-dark focus:outline-none focus:border-primary flex-1 min-w-[200px]"
            />
            <button
              onClick={openAddModal}
              className="bg-primary text-dark font-bold px-5 py-2 rounded-xl hover:bg-primary-dark transition-colors text-sm whitespace-nowrap"
            >
              + Thêm sản phẩm
            </button>
            <button
              onClick={loadAllModels}
              className="border border-gray-300 text-gray-600 px-4 py-2 rounded-xl text-sm hover:bg-gray-100 transition-colors"
            >
              ↻ Làm mới
            </button>
          </div>

          {/* Table */}
          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Sản phẩm</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600 hidden md:table-cell">Dòng</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Giá</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600 hidden sm:table-cell">Trạng thái</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {models.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-10">
                        Không có sản phẩm nào.
                      </td>
                    </tr>
                  ) : (
                    models.map((m) => (
                      <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            {m.imageUrl ? (
                              <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                                <Image
                                  src={m.imageUrl}
                                  alt={m.name}
                                  fill
                                  className="object-contain p-0.5"
                                  sizes="40px"
                                />
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl shrink-0">
                                📱
                              </div>
                            )}
                            <div>
                              <p className="font-semibold text-dark leading-snug">{m.name}</p>
                              <p className="text-xs text-gray-400">
                                {m.storages.join(' · ')}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600 hidden md:table-cell">
                          {m.series?.name ?? '—'}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-dark">
                          {formatPrice(m.price)}
                        </td>
                        <td className="px-4 py-3 text-center hidden sm:table-cell">
                          <StatusBadge status={m.status} />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEditModal(m)}
                              className="text-xs bg-gray-100 hover:bg-primary hover:text-dark text-gray-600 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteModel(m)}
                              className="text-xs bg-red-50 hover:bg-red-500 hover:text-white text-red-600 font-semibold px-3 py-1.5 rounded-lg transition-colors"
                            >
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          <p className="text-xs text-gray-400 mt-3 text-right">{models.length} sản phẩm</p>
        </main>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="font-black text-dark text-lg">
                {editingModel ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-dark text-2xl leading-none"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {/* Series */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">
                  Dòng máy <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.seriesId}
                  onChange={(e) => setFormData((p) => ({ ...p, seriesId: e.target.value }))}
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-dark focus:outline-none focus:border-primary text-sm"
                >
                  <option value="">-- Chọn dòng --</option>
                  {series.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">
                  Tên sản phẩm <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  placeholder="VD: iPhone 15 128GB"
                  required
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-dark focus:outline-none focus:border-primary text-sm"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">
                  Giá (VND) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                  placeholder="VD: 16500000"
                  required
                  min={0}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-dark focus:outline-none focus:border-primary text-sm"
                />
              </div>

              {/* Storages */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">
                  Dung lượng{' '}
                  <span className="text-gray-400 font-normal">(cách nhau bằng dấu phẩy)</span>
                </label>
                <input
                  type="text"
                  value={formData.storages}
                  onChange={(e) => setFormData((p) => ({ ...p, storages: e.target.value }))}
                  placeholder="VD: 128GB, 256GB, 512GB"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-dark focus:outline-none focus:border-primary text-sm"
                />
              </div>

              {/* Colors */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">
                  Màu sắc{' '}
                  <span className="text-gray-400 font-normal">(cách nhau bằng dấu phẩy)</span>
                </label>
                <input
                  type="text"
                  value={formData.colors}
                  onChange={(e) => setFormData((p) => ({ ...p, colors: e.target.value }))}
                  placeholder="VD: Đen, Trắng, Vàng"
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-dark focus:outline-none focus:border-primary text-sm"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Trạng thái</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData((p) => ({ ...p, status: e.target.value }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-dark focus:outline-none focus:border-primary text-sm"
                >
                  <option value="in_stock">Còn hàng</option>
                  <option value="out_of_stock">Hết hàng</option>
                  <option value="preorder">Đặt trước</option>
                </select>
              </div>

              {/* Note */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Ghi chú</label>
                <textarea
                  value={formData.note}
                  onChange={(e) => setFormData((p) => ({ ...p, note: e.target.value }))}
                  placeholder="Ghi chú về sản phẩm..."
                  rows={2}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 text-dark focus:outline-none focus:border-primary text-sm resize-none"
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-sm font-semibold text-dark mb-1">Hình ảnh</label>
                <div className="flex gap-2 items-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="border-2 border-dashed border-gray-300 hover:border-primary text-gray-500 text-sm px-4 py-2 rounded-xl transition-colors disabled:opacity-50"
                  >
                    {uploading ? 'Đang tải...' : '📁 Chọn ảnh'}
                  </button>
                  {imagePreview && (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={imagePreview}
                        alt="preview"
                        fill
                        className="object-contain p-1"
                        sizes="56px"
                      />
                    </div>
                  )}
                </div>
                {formData.imageUrl && (
                  <p className="text-xs text-gray-400 mt-1 truncate">{formData.imageUrl}</p>
                )}
              </div>

              {formError && (
                <p className="text-red-500 text-sm bg-red-50 p-2 rounded-lg">{formError}</p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 border-2 border-gray-200 text-dark font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors text-sm"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="flex-1 bg-primary text-dark font-bold py-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-60 text-sm"
                >
                  {formLoading ? 'Đang lưu...' : editingModel ? 'Cập nhật' : 'Thêm mới'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
