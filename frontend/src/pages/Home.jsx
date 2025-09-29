import OrderForm from "../components/OrderForm";

export default function Home() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Place Your Order</h1>
      <OrderForm />
      <p className="text-xs text-gray-500">
        * Your image is limited to 2MB and must be JPG/PNG.
      </p>
    </div>
  );
}
