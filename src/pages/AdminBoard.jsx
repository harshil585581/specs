import React, { useState, useEffect, useRef } from "react";
import {
  FaTachometerAlt,
  FaGlasses,
  FaUsers,
  FaClipboardList,
  FaQuestionCircle,
  FaSignOutAlt,
} from "react-icons/fa";

const API_ROOT = (process.env.REACT_APP_API_BASE || "").trim().replace(/\/+$/g, "");
const API_BASE = (API_ROOT ? API_ROOT : "") + "/api/adminboard";

const SIZE_OPTIONS = [
  "Extra Narrow",
  "Narrow",
  "Medium",
  "Wide",
  "Extra Wide",
];

const FRAME_TYPE_OPTIONS = ["Full Rim", "Half Rim", "Rimless"];

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("dashboard");

  // Spectacles state
  const [formData, setFormData] = useState({
    name: "",
    modelName: "",
    category: "",
    rating: "",
    reviewCount: "",
    oldPrice: "",
    newPrice: "",
    color: "",
    smallDescription: "",
    bigDescription: "",
    // dimensions + size
    width: "",
    height: "",
    size: "",
    // NEW: gender / frame
    gender: "",
    frameType: "",
    frameMaterial: "",
    // images
    image1: null,
    image2: null,
    image3: null,
    image4: null,
  });
  const [spectaclesList, setSpectaclesList] = useState([]);
  const [editModal, setEditModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // Users state
  const [usersList, setUsersList] = useState([]);
  const [userEditModal, setUserEditModal] = useState(false);
  const [userEditData, setUserEditData] = useState(null);

  // ---------- Toasts ----------
  const [toasts, setToasts] = useState([]);
  const toastIdRef = useRef(0);
  const showToast = (type, message, timeout = 3500) => {
    const id = ++toastIdRef.current;
    setToasts((t) => [...t, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, timeout);
  };

  // ---------- Fetch ----------
  const fetchSpectacles = async () => {
    try {
      const res = await fetch(`${API_BASE}/list-spectacles/`, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setSpectaclesList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch spectacles error:", err);
      setSpectaclesList([]);
      showToast("error", "Failed to load spectacles.");
    }
  };
  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE}/list-users/`, { headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setUsersList(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch users error:", err);
      setUsersList([]);
      showToast("error", "Failed to load users.");
    }
  };

  useEffect(() => { fetchSpectacles(); }, []);
  useEffect(() => { if (activePage === "users") fetchUsers(); }, [activePage]);

  // ---------- Spectacles: create ----------
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((p) => ({ ...p, [name]: files ? files[0] : value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", formData.name);
    form.append("model_name", formData.modelName);
    form.append("category", formData.category);
    form.append("rating", formData.rating);
    form.append("review_count", formData.reviewCount);
    form.append("old_price", formData.oldPrice);
    form.append("new_price", formData.newPrice);
    form.append("color", formData.color);
    form.append("small_description", formData.smallDescription);
    form.append("big_description", formData.bigDescription);
    // dimensions + size
    form.append("width", formData.width);
    form.append("height", formData.height);
    form.append("size", formData.size);
    // NEW: gender / frame
    form.append("gender", formData.gender);
    form.append("frame_type", formData.frameType);
    form.append("frame_material", formData.frameMaterial);
    // images
    if (formData.image1) form.append("image1", formData.image1);
    if (formData.image2) form.append("image2", formData.image2);
    if (formData.image3) form.append("image3", formData.image3);
    if (formData.image4) form.append("image4", formData.image4);

    try {
      const res = await fetch(`${API_BASE}/add-spectacle/`, { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      setFormData({
        name: "", modelName: "", category: "", rating: "", reviewCount: "",
        oldPrice: "", newPrice: "", color: "", smallDescription: "", bigDescription: "",
        width: "", height: "", size: "",
        gender: "", frameType: "", frameMaterial: "",
        image1: null, image2: null, image3: null, image4: null,
      });
      fetchSpectacles();
      showToast("success", "Spectacle added successfully.");
    } catch (err) {
      console.error("Add spectacle error:", err);
      showToast("error", "Failed to add spectacle.");
    }
  };

  // ---------- Spectacles: delete ----------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this spectacle?")) return;
    try {
      const res = await fetch(`${API_BASE}/delete-spectacle/${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      fetchSpectacles();
      showToast("success", "Spectacle deleted successfully.");
    } catch (err) {
      console.error("Delete spectacle error:", err);
      showToast("error", "Failed to delete spectacle.");
    }
  };

  // ---------- Spectacles: edit ----------
  const openEditModal = (spec) => {
    setEditData({
      ...spec,
      new_price: spec.new_price ?? spec.newPrice ?? "",
      model_name: spec.model_name ?? spec.modelName ?? "",
      small_description: spec.small_description ?? spec.smallDescription ?? "",
      big_description: spec.big_description ?? spec.bigDescription ?? spec.description ?? "",
      // dimensions + size
      width: spec.width ?? "",
      height: spec.height ?? "",
      size: spec.size ?? "",
      // NEW
      gender: spec.gender ?? "",
      frame_type: spec.frame_type ?? "",
      frame_material: spec.frame_material ?? "",
      // images control
      image1File: null, image2File: null, image3File: null, image4File: null,
      remove_image1: false, remove_image2: false, remove_image3: false, remove_image4: false,
    });
    setEditModal(true);
  };
  const handleEditChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setEditData((p) => {
      if (type === "file") return { ...p, [name]: files && files.length ? files[0] : null };
      if (type === "checkbox") return { ...p, [name]: checked };
      return { ...p, [name]: value };
    });
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append("name", editData.name ?? "");
    form.append("model_name", editData.model_name ?? "");
    form.append("category", editData.category ?? "");
    form.append("rating", editData.rating ?? "");
    form.append("review_count", editData.review_count ?? "");
    form.append("old_price", editData.old_price ?? "");
    form.append("new_price", editData.new_price ?? "");
    form.append("color", editData.color ?? "");
    form.append("small_description", editData.small_description ?? "");
    form.append("big_description", editData.big_description ?? "");
    // dimensions + size
    form.append("width", editData.width ?? "");
    form.append("height", editData.height ?? "");
    form.append("size", editData.size ?? "");
    // NEW: gender / frame
    form.append("gender", editData.gender ?? "");
    form.append("frame_type", editData.frame_type ?? "");
    form.append("frame_material", editData.frame_material ?? "");
    // remove flags
    form.append("remove_image1", editData.remove_image1 ? "true" : "false");
    form.append("remove_image2", editData.remove_image2 ? "true" : "false");
    form.append("remove_image3", editData.remove_image3 ? "true" : "false");
    form.append("remove_image4", editData.remove_image4 ? "true" : "false");
    // new files
    if (editData.image1File) form.append("image1", editData.image1File);
    if (editData.image2File) form.append("image2", editData.image2File);
    if (editData.image3File) form.append("image3", editData.image3File);
    if (editData.image4File) form.append("image4", editData.image4File);

    try {
      const res = await fetch(`${API_BASE}/update-spectacle/${editData.id}/`, { method: "PUT", body: form });
      if (!res.ok) throw new Error(await res.text());
      setEditModal(false);
      fetchSpectacles();
      showToast("success", "Spectacle updated successfully.");
    } catch (err) {
      console.error("Update spectacle error:", err);
      showToast("error", "Failed to update spectacle.");
    }
  };

  // ---------- Users: edit/delete ----------
  const openUserEditModal = (user) => {
    setUserEditData({
      ...user,
      is_active: !!user.is_active,
      is_staff: !!user.is_staff,
      new_password: "",
    });
    setUserEditModal(true);
  };
  const handleUserEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUserEditData((p) => (type === "checkbox" ? { ...p, [name]: checked } : { ...p, [name]: value }));
  };
  const handleUserUpdateSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      username: userEditData.username,
      email: userEditData.email,
      phone: userEditData.phone,
      is_active: userEditData.is_active,
      is_staff: userEditData.is_staff,
      new_password: userEditData.new_password || undefined,
    };
    try {
      const res = await fetch(`${API_BASE}/update-user/${userEditData.id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      setUserEditModal(false);
      fetchUsers();
      showToast("success", "User updated successfully.");
    } catch (err) {
      console.error("Update user error:", err);
      showToast("error", "Failed to update user.");
    }
  };
  const handleUserDelete = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try {
      const res = await fetch(`${API_BASE}/delete-user/${id}/`, { method: "DELETE" });
      if (!res.ok) throw new Error(await res.text());
      fetchUsers();
      showToast("success", "User deleted successfully.");
    } catch (err) {
      console.error("Delete user error:", err);
      showToast("error", "Failed to delete user.");
    }
  };

  const totalSpectacles = spectaclesList.length;
  const totalUsers = usersList.length;

  return (
    <div className="skdash-container">
      {/* Sidebar */}
      <aside className="skdash-sidebar">
        <h2 className="skdash-sidebar-title">Hi, Admin</h2>
        <nav className="skdash-sidebar-nav">
          <button className="skdash-nav-link" onClick={() => setActivePage("dashboard")}><FaTachometerAlt /> Dashboard</button>
          <button className="skdash-nav-link" onClick={() => setActivePage("add-spectacles")}><FaGlasses /> Add Spectacles</button>
          <button className="skdash-nav-link" onClick={() => setActivePage("manage-spectacles")}><FaGlasses /> Manage Spectacles</button>
          <button className="skdash-nav-link" onClick={() => setActivePage("users")}><FaUsers /> Users</button>
          <button className="skdash-nav-link"><FaClipboardList /> Orders</button>
          <button className="skdash-nav-link"><FaQuestionCircle /> Customer Query</button>
          <button className="skdash-nav-link skdash-logout"><FaSignOutAlt /> Logout</button>
        </nav>
      </aside>

      {/* Main */}
      <main className="skdash-main">
        <header className="skdash-header">
          <h1>Specs <span className="skdash-highlight">Kraft</span></h1>
        </header>

        {/* Toasts */}
        <div className="skdash-toast-container" aria-live="polite" aria-atomic="true">
          {toasts.map((t) => (
            <div key={t.id} className={`skdash-toast skdash-toast-${t.type}`}>
              <span className="skdash-toast-dot" />
              <div className="skdash-toast-text">{t.message}</div>
              <button className="skdash-toast-close" onClick={() => setToasts((list) => list.filter((x) => x.id !== t.id))} aria-label="Dismiss">✕</button>
            </div>
          ))}
        </div>

        <div className="skdash-content">
          {/* Dashboard */}
          {activePage === "dashboard" && (
            <section className="skdash-section">
              <div className="skdash-section-header"><h2>Welcome, Admin</h2></div>
              <div className="skdash-section-body">
                <div className="skdash-cards">
                  <div className="skdash-card"><h3>Total Spectacles</h3><p className="skdash-number">{totalSpectacles}</p></div>
                  <div className="skdash-card"><h3>Total Users</h3><p className="skdash-number">{totalUsers}</p></div>
                  <div className="skdash-card"><h3>Pending Orders</h3><p className="skdash-number">25</p></div>
                </div>
              </div>
            </section>
          )}

          {/* Add Spectacles */}
          {activePage === "add-spectacles" && (
            <section className="skdash-section">
              <div className="skdash-section-header"><h2>Add Spectacles</h2></div>
              <div className="skdash-section-body">
                <div className="skdash-scroll-area">
                  <div className="skdash-form">
                    <form onSubmit={handleSubmit}>
                      <div className="skdash-form-row">
                        <div className="skdash-form-group"><label>Name:</label><input type="text" name="name" value={formData.name} onChange={handleChange}/></div>
                        <div className="skdash-form-group"><label>Model Name:</label><input type="text" name="modelName" value={formData.modelName} onChange={handleChange}/></div>
                        <div className="skdash-form-group"><label>Rating:</label><input type="text" name="rating" value={formData.rating} onChange={handleChange}/></div>
                      </div>

                      <div className="skdash-form-row">
                        <div className="skdash-form-group">
                          <label>Category:</label>
                          <select name="category" value={formData.category} onChange={handleChange}>
                            <option value="">Select Category</option>
                            <option value="Transparent Frames">Transparent Frames</option>
                            <option value="Rectangle Frames">Rectangle Frames</option>
                            <option value="Rimless Frames">Rimless Frames</option>
                            <option value="Cat Eye Frames">Cat Eye Frames</option>
                          </select>
                        </div>
                        <div className="skdash-form-group"><label>Review Count:</label><input type="text" name="reviewCount" value={formData.reviewCount} onChange={handleChange}/></div>
                        <div className="skdash-form-group"><label>Color:</label><input type="text" name="color" value={formData.color} onChange={handleChange}/></div>
                      </div>

                      <div className="skdash-form-row">
                        <div className="skdash-form-group"><label>Old Price:</label><input type="number" name="oldPrice" value={formData.oldPrice} onChange={handleChange}/></div>
                        <div className="skdash-form-group"><label>New Price:</label><input type="number" name="newPrice" value={formData.newPrice} onChange={handleChange}/></div>
                        <div className="skdash-form-group"><label>Image 1:</label><input type="file" name="image1" onChange={handleChange}/></div>
                      </div>

                      <div className="skdash-form-row">
                        <div className="skdash-form-group"><label>Image 2:</label><input type="file" name="image2" onChange={handleChange}/></div>
                        <div className="skdash-form-group"><label>Image 3:</label><input type="file" name="image3" onChange={handleChange}/></div>
                        <div className="skdash-form-group"><label>Image 4:</label><input type="file" name="image4" onChange={handleChange}/></div>
                      </div>

                      {/* Width, Height, Size */}
                      <div className="skdash-form-row">
                        <div className="skdash-form-group">
                          <label>Width:</label>
                          <input type="number" name="width" value={formData.width} onChange={handleChange} placeholder="e.g., 140" />
                        </div>
                        <div className="skdash-form-group">
                          <label>Height:</label>
                          <input type="number" name="height" value={formData.height} onChange={handleChange} placeholder="e.g., 42" />
                        </div>
                        <div className="skdash-form-group">
                          <label>Size:</label>
                          <select name="size" value={formData.size} onChange={handleChange}>
                            <option value="">Select size</option>
                            {SIZE_OPTIONS.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* NEW: Gender / Frame Type / Frame Material */}
                      <div className="skdash-form-row">
                        <div className="skdash-form-group">
                          <label>Gender:</label>
                          <input type="text" name="gender" value={formData.gender} onChange={handleChange} placeholder="e.g., Men / Women / Unisex" />
                        </div>
                        <div className="skdash-form-group">
                          <label>Frame Type:</label>
                          <select name="frameType" value={formData.frameType} onChange={handleChange}>
                            <option value="">Select frame type</option>
                            {FRAME_TYPE_OPTIONS.map((ft) => (
                              <option key={ft} value={ft}>{ft}</option>
                            ))}
                          </select>
                        </div>
                        <div className="skdash-form-group">
                          <label>Frame Material:</label>
                          <input type="text" name="frameMaterial" value={formData.frameMaterial} onChange={handleChange} placeholder="e.g., Acetate, Metal" />
                        </div>
                      </div>

                      <div className="skdash-form-row">
                        <div className="skdash-form-group" style={{ flex: "1 1 100%" }}>
                          <label>Small Description:</label>
                          <input type="text" name="smallDescription" value={formData.smallDescription} onChange={handleChange}/>
                        </div>
                      </div>

                      <div className="skdash-form-row">
                        <div className="skdash-form-group" style={{ flex: "1 1 100%" }}>
                          <label>Big Description:</label>
                          <textarea name="bigDescription" value={formData.bigDescription} onChange={handleChange}></textarea>
                        </div>
                      </div>

                      <button type="submit" className="skdash-btn-submit">Submit</button>
                    </form>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Manage Spectacles */}
          {activePage === "manage-spectacles" && (
            <section className="skdash-section">
              <div className="skdash-section-header"><h2>Manage Spectacles</h2></div>
              <div className="skdash-section-body">
                {spectaclesList.length === 0 && (
                  <p className="skdash-empty-hint">
                    {`No spectacles to show. If you just started the server, ensure ${API_BASE}/list-spectacles/ is reachable and CORS/same-origin is configured.`}
                  </p>
                )}
                <div className="skdash-table-wrapper">
                  <table className="skdash-table skdash-table-wide">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>New Price</th>
                        <th>Rating</th>
                        <th>Color</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {spectaclesList.map((spec) => (
                        <tr key={spec.id}>
                          <td>{spec.name}</td>
                          <td>{spec.category}</td>
                          <td>{spec.new_price ?? spec.newPrice}</td>
                          <td>{spec.rating}</td>
                          <td>{spec.color}</td>
                          <td>
                            <div className="skdash-table-actions">
                              <button className="skdash-btn skdash-btn-primary" onClick={() => openEditModal(spec)}>Update</button>
                              <button className="skdash-btn skdash-btn-danger" onClick={() => handleDelete(spec.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          )}

          {/* Users */}
          {activePage === "users" && (
            <section className="skdash-section">
              <div className="skdash-section-header"><h2>Users</h2></div>
              <div className="skdash-section-body">
                {usersList.length === 0 && (
                  <p className="skdash-empty-hint">
                    {`No users to show. If you just started the server, ensure ${API_BASE}/list-users/ is reachable.`}
                  </p>
                )}
                <div className="skdash-table-wrapper">
                  <table className="skdash-table skdash-table-wide">
                    <thead>
                      <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Active</th>
                        <th>Staff</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.map((u) => (
                        <tr key={u.id}>
                          <td>{u.username}</td>
                          <td>{u.email}</td>
                          <td>{u.phone}</td>
                          <td>{u.is_active ? "Yes" : "No"}</td>
                          <td>{u.is_staff ? "Yes" : "No"}</td>
                          <td>
                            <div className="skdash-table-actions">
                              <button className="skdash-btn skdash-btn-primary" onClick={() => openUserEditModal(u)}>Update</button>
                              <button className="skdash-btn skdash-btn-danger" onClick={() => handleUserDelete(u.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Edit User Modal */}
                {userEditModal && (
                  <div className="skdash-modal-overlay">
                    <div className="skdash-modal">
                      <div className="skdash-modal-header">
                        <h3 className="skdash-modal-title">Edit User</h3>
                        <button className="skdash-modal-close" onClick={() => setUserEditModal(false)}>✕</button>
                      </div>

                      <form onSubmit={handleUserUpdateSubmit}>
                        <div className="skdash-modal-body skdash-scrollable">
                          <div className="skdash-form-row">
                            <div className="skdash-form-group">
                              <label>Username:</label>
                              <input type="text" name="username" value={userEditData.username || ""} onChange={handleUserEditChange}/>
                            </div>
                            <div className="skdash-form-group">
                              <label>Email:</label>
                              <input type="text" name="email" value={userEditData.email || ""} onChange={handleUserEditChange}/>
                            </div>
                            <div className="skdash-form-group">
                              <label>Phone (10 digits):</label>
                              <input type="text" name="phone" value={userEditData.phone || ""} onChange={handleUserEditChange}/>
                            </div>
                          </div>

                          <div className="skdash-form-row" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
                            <div className="skdash-form-group">
                              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <input type="checkbox" name="is_active" checked={!!userEditData.is_active} onChange={handleUserEditChange}/>
                                Active
                              </label>
                            </div>
                            <div className="skdash-form-group">
                              <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
                                <input type="checkbox" name="is_staff" checked={!!userEditData.is_staff} onChange={handleUserEditChange}/>
                                Staff
                              </label>
                            </div>
                            <div className="skdash-form-group">
                              <label>New Password (optional):</label>
                              <input type="text" name="new_password" value={userEditData.new_password || ""} onChange={handleUserEditChange} placeholder="Leave blank to keep current"/>
                            </div>
                          </div>
                        </div>

                        <div className="skdash-modal-footer">
                          <button type="submit" className="skdash-btn skdash-btn-primary">Save</button>
                          <button type="button" className="skdash-btn skdash-btn-ghost" onClick={() => setUserEditModal(false)}>Cancel</button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>

        {/* Spectacles Edit Modal */}
        {editModal && editData && (
          <div className="skdash-modal-overlay">
            <div className="skdash-modal">
              <div className="skdash-modal-header">
                <h3 className="skdash-modal-title">Edit Spectacle</h3>
                <button className="skdash-modal-close" onClick={() => setEditModal(false)}>✕</button>
              </div>

              <form onSubmit={handleUpdateSubmit}>
                <div className="skdash-modal-body skdash-scrollable">
                  <div className="skdash-form-row">
                    <div className="skdash-form-group"><label>Name:</label><input type="text" name="name" value={editData.name || ""} onChange={handleEditChange}/></div>
                    <div className="skdash-form-group"><label>Model Name:</label><input type="text" name="model_name" value={editData.model_name || ""} onChange={handleEditChange}/></div>
                    <div className="skdash-form-group"><label>New Price:</label><input type="number" name="new_price" value={editData.new_price ?? ""} onChange={handleEditChange}/></div>
                  </div>

                  <div className="skdash-form-row">
                    <div className="skdash-form-group"><label>Category:</label><input type="text" name="category" value={editData.category || ""} onChange={handleEditChange}/></div>
                    <div className="skdash-form-group"><label>Rating:</label><input type="text" name="rating" value={editData.rating ?? ""} onChange={handleEditChange}/></div>
                    <div className="skdash-form-group"><label>Color:</label><input type="text" name="color" value={editData.color || ""} onChange={handleEditChange}/></div>
                  </div>

                  {/* Width, Height, Size */}
                  <div className="skdash-form-row">
                    <div className="skdash-form-group">
                      <label>Width:</label>
                      <input type="number" name="width" value={editData.width ?? ""} onChange={handleEditChange} placeholder="e.g., 140" />
                    </div>
                    <div className="skdash-form-group">
                      <label>Height:</label>
                      <input type="number" name="height" value={editData.height ?? ""} onChange={handleEditChange} placeholder="e.g., 42" />
                    </div>
                    <div className="skdash-form-group">
                      <label>Size:</label>
                      <select name="size" value={editData.size ?? ""} onChange={handleEditChange}>
                        <option value="">Select size</option>
                        {SIZE_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* NEW: Gender / Frame Type / Frame Material */}
                  <div className="skdash-form-row">
                    <div className="skdash-form-group">
                      <label>Gender:</label>
                      <input type="text" name="gender" value={editData.gender ?? ""} onChange={handleEditChange} placeholder="e.g., Men / Women / Unisex" />
                    </div>
                    <div className="skdash-form-group">
                      <label>Frame Type:</label>
                      <select name="frame_type" value={editData.frame_type ?? ""} onChange={handleEditChange}>
                        <option value="">Select frame type</option>
                        {FRAME_TYPE_OPTIONS.map((ft) => (
                          <option key={ft} value={ft}>{ft}</option>
                        ))}
                      </select>
                    </div>
                    <div className="skdash-form-group">
                      <label>Frame Material:</label>
                      <input type="text" name="frame_material" value={editData.frame_material ?? ""} onChange={handleEditChange} placeholder="e.g., Acetate, Metal" />
                    </div>
                  </div>

                  <div className="skdash-form-row" style={{ gridTemplateColumns: "1fr" }}>
                    <div className="skdash-form-group"><label>Small Description:</label><input type="text" name="small_description" value={editData.small_description || ""} onChange={handleEditChange}/></div>
                  </div>

                  <div className="skdash-form-row" style={{ gridTemplateColumns: "1fr" }}>
                    <div className="skdash-form-group"><label>Big Description:</label><textarea name="big_description" value={editData.big_description || ""} onChange={handleEditChange}></textarea></div>
                  </div>

                  <div className="skdash-form-row" style={{ gridTemplateColumns: "1fr 1fr", display: "grid", gap: 14 }}>
                    {[1,2,3,4].map((i) => {
                      const urlKey = `image${i}`;
                      const fileKey = `image${i}File`;
                      const removeKey = `remove_image${i}`;
                      return (
                        <div className="skdash-form-group" key={i}>
                          <label>{`Image ${i}:`}</label>
                          {editData[urlKey] ? (
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                              <img src={editData[urlKey]} alt={`image${i}`} style={{ width: 80, height: 60, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}/>
                              <label style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13 }}>
                                <input type="checkbox" name={removeKey} checked={!!editData[removeKey]} onChange={handleEditChange}/> Remove this image
                              </label>
                            </div>
                          ) : (
                            <div style={{ fontSize: 13, color: "#888" }}>No image set</div>
                          )}
                          <input type="file" name={fileKey} accept="image/*" onChange={handleEditChange} style={{ marginTop: 8 }}/>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="skdash-modal-footer">
                  <button type="submit" className="skdash-btn skdash-btn-primary">Save</button>
                  <button type="button" className="skdash-btn skdash-btn-ghost" onClick={() => setEditModal(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
