// App.jsx
import React, { useState, useMemo } from 'react';
import { Table, InputNumber, Button, Typography, Select, Space } from 'antd';
import { PlusOutlined, DeleteOutlined, DollarOutlined } from '@ant-design/icons';
import './App.css';

const { Text } = Typography;
const { Option } = Select;

// 配件型号及对应成本价和售价映射表
const MODEL_PRICE_MAP = {
  'CPU': {
    'Intel Core i9-13900K': { cost: 3800, price: 4299 },
    'Intel Core i7-13700K': { cost: 2900, price: 3299 },
    'Intel Core i5-13600K': { cost: 2000, price: 2299 },
    'AMD Ryzen 9 7950X': { cost: 3500, price: 3999 },
    'AMD Ryzen 7 7800X3D': { cost: 2600, price: 2999 },
  },
  '显卡': {
    'NVIDIA GeForce RTX 4090': { cost: 14000, price: 15999 },
    'NVIDIA GeForce RTX 4080': { cost: 8300, price: 9499 },
    'NVIDIA GeForce RTX 4070 Ti': { cost: 5600, price: 6499 },
    'AMD Radeon RX 7900 XTX': { cost: 7000, price: 7999 },
    'AMD Radeon RX 7800 XT': { cost: 4300, price: 4999 },
  },
  '主板': {
    'ROG MAXIMUS Z790 HERO': { cost: 2800, price: 3199 },
    'ROG STRIX Z790-E': { cost: 2100, price: 2499 },
    'MSI MAG Z790 TOMAHAWK': { cost: 1500, price: 1799 },
    'GIGABYTE Z790 AORUS MASTER': { cost: 2500, price: 2899 },
    'ASUS TUF GAMING B760-PLUS': { cost: 1100, price: 1299 },
  },
  '内存': {
    'Kingston FURY 32GB DDR5 6000': { cost: 950, price: 1099 },
    'Corsair Vengeance 32GB DDR5 5600': { cost: 780, price: 899 },
    'G.Skill Trident Z5 32GB DDR5 6400': { cost: 1100, price: 1299 },
    'Crucial 16GB DDR5 4800': { cost: 420, price: 499 },
    'TeamGroup T-Force 32GB DDR5 6000': { cost: 850, price: 999 },
  },
  '固态硬盘': {
    'Samsung 990 PRO 2TB': { cost: 1380, price: 1599 },
    'Samsung 980 PRO 1TB': { cost: 780, price: 899 },
    'WD Black SN850X 2TB': { cost: 1280, price: 1499 },
    'Seagate FireCuda 530 1TB': { cost: 680, price: 799 },
    'Crucial P5 Plus 2TB': { cost: 1120, price: 1299 },
  },
  '机械硬盘': {
    'Seagate BarraCuda 2TB 7200RPM': { cost: 420, price: 499 },
    'WD Blue 4TB 5400RPM': { cost: 680, price: 799 },
    'Seagate IronWolf 6TB NAS': { cost: 1100, price: 1299 },
    'WD Black 2TB 7200RPM': { cost: 590, price: 699 },
    'Toshiba X300 4TB 7200RPM': { cost: 760, price: 899 },
  },
};

// 获取某个配件分类的所有型号列表
const getModelsByCategory = (category) => {
  return Object.keys(MODEL_PRICE_MAP[category] || {});
};

// 获取某个型号的成本价和售价
const getPriceByModel = (category, model) => {
  const data = MODEL_PRICE_MAP[category]?.[model];
  return data || { cost: 0, price: 0 };
};

// 所有配件名称选项
const COMPONENT_NAMES = Object.keys(MODEL_PRICE_MAP);

