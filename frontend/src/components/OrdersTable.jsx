import { useDispatch, useSelector } from "react-redux";
import { deleteOrder, fetchOrders, updateQuantity, setFilters } from "../features/ordersSlice";
import { useEffect, useState } from "react";


export default function OrdersTable() {
  const dispatch = useDispatch();
  const { list, loading, error, filters } = useSelector(s => s.orders);
  const [edit, setEdit] = useState({ id: null, value: 1 });

  useEffect(() => { dispatch(fetchOrders(filters)); }, [dispatch, filters]);

  const applyFilters = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    dispatch(setFilters({
      productName: fd.get("productName") || "",
      startDate: fd.get("startDate") || "",
      endDate: fd.get("endDate") || ""
    }));
  };

  const startEdit = (o) => setEdit({ id: o._id, value: o.quantity });
  const saveEdit = (id) => { dispatch(updateQuantity({ id, quantity: Number(edit.value) })); setEdit({ id: null, value: 1 }); };

  return (
    <div className="space-y-3">
      <form onSubmit={applyFilters} className="flex flex-wrap gap-2 items-end">
        <div>
          <label className="block text-xs text-gray-600">Product</label>
          <input name="productName" defaultValue={filters.productName} className="border rounded px-2 py-1"/>
        </div>
        <div>
          <label className="block text-xs text-gray-600">Start Date</label>
          <input type="date" name="startDate" defaultValue={filters.startDate} className="border rounded px-2 py-1"/>
        </div>
        <div>
          <label className="block text-xs text-gray-600">End Date</label>
          <input type="date" name="endDate" defaultValue={filters.endDate} className="border rounded px-2 py-1"/>
        </div>
        <button className="px-3 py-2 bg-gray-900 text-white rounded">Filter</button>
      </form>

      <div className="overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">Date</th>
              <th className="px-3 py-2 text-left">Customer</th>
              <th className="px-3 py-2 text-left">Contact</th>
              <th className="px-3 py-2 text-left">Product</th>
              <th className="px-3 py-2 text-left">Qty</th>
              <th className="px-3 py-2 text-left">Image</th>
              <th className="px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan="7" className="px-3 py-6 text-center">Loading...</td></tr>}
            {error && <tr><td colSpan="7" className="px-3 py-6 text-center text-red-600">{error}</td></tr>}
            {!loading && list.length === 0 && <tr><td colSpan="7" className="px-3 py-6 text-center text-gray-500">No orders</td></tr>}

            {list.map(o => (
              <tr key={o._id} className="border-t">
                <td className="px-3 py-2">{new Date(o.createdAt).toLocaleString()}</td>
                <td className="px-3 py-2">{o.customerName} <div className="text-xs text-gray-500">{o.email}</div></td>
                <td className="px-3 py-2">{o.contactNumber}<div className="text-xs text-gray-500">{o.shippingAddress}</div></td>
                <td className="px-3 py-2">{o.productName}</td>
                <td className="px-3 py-2">
                  {edit.id === o._id ? (
                    <div className="flex items-center gap-2">
                      <input type="number" min="1" max="100" value={edit.value} onChange={(e)=>setEdit({...edit, value:e.target.value})} className="border rounded px-2 py-1 w-20"/>
                      <button type="button" onClick={()=>saveEdit(o._id)} className="text-white bg-green-600 px-2 py-1 rounded">Save</button>
                      <button type="button" onClick={()=>setEdit({id:null,value:1})} className="text-gray-700 px-2 py-1">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>{o.quantity}</span>
                      <button type="button" onClick={()=>startEdit(o)} className="text-blue-600">Edit</button>
                    </div>
                  )}
                </td>
                <td className="px-3 py-2">
                  {o.productImageUrl ? (
                    <img src={`${import.meta.env.VITE_API_URL?.replace('/api','') || 'http://localhost:5000' }${o.productImageUrl}`} alt="product" className="w-16 h-16 object-cover rounded"/>
                  ) : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-3 py-2 text-center">
                  <button onClick={()=>dispatch(deleteOrder(o._id))} className="text-white bg-red-600 px-2 py-1 rounded">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
