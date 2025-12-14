import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../../../api/menu';
import Loader from '../../../components/Loader/Loader';
import styles from './MenuManagement.module.css';

const MenuManagement = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const categories = ['Breakfast', 'Main Dishes', 'Drinks', 'Desserts'];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Breakfast',
    image: '',
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await getMenuItems();
      setMenuItems(data || []);
    } catch (err) {
      setError('Failed to load menu items');
      console.error('Error fetching menu items:', err);
      toast.error('Failed to load menu items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      errors.price = 'Price must be greater than 0';
    }
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const menuData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image.trim() || undefined,
      };

      if (editingItem) {
        await updateMenuItem(editingItem._id || editingItem.id, menuData);
        toast.success('Menu item updated successfully');
      } else {
        await createMenuItem(menuData);
        toast.success('Menu item created successfully');
      }

      resetForm();
      fetchMenuItems();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          `Failed to ${editingItem ? 'update' : 'create'} menu item`
      );
      console.error('Error saving menu item:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name || '',
      description: item.description || '',
      price: item.price?.toString() || '',
      category: item.category || 'Breakfast',
      image: item.image || '',
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) {
      return;
    }

    setDeletingId(itemId);
    try {
      await deleteMenuItem(itemId);
      toast.success('Menu item deleted successfully');
      fetchMenuItems();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          'Failed to delete menu item'
      );
      console.error('Error deleting menu item:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Breakfast',
      image: '',
    });
    setFormErrors({});
    setEditingItem(null);
    setIsFormOpen(false);
  };

  const handleCancel = () => {
    resetForm();
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error && menuItems.length === 0) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.menuContainer}>
      <div className={styles.header}>
        <h2 className={styles.sectionTitle}>Menu Items</h2>
        <div className={styles.headerActions}>
          <span className={styles.count}>Total: {menuItems.length}</span>
          <button
            className={styles.addButton}
            onClick={() => setIsFormOpen(true)}
            disabled={isFormOpen}
          >
            + Add New Item
          </button>
        </div>
      </div>

      {isFormOpen && (
        <div className={styles.formCard}>
          <div className={styles.formHeader}>
            <h3 className={styles.formTitle}>
              {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </h3>
            <button className={styles.closeButton} onClick={handleCancel}>
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>
                Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`${styles.input} ${formErrors.name ? styles.inputError : ''}`}
                placeholder="Enter item name"
                disabled={isSubmitting}
              />
              {formErrors.name && (
                <span className={styles.errorText}>{formErrors.name}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description" className={styles.label}>
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`${styles.textarea} ${formErrors.description ? styles.inputError : ''}`}
                placeholder="Enter item description"
                rows="4"
                disabled={isSubmitting}
              />
              {formErrors.description && (
                <span className={styles.errorText}>{formErrors.description}</span>
              )}
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="price" className={styles.label}>
                  Price *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`${styles.input} ${formErrors.price ? styles.inputError : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  disabled={isSubmitting}
                />
                {formErrors.price && (
                  <span className={styles.errorText}>{formErrors.price}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category" className={styles.label}>
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`${styles.select} ${formErrors.category ? styles.inputError : ''}`}
                  disabled={isSubmitting}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {formErrors.category && (
                  <span className={styles.errorText}>{formErrors.category}</span>
                )}
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="image" className={styles.label}>
                Image URL (Optional)
              </label>
              <input
                type="url"
                id="image"
                name="image"
                value={formData.image}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="https://example.com/image.jpg"
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className={styles.submitButton}
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? 'Saving...'
                  : editingItem
                  ? 'Update Item'
                  : 'Create Item'}
              </button>
            </div>
          </form>
        </div>
      )}

      {menuItems.length === 0 && !isFormOpen ? (
        <div className={styles.emptyState}>
          <h3>No menu items found</h3>
          <p>Start by adding your first menu item.</p>
        </div>
      ) : (
        <div className={styles.menuGrid}>
          {menuItems.map((item) => {
            const itemId = item._id || item.id;
            const isDeleting = deletingId === itemId;
            return (
              <div key={itemId} className={styles.menuItemCard}>
                <div className={styles.itemImageContainer}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} className={styles.itemImage} />
                  ) : (
                    <div className={styles.placeholderImage}>No Image</div>
                  )}
                </div>
                <div className={styles.itemContent}>
                  <div className={styles.itemHeader}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    <span className={styles.itemPrice}>${item.price?.toFixed(2) || '0.00'}</span>
                  </div>
                  <p className={styles.itemDescription}>{item.description}</p>
                  <div className={styles.itemMeta}>
                    <span className={styles.itemCategory}>{item.category}</span>
                  </div>
                  <div className={styles.itemActions}>
                    <div
                      className={`${styles.editAction} ${isFormOpen ? styles.disabled : ''}`}
                      onClick={() => !isFormOpen && handleEdit(item)}
                    >
                      <svg
                        className={styles.editIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                      </svg>
                      <button
                        className={styles.editButton}
                        disabled={isFormOpen}
                      >
                        Edit
                      </button>
                    </div>
                    <div
                      className={`${styles.deleteAction} ${(isDeleting || isFormOpen) ? styles.disabled : ''}`}
                      onClick={() => !(isDeleting || isFormOpen) && handleDelete(itemId)}
                    >
                      <svg
                        className={styles.deleteIcon}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                      <button
                        className={styles.deleteButton}
                        disabled={isDeleting || isFormOpen}
                      >
                        {isDeleting ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MenuManagement;
