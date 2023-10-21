import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import WhatsAppLogin from "./pages/auth/WhatsAppLogin";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route path="auth/">
          <Route path="login/">
            <Route index element={<Login />} />
            <Route path="whatsapp/" element={<WhatsAppLogin />} />
          </Route>
        </Route>

        {/* <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="blogs" element={<Blogs />} />
          <Route path="contact" element={<Contact />} />
          <Route path="*" element={<NoPage />} />
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}
