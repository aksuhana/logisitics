// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, Select } from 'antd';
import moment from 'moment';
import './HomePage.css';
import DataGrid from '../components/DataGrid';

const { Option } = Select;

const HomePage = () => {
    const [formData, setFormData] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [form] = Form.useForm();

    // Generate 1000 sample records on component mount
    useEffect(() => {
        const generateSampleData = () => {
            const data = Array.from({ length: 40 }, (_, i) => ({
                key: i + 1,
                vehicleNo: `VEH${String(i + 1).padStart(3, '0')}`,
                date: `2023-${String((i % 12) + 1).padStart(2, '0')}-01`,
                from: `City ${String.fromCharCode(65 + (i % 26))}`,
                to: `City ${String.fromCharCode(90 - (i % 26))}`,
                dealAmount: Math.floor(Math.random() * 5000) + 500,
                advance: Math.floor(Math.random() * 300) + 100,
                balance: Math.floor(Math.random() * 4500) + 500,
                diesel: `${Math.floor(Math.random() * 100) + 10} Ltr`,
                driverAdvance: Math.floor(Math.random() * 300) + 50,
                commission: Math.floor(Math.random() * 200) + 50,
                otherAmount: Math.floor(Math.random() * 100) + 10
            }));
            setFormData(data);
        };

        generateSampleData();
    }, []);

    const onFinish = (values) => {
        const formattedData = {
            ...values,
            date: values.date ? values.date.format("YYYY-MM-DD") : '',
            key: formData.length + 1,
            balance: values.dealAmount - (values.advance || 0),
        };
        
        setFormData((prevData) => [...prevData, formattedData]);
        form.resetFields();  // Reset form fields after submit
    };

    const handleSearchEnter = (e) => {
        if (e.key === 'Enter') {
            let vehicleNo = e.target.value;
    
            // Check if the input does not start with "HR", and prepend "HR" if needed
            if (!vehicleNo.startsWith("HR")) {
                vehicleNo = `HR${vehicleNo}`;
            }
    
            form.setFieldsValue({
                vehicleNo: vehicleNo,
                date: moment(), // Set the current date
                from: "Delhi"
            });
    
            setFilterValue(e.target.value); // Update filter value in state
        }
    };
    const updateBalance = () => {
        const dealAmount = parseFloat(form.getFieldValue('dealAmount')) || 0;
        const advance = parseFloat(form.getFieldValue('advance')) || 0;
        const calculatedBalance = dealAmount - advance;
        form.setFieldsValue({ balance: calculatedBalance });
    };

    const onDataChange = (updatedData) => {
        setFormData(updatedData); // Update the data in the state when it changes in DataGrid
    };
    return (
        <>
        <div className="home-container">
            <Input
                placeholder="Enter Vehicle Number"
                style={{ marginBottom: '20px', width: '100%' }}
                onChange={(e) => setFilterValue(e.target.value)}
                onKeyDown={handleSearchEnter}  // Add onKeyDown to listen for Enter
                value={filterValue}
            />

            {/* Unified Form */}
            <Form form={form} layout="inline" onFinish={onFinish} className="one-row-form">
                <div className="form-section">
                    <div className="header-row">
                        <span>Vehicle No</span>
                        <span>Date</span>
                        <span>From</span>
                        <span>To</span>
                        <span>Deal Amount</span>
                        <span>Advance</span>
                    </div>
                    <Form.Item name="vehicleNo"
                    rules={[{ required: true, message: 'Please enter the vehicle number!' }]}
                    >
                        <Input placeholder="Vehicle No" />
                        
                    </Form.Item>
                    <Form.Item name="date"
                     rules={[{ required: true, message: 'Please enter start date!' }]}>
                        <DatePicker placeholder="Date" style={{ width: '150px' }} />
                    </Form.Item>
                    <Form.Item name="from"
                     rules={[{ required: true, message: 'Please enter Source Place!' }]}
                    >
                        <Input placeholder="From" />
                    </Form.Item>
                    <Form.Item name="to"
                     rules={[{ required: true, message: 'Please enter destination!' }]}
                    >
                        <Input placeholder="To" />
                    </Form.Item>
                    <Form.Item name="dealAmount"
                     rules={[{ required: true, message: 'Please enter deal amount!' }]}
                    >
                        <Input placeholder="Deal Amount" onChange={updateBalance} />
                    </Form.Item>
                    <Form.Item name="advance">
                        <Input placeholder="Advance" onChange={updateBalance} />
                    </Form.Item>

                    <div className="header-row">
                        <span>Balance</span>
                        <span>Diesel</span>
                        <span>Driver Advance</span>
                        <span>Commission</span>
                        <span>Other Amount</span>
                    </div>

                    <Form.Item name="balance">
                        <Input placeholder="Balance" readOnly />
                    </Form.Item>
                    <Form.Item name="diesel">
                        <Input placeholder="Diesel" />
                    </Form.Item>
                    <Form.Item name="driverAdvance">
                        <Input placeholder="Driver Advance" />
                    </Form.Item>
                    <Form.Item name="commission">
                        <Input placeholder="Commission" />
                    </Form.Item>
                    <Form.Item name="otherAmount">
                        <Input placeholder="Other Amount" />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="cta-button">
                            Save
                        </Button>
                    </Form.Item>
                </div>
            </Form>

            {/* Filter Section */}
            <div className="filter-section">
                <Select
                    placeholder="Select Year"
                    style={{ width: 120 }}
                    onChange={setSelectedYear}
                    value={selectedYear || undefined}
                    allowClear
                >
                    {['2022', '2023', '2024', '2025', '2026'].map(year => (
                        <Option key={year} value={year}>{year}</Option>
                    ))}
                </Select>

                <Select
                    placeholder="Select Month"
                    style={{ width: 120 }}
                    onChange={setSelectedMonth}
                    value={selectedMonth || undefined}
                    allowClear
                >
                    {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map(month => (
                        <Option key={month} value={month}>{month}</Option>
                    ))}
                </Select>
            </div>

            {/* Data Grid Component */}
            
        </div>
        <div>

        <DataGrid
                data={formData}
                onDataChange={onDataChange} // Pass onDataChange to DataGrid
                filterValue={filterValue}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
            />
            </div>
        </>
    );
};

export default HomePage;
