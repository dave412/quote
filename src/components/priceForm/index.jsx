import React, {useState, useEffect, useMemo } from 'react';
import { Space, Select, Button, Form, Input, Checkbox, InputNumber, Table, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import './index.less'

const { Text } = Typography;
const { Option } = Select;

// 配件型号及对应成本价和售价映射表
const MODEL_PRICE_MAP = {
  'CPU': {
    'Intel Core i9-13900K': { costPrice: 3800, price: 4299 },
    'Intel Core i7-13700K': { costPrice: 2900, price: 3299 },
    'Intel Core i5-13600K': { costPrice: 2000, price: 2299 },
    'AMD Ryzen 9 7950X': { costPrice: 3500, price: 3999 },
    'AMD Ryzen 7 7800X3D': { costPrice: 2600, price: 2999 },
  },
  '显卡': {
    'NVIDIA GeForce RTX 4090': { costPrice: 14000, price: 15999 },
    'NVIDIA GeForce RTX 4080': { costPrice: 8300, price: 9499 },
    'NVIDIA GeForce RTX 4070 Ti': { costPrice: 5600, price: 6499 },
    'AMD Radeon RX 7900 XTX': { costPrice: 7000, price: 7999 },
    'AMD Radeon RX 7800 XT': { costPrice: 4300, price: 4999 },
  },
  '主板': {
    'ROG MAXIMUS Z790 HERO': { costPrice: 2800, price: 3199 },
    'ROG STRIX Z790-E': { costPrice: 2100, price: 2499 },
    'MSI MAG Z790 TOMAHAWK': { costPrice: 1500, price: 1799 },
    'GIGABYTE Z790 AORUS MASTER': { costPrice: 2500, price: 2899 },
    'ASUS TUF GAMING B760-PLUS': { costPrice: 1100, price: 1299 },
  },
  '内存': {
    'Kingston FURY 32GB DDR5 6000': { costPrice: 950, price: 1099 },
    'Corsair Vengeance 32GB DDR5 5600': { costPrice: 780, price: 899 },
    'G.Skill Trident Z5 32GB DDR5 6400': { costPrice: 1100, price: 1299 },
    'Crucial 16GB DDR5 4800': { costPrice: 420, price: 499 },
    'TeamGroup T-Force 32GB DDR5 6000': { cost: 850, price: 999 },
  },
  '固态硬盘': {
    'Samsung 990 PRO 2TB': { costPrice: 1380, price: 1599 },
    'Samsung 980 PRO 1TB': { costPrice: 780, price: 899 },
    'WD Black SN850X 2TB': { costPrice: 1280, price: 1499 },
    'Seagate FireCuda 530 1TB': { costPrice: 680, price: 799 },
    'Crucial P5 Plus 2TB': { costPrice: 1120, price: 1299 },
  },
  '机械硬盘': {
    'Seagate BarraCuda 2TB 7200RPM': { costPrice: 420, price: 499 },
    'WD Blue 4TB 5400RPM': { costPrice: 680, price: 799 },
    'Seagate IronWolf 6TB NAS': { costPrice: 1100, price: 1299 },
    'WD Black 2TB 7200RPM': { costPrice: 590, price: 699 },
    'Toshiba X300 4TB 7200RPM': { costPrice: 760, price: 899 },
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

// 所有配件名称选项（用于"配件名称"下拉框）
const COMPONENT_NAMES = ['CPU', '主板', '内存', '显卡', '固态硬盘', '机械硬盘'];

// 计算数量乘以单价
const calcTotal = (qty, price) => {
  const numQty = Number(qty) || 0;
  const numPrice = Number(price) || 0;
  return numQty * numPrice;
};

// 计算利润
const calcProfitPrice = (qty, price) => {
  const numQty = Number(qty) || 0;
  const numPrice = Number(price) || 0;
  return numQty - numPrice;
};

// 初始数据
const INITIAL_DATA = [
  { id: 1, name: 'CPU', quantity: 1 },
  { id: 2, name: '主板', quantity: 1 },
  { id: 3, name: '内存', quantity: 1 },
  { id: 4, name: '显卡', quantity: 1 },
  { id: 5, name: '固态硬盘', quantity: 1 },
  { id: 6, name: '机械硬盘', quantity: 1 },
];

const PriceForm = ({
  data,
  // calculatePrices
}) => {
  const [dataSource, setDataSource] = useState(data);
  // const [total_price, setTotalPrice] = useState(0);
  // const [cost_price, setCostPrice] = useState(0);
  // const [profit_price, setProfitPrice] = useState(0);

  // useEffect(() => {
  //   calculatePrices({
  //     totalQuantity,
  //     costPrice,
  //     profitPrice,
  //   })
  // }, [total_price, cost_price, profit_price]);

  // 计算总数量
  const totalQuantity = useMemo(() => {
    return dataSource.reduce((acc, row) => acc + (Number(row.quantity) || 0), 0);
  }, [dataSource]);

  // 计算总价
  const totalPrice = useMemo(() => {
    let total = dataSource.reduce((acc, row) => {
      return acc + calcTotal(row.quantity, row.price);
    }, 0);
    return total;
  }, [dataSource]);

  // 计算总成本
  const costPrice = useMemo(() => {
    let total = dataSource.reduce((acc, row) => {
      return acc + calcTotal(row.quantity, row.costprice);
    }, 0);
    return total;
  }, [dataSource]);

  // 计算总利润
  const profitPrice = useMemo(() => {
    let total = totalPrice - costPrice
    return total;
  }, [totalPrice, costPrice]);

  // 更新行数据
  const updateRow = (id, field, value) => {
    console.log("field", field)
    console.log("value", value)
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
            updatedRow.costPrice = priceData.costPrice;
            updatedRow.price = priceData.price;
          }
          
          // 如果修改了型号，自动填充对应的成本价和售价
          if (field === 'model') {
            const priceData = getPriceByModel(row.name, value);
            updatedRow.costPrice = priceData.costPrice;
            updatedRow.price = priceData.price;
          }
          
          return updatedRow;
        }
        return row;
      })
    );
  };

  // 表格列定义
  const columns = [
    {
      title: '型号',
      dataIndex: 'name',
      key: 'name',
      width: 100,
    },
    {
      title: '售价(¥)',
      dataIndex: 'price',
      key: 'price',
      width: 100,
      align: 'right',
    },
    {
      title: '成本(¥)',
      dataIndex: 'cost',
      key: 'cost',
      width: 100,
      align: 'right',
    },
    {
      title: '利润(¥)',
      key: 'profitPrice',
      width: 100,
      align: 'right',
      render: (_, record) => {
        const let_profitPrice = record.price - record.cost;
        return <span className="subtotal-text">{let_profitPrice.toLocaleString()}</span>;
      },
    },
    // {
    //   title: '数量',
    //   dataIndex: 'quantity',
    //   key: 'quantity',
    //   width: 80,
    //   align: 'center',
    //   render: (value, record) => (
    //     <InputNumber
    //       min={1}
    //       max={10}
    //       step={1}
    //       defaultValue={1}
    //       value={value}
    //       onChange={(val) => updateRow(record.id, 'quantity', val)}
    //       style={{ width: '100%', maxWidth: 100 }}
    //       controls
    //       precision={0}
    //     />
    //   ),
    // },
  ];
  
  // 表格底部汇总行
  const summary = () => {
    return (
      <Table.Summary fixed>
        <Table.Summary.Row className="total-row">
          <Table.Summary.Cell index={0} colSpan={2}>
            <span style={{ fontWeight: 600, fontSize: '16px' }}>总价</span>
          </Table.Summary.Cell>
          {/* 数量 */}
          <Table.Summary.Cell index={2} align="center">
            <span style={{ color: '#8c8c8c', fontSize: '13px' }}>
              {totalQuantity}
            </span>
          </Table.Summary.Cell>
          {/* 价格 */}
          <Table.Summary.Cell index={3} align="right">
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#cf1322' }}>
              ¥ {totalPrice.toLocaleString()}
            </span>
          </Table.Summary.Cell>
          {/* 成本价 */}
          <Table.Summary.Cell index={4} align="right">
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#cf1322' }}>
              ¥ {costPrice.toLocaleString()}
            </span>
          </Table.Summary.Cell>
          {/* 利润 */}
          <Table.Summary.Cell index={5} align="right">
            <span style={{ fontSize: '20px', fontWeight: 700, color: '#cf1322' }}>
              ¥ {profitPrice.toLocaleString()}
            </span>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      </Table.Summary>
    );
  };

  return (
  <div className='bj-form-container'>
    <Table
      dataSource={data}
      columns={columns}
      rowKey="id"
      pagination={false}
      bordered
      // summary={summary}
      size="small"
      className="quote-table"
    />
  </div>
  )
}

export default PriceForm;