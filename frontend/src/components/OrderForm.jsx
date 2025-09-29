import { useState } from "react";

export default function OrderForm() {
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    contactNumber: "",
    shippingAddress: "",
    productName: "",
    quantity: 1
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState({ ok: false, msg: "" });
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    const nameOk = form.customerName.trim().length >= 3 && form.customerName.trim().length <= 30;
    const emailOk = /\S+@\S+\.\S+/.test(form.email);
    const phoneOk = /^\d{10}$/.test(form.contactNumber);
    const addrOk = form.shippingAddress.trim().length > 0 && form.shippingAddress.trim().length <= 100;
    const prodOk = form.productName.trim().length >= 3 && form.productName.trim().length <= 50;
    const qtyOk = Number(form.quantity) >= 1 && Number(form.quantity) <= 100;
    if (!nameOk) return "Customer Name must be 3–30 chars";
    if (!emailOk) return "Invalid email";
    if (!phoneOk) return "Contact Number must be 10 digits";
    if (!addrOk) return "Address max 100 chars";
    if (!prodOk) return "Product Name 3–50 chars";
    if (!qtyOk) return "Quantity 1–100";
    if (file) {
      const allowed = ["image/jpeg", "image/png"];
      if (!allowed.includes(file.type)) return "Only JPG/PNG allowed";
      if (file.size > 2 * 1024 * 1024) return "Max 2MB image";
    }
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) return setStatus({ ok: false, msg: err });

    try {
      setLoading(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (file) fd.append("productImage", file);

      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/orders`, {
        method: "POST",
        body: fd
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.errors?.[0]?.msg || data?.message || "Failed to submit");

      setStatus({ ok: true, msg: "Order placed successfully!" });
      setForm({ customerName: "", email: "", contactNumber: "", shippingAddress: "", productName: "", quantity: 1 });
      setFile(null);
    } catch (e2) {
      setStatus({ ok: false, msg: e2.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="bg-white p-4 rounded-lg shadow space-y-3">
      <div className="grid md:grid-cols-2 gap-3">
        <input className="input" name="customerName" placeholder="Customer Name" value={form.customerName} onChange={onChange}/>
        <input className="input" name="email" placeholder="Email" value={form.email} onChange={onChange}/>
        <input className="input" name="contactNumber" placeholder="Contact Number (10 digits)" value={form.contactNumber} onChange={onChange}/>
        <input className="input" name="productName" placeholder="Product Name" value={form.productName} onChange={onChange}/>
        <input className="input" type="number" name="quantity" placeholder="Quantity" value={form.quantity} onChange={onChange}/>
      </div>
      <textarea className="input" name="shippingAddress" placeholder="Shipping Address" rows={3} value={form.shippingAddress} onChange={onChange}/>
      <input type="file" accept=".jpg,.jpeg,.png" onChange={(e)=>setFile(e.target.files[0])} />
      <button disabled={loading} className="px-4 py-2 rounded bg-black text-white">
        {loading ? "Submitting..." : "Place Order"}
      </button>
      {status.msg && (
        <p className={`${status.ok ? "text-green-600" : "text-red-600"} text-sm`}>{status.msg}</p>
      )}

      {/* Tailwind helper */}
      <style>{`.input{ @apply border rounded px-3 py-2 w-full; }`}</style>
    </form>
  );
}
