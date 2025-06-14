import React from "react";
import { Routes, Route } from "react-router-dom";
import TabsContainer from "./components/Tabs/TabsContainer";
import "./App.css";

// Демонстраційні компоненти для різних сторінок
const HomePage = () => <div className="page-content">Головна сторінка</div>;
const AboutPage = () => <div className="page-content">Про нас</div>;
const ContactPage = () => <div className="page-content">Контакти</div>;
const ServicesPage = () => <div className="page-content">Послуги</div>;
const BlogPage = () => <div className="page-content">Блог</div>;

function App() {
  return (
    <div className="app">
      <TabsContainer />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/blog" element={<BlogPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
