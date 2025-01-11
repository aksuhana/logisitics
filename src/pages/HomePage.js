// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { Form, Input, DatePicker, Button, Select, InputNumber } from 'antd';
import moment from 'moment';
import './HomePage.css';
import DataGrid from '../components/DataGrid';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase-config"; // Firebase setup file

const { Option } = Select;

const HomePage = () => {
    const [formData, setFormData] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [form] = Form.useForm();
    const [driverSalary, setDriverSalary] = useState(0);
    const [tollAmount, setTollAmount] = useState(0);
    const [monthlyProfitLoss, setMonthlyProfitLoss] = useState(0);

    // Generate 1000 sample records on component mount
    // useEffect(() => {
    //     const generateSampleData = () => {
    //         const data = Array.from({ length: 5000 }, (_, i) => ({
    //             key: i + 1,
    //             vehicleNo: `HR55AM283${i+1}`,
    //             date: i < 4 ? `2023-04-01` : `2023-04-0${i + 1}`,  // Same date for first 4, different for others
    //             from: i < 4 ? `City A` : `City ${String.fromCharCode(65 + (i % 26))}`, // Same from city for first 4
    //             to: i < 4 ? `City Z` : `City ${String.fromCharCode(90 - (i % 26))}`,   // Same to city for first 4
    //             dealAmount: Math.floor(Math.random() * 5000) + 500,
    //             advance: Math.floor(Math.random() * 300) + 100,
    //             balance: Math.floor(Math.random() * 4500) + 500,
    //             diesel: Math.floor(Math.random() * 100) + 10,
    //             driverAdvance: Math.floor(Math.random() * 300) + 50,
    //             commission: Math.floor(Math.random() * 200) + 50,
    //             otherAmount: Math.floor(Math.random() * 100) + 10
    //         }));
            
    //         console.log(data);
            
    //         setFormData(data);
    //     };

    //     generateSampleData();
    // }, []);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "journeys")); // Replace with your collection name
                const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

                setFormData(data); // Update state with fetched data
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const onFinish = async (values) => {
        const formattedData = {
            vehicleNo: values.vehicleNo,
            journeyDate: values.journeyDate.format("YYYY-MM-DD"),
            sourceLocation: values.sourceLocation,
            destinationLocation: values.destinationLocation,
            dealAmount: parseFloat(values.dealAmount),
            advancedAmount: parseFloat(values.advancedAmount) || 0,
            arrears: parseFloat(values.dealAmount || 0) - parseFloat(values.advancedAmount || 0),
            dieselAmount: parseFloat(values.dieselAmount) || 0,
            driverAdvanceAmount: parseFloat(values.driverAdvanceAmount) || 0,
            commissionAmount: parseFloat(values.commissionAmount) || 0,
            otherAmount: parseFloat(values.otherAmount) || 0,
        };

        try {
            const docRef = await addDoc(collection(db, "journeys"), formattedData); // Replace with your collection name
            setFormData((prevData) => [...prevData, { id: docRef.id, ...formattedData }]); // Append new data
            form.resetFields(); // Reset form fields after submission
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };
    useEffect(() => {
        const fetchMonthlySummary = async () => {
            if (!selectedYear || !selectedMonth) {
                return;
            }

            try {
                const q = query(
                    collection(db, "monthlySummaries"),
                    where("year", "==", parseInt(selectedYear)),
                    where("month", "==", parseInt(selectedMonth))
                );

                const querySnapshot = await getDocs(q);

                if (!querySnapshot.empty) {
                    // Extract the data from the document
                    const summaryData = querySnapshot.docs[0].data();
                    setDriverSalary(summaryData.driverSalary || 0);
                    setTollAmount(summaryData.tollAmount || 0);
                } else {
                    // Reset values if no data is found
                    setDriverSalary(0);
                    setTollAmount(0);
                }
            } catch (error) {
                console.error("Error fetching monthly summary:", error);
            }
        };

        fetchMonthlySummary();
    }, [selectedYear, selectedMonth]);

    const saveMonthlySummary = async () => {
        if (!selectedYear || !selectedMonth) {
            alert("Please select a valid year and month!");
            return;
        }
    
        const summaryData = {
            year: parseInt(selectedYear),
            month: parseInt(selectedMonth),
            date: moment().format("YYYY-MM-DD"), // Current date
            driverSalary,
            tollAmount,
            profitLoss: monthlyProfitLoss, // Use calculated profit/loss
        };
    
        try {
            const monthlySummaryCollection = collection(db, "monthlySummaries");
            const q = query(
                monthlySummaryCollection,
                where("year", "==", parseInt(selectedYear)),
                where("month", "==", parseInt(selectedMonth))
            );
    
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                // Update the existing document
                const existingDocId = querySnapshot.docs[0].id;
                const docRef = doc(db, "monthlySummaries", existingDocId);
                await updateDoc(docRef, summaryData);
                alert("Monthly summary updated successfully!");
                console.log("Updated monthly summary:", summaryData);
            } else {
                // Create a new document
                const newDocRef = await addDoc(monthlySummaryCollection, summaryData);
                alert("Monthly summary saved successfully!");
                console.log("Saved new monthly summary:", summaryData, "Document ID:", newDocRef.id);
            }
        } catch (error) {
            console.error("Error saving monthly summary:", error);
            alert("Error saving data. Please try again.");
        }
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
        const advancedAmount = parseFloat(form.getFieldValue('advancedAmount')) || 0;
        const calculatedBalance = dealAmount - advancedAmount;
        form.setFieldsValue({ arrears: calculatedBalance });
    };

    const onDataChange = (updatedData) => {
        setFormData(updatedData); // Update the data in the state when it changes in DataGrid
    };
       // Filter data for the selected month and year
       const getFilteredData = () => {
        return formData.filter(item => {
            const itemDate = moment(item.journeyDate);
            return itemDate.year() === parseInt(selectedYear) && itemDate.month() + 1 === parseInt(selectedMonth);
        });
    };

    // Calculate monthly profit/loss based on balance and total spent for each record
    const calculateMonthlyProfitLoss = () => {
        const filteredData = formData.filter(item => {
            const itemDate = moment(item.journeyDate);
            return itemDate.year() === parseInt(selectedYear) && itemDate.month() + 1 === parseInt(selectedMonth);
        });

        const totalProfitLoss = filteredData.reduce((acc, item) => {
            const totalSpent = (item.dieselAmount || 0) + (item.driverAdvanceAmount || 0) + (item.commissionAmount || 0) + (item.otherAmount || 0);
            
            // Updated logic based on balance status
            const profitLoss = item.arrears === 0
                ? item.dealAmount - totalSpent
                : (item.advancedAmount ?? 0) - totalSpent;

            return acc + profitLoss;
        }, 0);

        // Deduct driver salary and toll amount from the total monthly profit/loss
        const netProfitLoss = totalProfitLoss - driverSalary - tollAmount;
        setMonthlyProfitLoss(netProfitLoss);
    };

    useEffect(() => {
        if (selectedYear && selectedMonth) {
            calculateMonthlyProfitLoss();
        }
    }, [selectedYear, selectedMonth, driverSalary, tollAmount, formData]);
    return (
        <>
        <div className="home-container">
            <Input
                placeholder="Enter Vehicle Number"
                style={{ marginBottom: '20px', width: '40%' }}
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
                    rules={[{ required: true, message: 'Please enter the vehicle number!' },
                        {
                            pattern: /^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{1,4}$/,
                            message: 'Please enter a valid vehicle number (e.g., MH12AB1234)!',
                        },
                    ]}
                    >
                        <Input placeholder="Vehicle No" />
                        
                    </Form.Item>
                    <Form.Item name="journeyDate"
                     rules={[{ required: true, message: 'Please enter start date!' }]}>
                        <DatePicker placeholder="Date" style={{ width: '150px' }} />
                    </Form.Item>
                    <Form.Item name="sourceLocation"
                     rules={[{ required: true, message: 'Please enter Source Place!' }]}
                    >
                        <Input placeholder="From" />
                    </Form.Item>
                    <Form.Item name="destinationLocation"
                     rules={[{ required: true, message: 'Please enter destination!' }]}
                    >
                        <Input placeholder="To" />
                    </Form.Item>
                    <Form.Item name="dealAmount"
                     rules={[{ required: true, message: 'Please enter deal amount!' }]}
                    >
                        <Input placeholder="Deal Amount" onChange={updateBalance} />
                    </Form.Item>
                    <Form.Item name="advancedAmount">
                        <Input placeholder="Advance" onChange={updateBalance} />
                    </Form.Item>

                    <div className="header-row">
                        <span>Balance</span>
                        <span>Diesel</span>
                        <span>Driver Advance</span>
                        <span>Commission</span>
                        <span>Other Amount</span>
                    </div>

                    <Form.Item name="arrears">
                        <Input placeholder="Balance" readOnly />
                    </Form.Item>
                    <Form.Item name="dieselAmount">
                        <Input placeholder="Diesel" />
                    </Form.Item>
                    <Form.Item name="driverAdvanceAmount">
                        <Input placeholder="Driver Advance" />
                    </Form.Item>
                    <Form.Item name="commissionAmount">
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
             {/* Monthly Expenses Section */}
        {selectedYear && selectedMonth && (
            <div className="monthly-expense-section">
                <h3>Monthly Expenses for {selectedMonth}/{selectedYear}</h3>
                <Form layout="inline">
                    <Form.Item label="Driver Salary">
                        <InputNumber
                            min={0}
                            value={driverSalary}
                            onChange={(value) => setDriverSalary(value || 0)}
                        />
                    </Form.Item>
                    <Form.Item label="Toll Amount">
                        <InputNumber
                            min={0}
                            value={tollAmount}
                            onChange={(value) => setTollAmount(value || 0)}
                        />
                    </Form.Item>
                </Form>
                <Button
                    type="primary"
                    style={{ marginTop: '10px' }}
                    onClick={saveMonthlySummary}
                >
                    Save Monthly Summary
                </Button>
            </div>
        )}

        {/* Monthly Profit/Loss Display */}
        {selectedYear && selectedMonth && (
            <div className="profit-loss-display">
                <h3>Net Profit/Loss for {selectedMonth}/{selectedYear}</h3>
                <p style={{ fontWeight: 'bold', color: monthlyProfitLoss >= 0 ? 'green' : 'red' }}>
                    {monthlyProfitLoss >= 0 ? `Profit: ${monthlyProfitLoss}` : `Loss: -${Math.abs(monthlyProfitLoss)}`}
                </p>
            </div>
        )}
                <div className="data-grid">
        <DataGrid
                data={formData}
                onDataChange={onDataChange} // Pass onDataChange to DataGrid
                filterValue={filterValue}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
            />
            </div>
            </div>
        </>
    );
};

export default HomePage;
