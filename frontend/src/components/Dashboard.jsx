import { useEffect, useState } from 'react';
import { createItem, deleteItem, getItems, getStats, updateItem } from '../api/itemApi';
import { useAuth } from '../context/AuthContext';
import Alert from './Alert';

const defaultForm = {
  title: '',
  description: '',
  status: 'active'
};

const statConfig = [
  { key: 'total', label: 'Total items' },
  { key: 'active', label: 'Active' },
  { key: 'pending', label: 'Pending' },
  { key: 'completed', label: 'Completed' }
];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [items, setItems] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, completed: 0 });
  const [formData, setFormData] = useState(defaultForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const [itemsResponse, statsResponse] = await Promise.all([getItems(), getStats()]);
      setItems(itemsResponse.items);
      setStats(statsResponse.stats);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(defaultForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.title.trim()) {
      setError('Title is required.');
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        await updateItem(editingId, formData);
        setSuccess('Item updated successfully.');
      } else {
        await createItem(formData);
        setSuccess('Item created successfully.');
      }

      resetForm();
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save the item.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      description: item.description || '',
      status: item.status
    });
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?');
    if (!confirmed) return;

    try {
      await deleteItem(id);
      setSuccess('Item deleted successfully.');
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to delete the item.');
    }
  };

  const handleStatusUpdate = async (item, status) => {
    try {
      await updateItem(item.id, {
        title: item.title,
        description: item.description || '',
        status
      });
      setSuccess('Status updated successfully.');
      await loadDashboard();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update item status.');
    }
  };

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-[30px] bg-white/95 p-6 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-brand-700">Dashboard</p>
              <h1 className="mt-2 text-3xl font-bold text-ink">Hello, {user?.name}</h1>
            </div>
            <button
              className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700"
              onClick={logout}
              type="button"
            >
              Logout
            </button>
          </div>
        </header>

        <Alert type="error" message={error} />
        <Alert type="success" message={success} />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {statConfig.map((stat) => (
            <div key={stat.key} className="rounded-[28px] bg-white p-6 shadow-soft transition hover:-translate-y-1">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="mt-4 text-4xl font-bold text-ink">{stats[stat.key]}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <div className="rounded-[30px] bg-white p-6 shadow-soft">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-ink">{editingId ? 'Edit item' : 'Add new item'}</h2>
              {editingId ? (
                <button className="text-sm font-semibold text-brand-700" onClick={resetForm} type="button">
                  Cancel
                </button>
              ) : null}
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Title</label>
                <input
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                  name="title"
                  placeholder="Enter item title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                <textarea
                  className="min-h-32 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                  name="description"
                  placeholder="Add a short description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Status</label>
                <select
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button
                className="w-full rounded-2xl bg-brand-700 px-4 py-3 font-semibold text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={saving}
                type="submit"
              >
                {saving ? 'Saving...' : editingId ? 'Update item' : 'Create item'}
              </button>
            </form>
          </div>

          <div className="rounded-[30px] bg-white p-6 shadow-soft">
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-bold text-ink">Your items</h2>
              <p className="text-sm text-slate-500">{items.length} record(s)</p>
            </div>

            {loading ? (
              <div className="rounded-2xl bg-mist p-8 text-center text-slate-500">Loading your items...</div>
            ) : items.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center text-slate-500">
                No items yet. Create your first one from the form.
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="rounded-[26px] border border-slate-100 bg-gradient-to-br from-white to-slate-50 p-5 transition hover:border-brand-200"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-lg font-semibold text-ink">{item.title}</h3>
                          <span className="rounded-full bg-peach px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
                            {item.status}
                          </span>
                        </div>
                        <p className="text-sm leading-6 text-slate-500">
                          {item.description || 'No description provided.'}
                        </p>
                        <p className="text-xs text-slate-400">
                          Created: {new Date(item.created_at).toLocaleString()}
                        </p>
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                        <select
                          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none transition focus:border-brand-500"
                          value={item.status}
                          onChange={(event) => handleStatusUpdate(item, event.target.value)}
                        >
                          <option value="active">Active</option>
                          <option value="pending">Pending</option>
                          <option value="completed">Completed</option>
                        </select>
                        <button
                          className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 hover:text-brand-700"
                          onClick={() => handleEdit(item)}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          className="rounded-2xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                          onClick={() => handleDelete(item.id)}
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
