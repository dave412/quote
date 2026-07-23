// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { Button, Space, Row, Col, InputNumber, Drawer, Divider } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { PlusCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import Quote from './quote';
import PriceForm from '../components/priceForm';

const Home = () => {

  const [showInfo, setShowInfo] = useState({});
  const [partType, setPartType] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [cpuList, setCpuList] = useState([]);
  const [gpuList, setGpuList] = useState([]);
  const [motherboardList, setMotherboardList] = useState([]);
  const [memoryList, setMemoryList] = useState([]);
  const [hddList, setHddList] = useState([]);
  const [calculatePricesObj, setCalculatePrices] = useState({});

  const accessory_part = [
    {
      name: "CPU",
      list: cpuList
    },
    {
      name: "显卡",
      list: gpuList
    },
    {
      name: "主板",
      list: motherboardList
    },
    {
      name: "内存",
      list: memoryList
    },
    {
      name: "硬盘",
      list: hddList
    }
  ]

  const handleClick = (part) => {
    setPartType(part.name);
    setDrawerOpen(true);
  };

  const onSelectItem = (selectedType, selectedItem) => {
    console.log("selectedType", selectedType);
    console.log("selectedItem", selectedItem);
    if (selectedType && selectedType === "CPU" && Object.keys(selectedItem).length > 0) {
      setCpuList([selectedItem])
    }
    if (selectedType && selectedType === "显卡" && Object.keys(selectedItem).length > 0) {
      setGpuList([selectedItem])
    }
    if (selectedType && selectedType === "主板" && Object.keys(selectedItem).length > 0) {
      setMotherboardList([selectedItem])
    }
    if (selectedType && selectedType === "内存" && Object.keys(selectedItem).length > 0) {
      setMemoryList([...memoryList, selectedItem])
    }
    if (selectedType && selectedType === "硬盘" && Object.keys(selectedItem).length > 0) {
      setHddList([...hddList, selectedItem])
    }
    setDrawerOpen(false);
  };

  const onDeleteItem = (name, item) => {
    console.log("name", name);
    console.log("item", item);
  };

  const calculatePrices = (prices) => {
    console.log("prices", prices);
    setCalculatePrices(prices)
  }

  const allTables = [
    ...cpuList,
    ...gpuList,
    ...motherboardList,
    ...memoryList,
    ...hddList
  ]

  // 总售价
  const totalPrice = allTables.reduce((sum, item) => sum + parseInt(item.price), 0);
  // 总成本
  const totalCost = allTables.reduce((sum, item) => sum + parseInt(item.cost), 0);
  // 总利润
  const totalProfitPrice = allTables.reduce((sum, item) => sum + item.profitPrice, 0);

  return (
    <div style={{ padding: 0 }}>
      {
        accessory_part.map((part, index) =>
          <div key={index} style={{ marginBottom: 10, padding: 0, backgroundColor: '#f0f0f0', borderRadius: 8 }}>
            <Row style={{ backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 10 }}>
              <Col span={6} style={{ marginBottom: "0px" }}><div style={{ fontWeight: 600, height: '100%', lineHeight: '32px' }}>{part.name}</div></Col>
              <Col span={6} style={{ marginBottom: "0px" }}></Col>
              <Col span={6} style={{ marginBottom: "0px" }}></Col>
              <Col span={6} style={{ marginBottom: "0px" }}>
                <Button style={{ marginTop: "6px" }} size='small' type="primary" shape="round" icon={<PlusCircleOutlined />} onClick={() => handleClick(part)}>
                  选择
                </Button>
              </Col>
            </Row>
            {/* {
              part?.list?.map((item, index) => (
                <div key={index} className="item-row">
                  <span>{item.name}</span>&nbsp;&nbsp;
                  <span>成本价: {item.cost}</span>&nbsp;&nbsp;
                  <span style={{ width: "100px" }}>售价: {item.price}</span>&nbsp;&nbsp;
                  <span><InputNumber min={1} max={10} defaultValue={1} /></span>&nbsp;&nbsp;
                  {
                    part.name === "内存" || part.name === "硬盘" ? <span
                      style={{ cursor: 'pointer', color: 'red' }}
                      onClick={() => onDeleteItem(part.name, item)}
                    >
                      <CloseCircleOutlined />
                    </span> : null
                  }
                </div>
              ))
            } */}
            {
              part?.list?.length > 0 &&
              <PriceForm
                data={part.list}
              // calculatePrices={calculatePrices}
              />
            }
          </div>
        )
      }
      <Divider><Button onClick={() => window.location.reload()}>刷新/重置</Button></Divider>
      <Space>
        <Button type="primary">总售价: ¥ {totalPrice?.toLocaleString() || 0}</Button>
        <Button type="primary">总成本: ¥ {totalCost?.toLocaleString() || 0}</Button>
        <Button type="primary">总利润: ¥ {totalProfitPrice?.toLocaleString() || 0}</Button>
      </Space>
      <Drawer
        title="配件及价格"
        closable={{ 'aria-label': 'Close Button' }}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        size="large"
        destroyOnClose={true}
      >
        <Quote
          type={partType}
          onSelectItem={onSelectItem}
        />
      </Drawer>
    </div>
  );
};

export default Home;