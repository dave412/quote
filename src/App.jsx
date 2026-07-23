// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import { HomeOutlined, DollarOutlined, SettingOutlined } from '@ant-design/icons';
import Home from './pages/home';
// import Quote from './pages/quote';
// import PriceManager from './pages/priceManager';
import './App.css';

const { Header, Content, Footer } = Layout;

// 导航菜单组件
// const AppMenu = () => {
//   const location = useLocation();
  
//   const menuItems = [
//     {
//       key: '/',
//       icon: <HomeOutlined />,
//       label: <Link to="/">首页</Link>,
//     },
//     {
//       key: '/quote',
//       icon: <DollarOutlined />,
//       label: <Link to="/quote">报价单</Link>,
//     },
//     {
//       key: '/price-manager',
//       icon: <SettingOutlined />,
//       label: <Link to="/price-manager">价格管理</Link>,
//     },
//   ];

//   return (
//     <Menu
//       theme="dark"
//       mode="horizontal"
//       selectedKeys={[location.pathname]}
//       items={menuItems}
//       style={{ flex: 1, minWidth: 0 }}
//     />
//   );
// };

function App() {
  return (
    <BrowserRouter>
      <Layout className="app-layout">
        <Header style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ color: '#fff', fontSize: 18, fontWeight: 600, marginRight: 24 }}>
            报价系统
          </div>
        </Header>
        <Content style={{ padding: '0px', minHeight: 'calc(100vh - 134px)' }}>
          <div className="content-wrapper">
            <Routes>
              <Route path="/quote" element={<Home />} />
              {/* <Route path="/quote" element={<Quote />} />
              <Route path="/price-manager" element={<PriceManager />} /> */}
            </Routes>
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>
          舒凡的电脑报价系统 ©2026 Created by Dave
        </Footer>
      </Layout>
    </BrowserRouter>
  );
}

export default App;