// 初始数据（包含成本价和售价）
const INITIAL_DATA = [
  { 
    id: 1, 
    name: 'CPU', 
    model: 'Intel Core i9-13900K', 
    quantity: 1, 
    cost: 3800, 
    price: 4299 
  },
  { 
    id: 2, 
    name: '主板', 
    model: 'ROG MAXIMUS Z790 HERO', 
    quantity: 1, 
    cost: 2800, 
    price: 3199 
  },
  { 
    id: 3, 
    name: '内存', 
    model: 'Kingston FURY 32GB DDR5 6000', 
    quantity: 2, 
    cost: 950, 
    price: 1099 
  },
  { 
    id: 4, 
    name: '显卡', 
    model: 'NVIDIA GeForce RTX 4080', 
    quantity: 1, 
    cost: 8300, 
    price: 9499 
  },
  { 
    id: 5, 
    name: '固态硬盘', 
    model: 'Samsung 990 PRO 2TB', 
    quantity: 1, 
    cost: 1380, 
    price: 1599 
  },
  { 
    id: 6, 
    name: '机械硬盘', 
    model: 'Seagate BarraCuda 2TB 7200RPM', 
    quantity: 1, 
    cost: 420, 
    price: 499 
  },
];

// 计算小计
const calcSubtotal = (qty, unitPrice) => {
  const numQty = Number(qty) || 0;
  const numPrice = Number(unitPrice) || 0;
  return numQty * numPrice;
};

