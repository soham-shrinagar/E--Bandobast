// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'
// import { GoogleOAuthProvider } from '@react-oauth/google'

// const CLIENT_ID = "924380481838-c077mfi5h1kgap6kpq9kj575j9s054v3.apps.googleusercontent.com";


// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <GoogleOAuthProvider clientId={CLIENT_ID}>
//       <App />
//     </GoogleOAuthProvider>

//   </StrictMode>,
// )

// main.tsx (updated)-------
// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import { BrowserRouter } from 'react-router-dom'
// import './index.css'
// import App from './App.tsx'
// import { GoogleOAuthProvider } from '@react-oauth/google'

// const CLIENT_ID = "924380481838-c077mfi5h1kgap6kpq9kj575j9s054v3.apps.googleusercontent.com";

// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <GoogleOAuthProvider clientId={CLIENT_ID}>
//       <BrowserRouter>
//         <App />
//       </BrowserRouter>
//     </GoogleOAuthProvider>
//   </StrictMode>,
// )

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
