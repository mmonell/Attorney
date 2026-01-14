import React from 'react';
    import '@radix-ui/themes/styles.css';
    import { Theme } from '@radix-ui/themes';
    import { ToastContainer } from 'react-toastify';
    import 'react-toastify/dist/ReactToastify.css';
    import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
    
    import Home from './src/pages/Home';
    import Services from './src/pages/Services';
    import Contact from './src/pages/Contact';
    import NotFound from './src/pages/NotFound';
    import Dashboard from './src/pages/Dashboard';
    import SecureMessages from './src/pages/SecureMessages';
    
    const App: React.FC = () => {
      return (
        <Theme appearance="inherit" radius="large" scaling="100%">
          <Router>
            <main className="min-h-screen font-sans">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/messages" element={<SecureMessages />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="dark"
              />
            </main>
          </Router>
        </Theme>
      );
    };
    
    export default App;