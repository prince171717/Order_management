import { useEffect } from "react";
import { useDispatch } from "react-redux";
import OrdersTable from "../components/OrdersTable";
import { addOrderRealtime, updateOrderRealtime, deleteOrderRealtime } from "../features/ordersSlice";
import io from "socket.io-client";
import { useSelector } from "react-redux";
import { logout } from "../features/authSlice";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { token } = useSelector(s => s.auth);

  useEffect(() => {
    const socket = io(import.meta.env.VITE_API_URL?.replace("/api","") || "http://localhost:5000", {
      transports: ["websocket"]
    });

    socket.on("order:new", (order) => dispatch(addOrderRealtime(order)));
    socket.on("order:updated", (order) => dispatch(updateOrderRealtime(order)));
    socket.on("order:deleted", ({ id }) => dispatch(deleteOrderRealtime(id)));

    return () => socket.disconnect();
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        {token && <button className="px-3 py-2 rounded bg-gray-800 text-white" onClick={()=>dispatch(logout())}>Logout</button>}
      </div>
      <OrdersTable />
    </div>
  );
}