const App = () => {
  const [dataSource, setDataSource] = useState(INITIAL_DATA);
  const [nextId, setNextId] = useState(100);

  // 计算总售价
  const totalPrice = useMemo(() => {
    return dataSource.reduce((acc, row) => {
      return acc + calcSubtotal(row.quantity, row.price);
    }, 0);
  }, [dataSource]);

  // 计算总成本
  const totalCost = useMemo(() => {
    return dataSource.reduce((acc, row) => {
      return acc + calcSubtotal(row.quantity, row.cost);
    }, 0);
  }, [dataSource]);

  // 计算总利润
  const totalProfit = useMemo(() => {
    return totalPrice - totalCost;
  }, [totalPrice, totalCost]);

  // 计算总数量
  const totalQuantity = useMemo(() => {
    return dataSource.reduce((acc, row) => acc + (Number(row.quantity) || 0), 0);
  }, [dataSource]);

  // 更新行数据
  const updateRow = (id, field, value) => {
    setDataSource((prev) =>
      prev.map((row) => {
        if (row.id === id) {
          const updatedRow = { ...row, [field]: value };
          
          // 如果修改了配件名称，自动重置型号、成本价和售价
          if (field === 'name') {
            const models = getModelsByCategory(value);
            const firstModel = models[0] || '';
            updatedRow.model = firstModel;
            // 自动填充成本价和售价
            const priceData = getPriceByModel(value, firstModel);
            updatedRow.cost = priceData.cost;
            updatedRow.price = priceData.price;
          }
          
          // 如果修改了型号，自动填充对应的成本价和售价
          if (field === 'model') {
            const priceData = getPriceByModel(row.name, value);
            updatedRow.cost = priceData.cost;
            updatedRow.price = priceData.price;
          }
          
          return updatedRow;
        }
        return row;
      })
    );
  };

  // 添加行
  const addRow = () => {
    const defaultCategory = 'CPU';
    const defaultModel = getModelsByCategory(defaultCategory)[0];
    const priceData = getPriceByModel(defaultCategory, defaultModel);
    const newRow = {
      id: nextId,
      name: defaultCategory,
      model: defaultModel,
      quantity: 1,
      cost: priceData.cost,
      price: priceData.price,
    };
    setNextId((prev) => prev + 1);
    setDataSource((prev) => [...prev, newRow]);
  };

  // 删除行
  const deleteRow = (id) => {
    if (dataSource.length <= 1) return;
    setDataSource((prev) => prev.filter((row) => row.id !== id));
  };

  // 表格列定义
  const columns = [
    {
      title: '配件名称',
      dataIndex: 'name',
      key: 'name',
      width: 130,
      render: (value, record) => (
        <Select
          value={value}
          onChange={(val) => updateRow(record.id, 'name', val)}
          style={{ width: '100%' }}
          placeholder="选择配件"
        >
          {COMPONENT_NAMES.map((name) => (
            <Option key={name} value={name}>
              {name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: '配件型号',
      dataIndex: 'model',
      key: 'model',
      width: 200,
      render: (value, record) => {
        const models = getModelsByCategory(record.name);
        return (
          <Select
            value={value}
            onChange={(val) => updateRow(record.id, 'model', val)}
            style={{ width: '100%' }}
            placeholder="选择型号"
          >
            {models.map((model) => (
              <Option key={model} value={model}>
                {model}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: '数量',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'center',
      render: (value, record) => (
        <InputNumber
          min={0}
          step={1}
          value={value}
          onChange={(val) => updateRow(record.id, 'quantity', val)}
          style={{ width: '100%', maxWidth: 80 }}
          controls
          precision={0}
          placeholder="数量"
        />
      ),
    },
    {
      title: '成本价 (¥)',
      dataIndex: 'cost',
      key: 'cost',
      width: 130,
      align: 'right',
      render: (value, record) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <span className="price-prefix">¥</span>
          <InputNumber
            min={0}
            step={10}
            value={value}
            onChange={(val) => updateRow(record.id, 'cost', val)}
            style={{ width: '100%', maxWidth: 120 }}
            controls
            precision={0}
            placeholder="成本价"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </div>
      ),
    },
    {
      title: '售价 (¥)',
      dataIndex: 'price',
      key: 'price',
      width: 130,
      align: 'right',
      render: (value, record) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <span className="price-prefix">¥</span>
          <InputNumber
            min={0}
            step={10}
            value={value}
            onChange={(val) => updateRow(record.id, 'price', val)}
            style={{ width: '100%', maxWidth: 120 }}
            controls
            precision={0}
            placeholder="售价"
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
          />
        </div>
      ),
    },
    {
      title: '利润 (¥)',
      key: 'profit',
      width: 120,
      align: 'right',
      render: (_, record) => {
        const profit = (Number(record.price) || 0) - (Number(record.cost) || 0);
        const profitPerUnit = profit * (Number(record.quantity) || 0);
        return (
          <span style={{ 
            color: profitPerUnit >= 0 ? '#3c8618' : '#cf1322',
            fontWeight: 600,
            fontSize: '14px'
          }}>
            ¥ {profitPerUnit.toLocaleString()}
          </span>
        );
      },
    },
    {
      title: '小计 (售价)',
      key: 'subtotal',
      width: 130,
      align: 'right',
      render: (_, record) => {
        const sub = calcSubtotal(record.quantity, record.price);
        return <span className="subtotal-text">¥ {sub.toLocaleString()}</span>;
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 70,
      align: 'center',
      render: (_, record) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => deleteRow(record.id)}
          disabled={dataSource.length <= 1}
          size="small"
        />
      ),
    },
  ];

  // 表格底部汇总行
  const summary = () => {
    return (
      <Table.Summary fixed>
        <Table.Summary.Row className="total-row">
          <Table.Summary.Cell index={0} colSpan={2}>
            <span style={{ fontWeight: 600, fontSize: '16px' }}>总计</span>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2} align="center">
            <span style={{ color: '#8c8c8c', fontSize: '13px' }}>
              共 {totalQuantity} 件
            </span>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={3} align="right">
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#fa541c' }}>
              ¥ {totalCost.toLocaleString()}
            </span>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={4} align="right">
            <span style={{ fontSize: '16px', fontWeight: 600, color: '#1677ff' }}>
              ¥ {totalPrice.toLocaleString()}
            </span>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={5} align="right">
            <span style={{ 
              fontSize: '18px', 
              fontWeight: 700, 
              color: totalProfit >= 0 ? '#3c8618' : '#cf1322'
            }}>
              ¥ {totalProfit.toLocaleString()}
            </span>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={6} align="right">
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#cf1322' }}>
              ¥ {totalPrice.toLocaleString()}
            </span>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={7} align="center" />
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
    <div className="quote-container">
      <div className="quote-header">
        <div className="quote-title">
          <DollarOutlined style={{ color: '#1677ff' }} />
          电脑配件报价单
          <small>选择型号自动填充成本价和售价</small>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={addRow}>
          添加配件
        </Button>
      </div>

      <Table
        dataSource={dataSource}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered
        summary={summary}
        size="middle"
        className="quote-table"
        scroll={{ x: 1200 }}
      />
      
      <div style={{ marginTop: 16, color: '#8c8c8c', fontSize: '13px', textAlign: 'right' }}>
        * 选择配件型号后，成本价和售价会自动填充，您也可以手动修改
      </div>
    </div>
  );
};

export default App;