import { useState } from "react";
import { RouterProvider } from "react-router";
import { createRouter } from "./routes";

export default function App() {
  const [router] = useState(() => createRouter());
  return <RouterProvider router={router} />;
}
