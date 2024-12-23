import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'; // Import Tailwind CSS
import AppRouter from "@router/index.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter/>
  </StrictMode>,
)
