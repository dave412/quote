// src/pages/Quote.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { Table, InputNumber, Button, Typography, Space, Modal, Form, Input, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined, DollarOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const { Text } = Typography;

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const INITIAL_CATEGORIES = {
  CPU: {
    id: 'cpu',
    name: 'CPU',
    options: [
      { id: '1', name: 'Intel i5-12400', cost: 1200, price: 1500 },
      { id: '2', name: 'Intel i7-12700', cost: 2200, price: 2600 },
      { id: '3', name: 'AMD Ryzen 5 5600X', cost: 1300, price: 1600 },
      { id: '4', name: 'AMD Ryzen 7 5800X', cost: 1900, price: 2300 },
    ],
  },
  显卡: {
    id: 'gpu',
    name: '显卡',
    options: [
      { id: '1', name: 'RTX 3060 12G', cost: 2300, price: 2800 },
      { id: '2', name: 'RTX 4060 8G', cost: 2800, price: 3300 },
      { id: '3', name: 'RTX 4070 12G', cost: 4200, price: 4800 },
    ],
  },
  主板: {
    id: 'motherboard',
    name: '主板',
    options: [
      { id: '1', name: 'B660M 丐版', cost: 600, price: 750 },
      { id: '2', name: 'B760M 主流', cost: 850, price: 1050 },
      { id: '3', name: 'Z790 高端', cost: 1600, price: 1900 },
    ],
  },
  内存: {
    name: '内存',
    options: [
      { id: '1', name: 'DDR4 16G (8G*2)', cost: 350, price: 450 },
      { id: '2', name: 'DDR4 32G (16G*2)', cost: 650, price: 800 },
      { id: '3', name: 'DDR5 16G (8G*2)', cost: 450, price: 550 },
      { id: '4', name: 'DDR5 32G (16G*2)', cost: 800, price: 980 },
    ],
  },
  固态: {
    name: '固态',
    options: [
      { id: '1', name: '512G NVMe', cost: 280, price: 360 },
      { id: '2', name: '1T NVMe', cost: 450, price: 580 },
      { id: '3', name: '2T NVMe', cost: 780, price: 980 },
    ],
  },
}

const Quote = ({
  type,
  onSelectItem,
}) => {
  const modelPriceList = localStorage.getItem(type);
  const parsedModelPriceList = modelPriceList ? JSON.parse(modelPriceList) : [];

  const [form] = Form.useForm();

  const [modalVisible, setVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editItem, setEditItem] = useState({});
  const [priceInfo, setPriceInfo] = useState(parsedModelPriceList);

  const addPartAndPrice = () => {
    setIsEdit(false);
    setVisible(true);
  }

  const handleAddSubmit = () => {
    if (isEdit) {
      form.validateFields().then(values => {
        const typePrice = priceInfo
        typePrice.find(item => item.id === editItem.id).name = values.name;
        typePrice.find(item => item.id === editItem.id).cost = values.cost;
        typePrice.find(item => item.id === editItem.id).price = values.price;
        typePrice.find(item => item.id === editItem.id).profitPrice = values.price - values.cost;
        localStorage.setItem(type, JSON.stringify(typePrice));
        setPriceInfo(typePrice)
        setVisible(false);
        form.resetFields();
      });
    } else {
      form.validateFields().then(values => {
        const timestamp = Math.floor(Date.now() / 1000);
        const typePrice = priceInfo
        typePrice.push({
          id: timestamp,
          name: values.name,
          cost: values.cost,
          price: values.price,
          profitPrice: values.price - values.cost,
        })
        localStorage.setItem(type, JSON.stringify(typePrice));
        setPriceInfo(typePrice)
        setVisible(false);
        form.resetFields();
      });
    }
  };

  const handleDelete = (item) => {
    const typePrice = priceInfo.filter(i => i.id !== item.id);
    localStorage.setItem(type, JSON.stringify(typePrice));
    setPriceInfo(typePrice)
  }

  const handleCancel = () => {
    setVisible(false);
  };

  const handleEdit = (item) => {
    setIsEdit(true);
    setEditItem(item);
    form.setFieldsValue(item);
    setVisible(true);
  };

  const handleSelect = (item) => {
    onSelectItem(type, item);
  };

  return (
    <div className="quote-container">
      <div style={{ marginBottom: 16 }}>
        <span style={{ marginLeft: 16, fontSize: 18, fontWeight: 600 }}>添加{type}型号、售价、成本价</span>
      </div>
      <Button style={{ marginBottom: '10px' }} onClick={addPartAndPrice}>
        点击添加
      </Button>
      {
        priceInfo.length > 0 && priceInfo.map((item, index) => (
          <Row key={item.id} style={{ backgroundColor: '#f0f0f0', borderRadius: 8, marginBottom: 10 }}>
            <Col span={6}>{item.name}</Col>
            <Col span={6}>成本价: {item.cost}</Col>
            <Col span={6}>售价: {item.price}</Col>
            <Col span={6}>
              <span style={{ color: 'blue', cursor: 'pointer', marginRight: 10 }} onClick={() => handleEdit(item)}>改价</span>
              <span style={{ color: 'blue', cursor: 'pointer', marginRight: 10 }} onClick={() => handleSelect(item)}>选择</span>
              <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleDelete(item)}><CloseCircleOutlined /></span>
            </Col>
          </Row>
        ))
      }
      <Modal
        title={`${isEdit && "修改" || "添加"}${type}型号及价格`}
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={modalVisible}
        onOk={handleAddSubmit}
        onCancel={handleCancel}
        okText="确定"
        cancelText="取消"
      >
        <Form
          {...layout}
          form={form}
          name="control-hooks"
          onFinish={handleAddSubmit}
          style={{ maxWidth: 600 }}
        >
          <Form.Item name="name" label={`${type}型号`} rules={[{ required: true, message: `请输入${type}型号` }]}>
            <Input />
          </Form.Item>
          <Form.Item name="cost" label="成本价" rules={[{ required: true, message: `请输入成本价` }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="售价" rules={[{ required: true, message: `请输入售价` }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Quote;