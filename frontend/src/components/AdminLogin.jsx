import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { adminLogin } from "../features/authSlice";
import { Navigate, useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { token, loading, error } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (token) return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    const res = await dispatch(adminLogin(form));
    if (res.meta.requestStatus === "fulfilled") navigate("/admin");
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-lg font-semibold mb-4">Admin Login</h2>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
        <input className="input" placeholder="Password" type="password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/>
        <button disabled={loading} className="px-4 py-2 bg-black text-white rounded">{loading?"Logging in...":"Login"}</button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
      <style>{`.input{@apply border rounded px-3 py-2 w-full;}`}</style>
    </div>
  );
}
