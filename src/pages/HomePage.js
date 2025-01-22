// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { TruckOutlined, CalendarOutlined, SearchOutlined,EnvironmentOutlined, BankOutlined, CreditCardOutlined, WalletOutlined,  ToolOutlined, UserOutlined, PercentageOutlined, ProfileOutlined } from '@ant-design/icons'
import { ToastContainer, toast } from 'react-toastify';
import {Card,Space, Form, Input, DatePicker, Button, Select, InputNumber,Tag,Row, Col } from 'antd';
import moment, { max } from 'moment';
import './HomePage.css';
import DataGrid from '../components/DataGrid';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where,orderBy  } from "firebase/firestore";
import { db } from "../firebase-config"; // Firebase setup file
import dayjs from 'dayjs';
const { Option } = Select;


const HomePage = () => {
    const [formData, setFormData] = useState([]);
    const [filterValue, setFilterValue] = useState('');
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
    const [selectedMonth, setSelectedMonth] = useState(
        (new Date().getMonth() + 1).toString().padStart(2, '0') // Pad single-digit months
    );
    const [selectedVehicleNo, setSelectedVehicleNo] = useState()
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
                const collectionRef = collection(db, "journeys");

                // Create a query to order data by 'date' in descending order
                const p = query(
                    collectionRef,
                    where("deletedAt", "==", ''),
                );
                const q = query(p, orderBy("journeyDate", "desc"));

                // Fetch documents using the query
                const querySnapshot = await getDocs(q);
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
            vehicleNo: values.vehicleNo.toUpperCase(),
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
            deletedAt: ''
        };

        try {
            const docRef = await addDoc(collection(db, "journeys"), formattedData);

            console.log("Document added with ID:", docRef.id);

            // Fetch the updated list of journeys, sorted by journeyDate
            const q = query(collection(db, "journeys"), orderBy("journeyDate", "desc"));
            const querySnapshot = await getDocs(q);

            // Map the fetched documents into an array
            const updatedData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            }));

            // Update the state with the sorted data
            setFormData(updatedData);
            form.resetFields(); // Reset form fields after submission
            setFilterValue('')
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };
    useEffect(() => {
        const fetchMonthlySummary = async () => {
            console.log(!selectedYear)
            if (!selectedYear || !selectedMonth || !selectedVehicleNo) {
                return;
            }

            try {
             
                const q = query(
                    collection(db, "monthlySummaries"),
                    where("year", "==", parseInt(selectedYear)),
                    where("month", "==", parseInt(selectedMonth)),
                    where("vehicleNo", "==", selectedVehicleNo)
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
    }, [selectedYear, selectedMonth, selectedVehicleNo

    ]);

    const saveMonthlySummary = async () => {
        if (!selectedYear || !selectedMonth || !selectedVehicleNo) {
            alert("Please select a valid year and month!");
            return;
        }
    
        const summaryData = {
            year: parseInt(selectedYear),
            month: parseInt(selectedMonth),
            vehicleNo: selectedVehicleNo,
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
                where("month", "==", parseInt(selectedMonth)),
                where("vehicleNo", "==", selectedVehicleNo)
            );
    
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                // Update the existing document
                const existingDocId = querySnapshot.docs[0].id;
                const docRef = doc(db, "monthlySummaries", existingDocId);
                await updateDoc(docRef, summaryData);
                alert("Monthly summary updated successfully!");
                setFilterValue('')
                setSelectedVehicleNo('')
                console.log("Updated monthly summary:", summaryData);
            } else {
                // Create a new document
                const newDocRef = await addDoc(monthlySummaryCollection, summaryData);
                alert("Monthly summary saved successfully!");
                setFilterValue('')
                setSelectedVehicleNo('')
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
    
            // // Check if the input does not start with "HR", and prepend "HR" if needed
            // if (!vehicleNo.startsWith("HR")) {
            //     vehicleNo = `HR${vehicleNo}`;
            // }
    
            form.setFieldsValue({
                vehicleNo: vehicleNo,
            });
    
            setFilterValue(e.target.value); // Update filter value in state
        }
    };
    const handleSelectedVehicleNo = () =>{
        setSelectedVehicleNo('');
        const pattern = /^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{1,4}$/;
        if(selectedYear&&selectedMonth){
        if (pattern.test(filterValue.toUpperCase())) {
            setSelectedVehicleNo(filterValue.toUpperCase());
        } else {
            toast.error("Invalid vehicle number format! Please enter a valid format.");
            console.error("Invalid vehicle number format:", filterValue);
            // Optionally show an error message to the user
        }
        }
        else{
            toast.error("Please select Year and Month.")
        }
        console.log(selectedVehicleNo)
        console.log(filterValue)
    }
    const handleInputVehicle = (e) => {
        const value = e.target.value;
        setFilterValue(value);

        // Check if the value is "0" and trigger the function
        if (value === '') {
            setSelectedVehicleNo('');
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
        console.log(formData)
        const filteredData = formData.filter(item => {
            const itemDate = moment(item.journeyDate);
            return itemDate.year() === parseInt(selectedYear) && itemDate.month() + 1 === parseInt(selectedMonth) && item.vehicleNo === selectedVehicleNo ;
        });
        console.log(filteredData)
        const totalProfitLoss = filteredData.reduce((acc, item) => {
            const totalSpent = (item.dieselAmount || 0) + (item.driverAdvanceAmount || 0) + (item.commissionAmount || 0) + (item.otherAmount || 0);
            
            // Updated logic based on balance status
            const profitLoss = item.arrears === 0
                ? item.dealAmount - totalSpent
                : (item.advancedAmount ?? 0) - totalSpent;

            return acc + profitLoss;
        }, 0);
        // console.log(totalProfitLoss)
        // Deduct driver salary and toll amount from the total monthly profit/loss
        const netProfitLoss = totalProfitLoss - driverSalary - tollAmount;
        setMonthlyProfitLoss(netProfitLoss);
    };

    useEffect(() => {
        if (selectedYear && selectedMonth&& selectedVehicleNo) {
            calculateMonthlyProfitLoss();
        }
    }, [selectedYear,selectedVehicleNo, selectedMonth, driverSalary, tollAmount, formData]);
    return (
        <>
        
        <div className="home-container">
        <Input
            placeholder="Enter Vehicle Number"
            style={{
            marginBottom: '20px',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '8px',
            }}
            prefix={<TruckOutlined />}
            onChange={(e) => setFilterValue(e.target.value.toUpperCase())}
            onKeyDown={handleSearchEnter}
            value={filterValue}
        />
        {!selectedVehicleNo && (
            <Card style={{backgroundColor:'rgb(212, 240, 231)'}}>
            <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{ journeyDate: dayjs() }}
            className="responsive-form modern-form"
            >
            <Row gutter={[10, 10]}>
                <Col xs={16} sm={8} md={4}>
                <Form.Item
                    label="Vehicle No"
                    name="vehicleNo"
                    rules={[
                    { required: true, message: 'Please enter the vehicle number!' },
                    {
                        pattern: /^[A-Z]{2}\d{1,2}[A-Z]{1,2}\d{1,4}$/,
                        message: 'Enter a valid vehicle number (e.g., MH12AB1234).',
                    },
                    ]}
                    normalize={(value) => value?.toUpperCase() || ''}
                >
                    <Input placeholder="Enter Vehicle No" prefix={<TruckOutlined />} />
                </Form.Item>
                </Col>

                <Col xs={16} sm={8} md={4}>
                <div style={{ width: '100%', position: 'relative', display: 'flex', alignItems: 'center' }}>
            <CalendarOutlined
            style={{
                position: 'absolute',
                left: '14px',
                top: '40px',
                zIndex: 1,
                pointerEvents: 'none', // Ensures it doesn't block input interactions
            }}
            />
            <Form.Item
            label="Date"
            name="journeyDate"
            rules={[{ required: true, message: 'Please enter the journey date!' }]}
            style={{ flex: 1 }}
            >
            <DatePicker
                style={{
                width: '100%',
                paddingLeft: '35px', // Matches the space occupied by the icon
                }}
                suffixIcon={null}
                placeholder="Select Date"
            />
            </Form.Item>
            </div>
                </Col>

                <Col xs={16} sm={8} md={4}>
                <Form.Item
                    label="From"
                    name="sourceLocation"
                    rules={[{ required: true, message: 'Please enter the source place!' }]}
                >
                    <Input placeholder="Enter Source" prefix={<EnvironmentOutlined />} />
                </Form.Item>
                </Col>

                <Col xs={16} sm={8} md={4}>
                <Form.Item
                    label="To"
                    name="destinationLocation"
                    rules={[{ required: true, message: 'Please enter the destination!' }]}
                >
                    <Input placeholder="Enter Destination" prefix={<EnvironmentOutlined />} />
                </Form.Item>
                </Col>

                <Col xs={16} sm={8} md={4}>
                <Form.Item
                    label="Deal Amount"
                    name="dealAmount"
                    rules={[
                        { required: true, message: 'Please enter the deal amount!' },
                        {
                        pattern: /^[0-9]+$/,
                        message: 'The deal amount must only contain numbers!',
                        },
                    ]}
                    
                >
                    <Input placeholder="Enter Deal Amount" onChange={updateBalance} prefix={<BankOutlined />} />
                </Form.Item>
                </Col>

                <Col xs={16} sm={8} md={4}>
                <Form.Item label="Advance" name="advancedAmount" rules={[
                        {
                        pattern: /^[0-9]+$/,
                        message: 'The advanced Amount must only contain numbers!',
                        },
                        {
                            validator: (_, value) => {
                            const maximumAmount = form.getFieldValue('dealAmount');
                            if (value === undefined || Number(value.trim()) <= Number(maximumAmount.trim())) {
                                return Promise.resolve();
                            }
                            return Promise.reject(
                                new Error(
                                `The Advanced amount cannot be more than the Deal amount (${maximumAmount}).`
                                )
                            );
                            },
                        },
                    ]}>
                    <Input placeholder="Enter Advance" onChange={updateBalance} prefix={<CreditCardOutlined />} />
                </Form.Item>
                </Col>

                <Col xs={16} sm={8} md={4}>
                <Form.Item label="Balance" name="arrears">
                    <Input placeholder="Enter Balance" readOnly prefix={<WalletOutlined />} />
                </Form.Item>
                </Col>

                <Col xs={16} sm={8} md={4}>
                <Form.Item label="Diesel Spend" name="dieselAmount"  rules={[
                        {
                        pattern: /^[0-9]+$/,
                        message: 'The diesel amount must only contain numbers!',
                        },
                    ]}>
                    <Input placeholder="Enter Diesel" prefix={< ToolOutlined />} />
                </Form.Item>
                </Col>

                <Col xs={16} sm={8} md={4}>
                <Form.Item label="Driver Advance" name="driverAdvanceAmount" rules={[
                        {
                        pattern: /^[0-9]+$/,
                        message: 'The Driver Advance amount must only contain numbers!',
                        },
                    ]}>
                    <Input placeholder="Enter Driver Advance" prefix={<UserOutlined />} />
                </Form.Item>
                </Col>

                <Col xs={16} sm={8} md={4}>
                <Form.Item label="Commission" name="commissionAmount" rules={[
                        {
                        pattern: /^[0-9]+$/,
                        message: 'Commission amount must only contain numbers!',
                        },
                    ]}>
                    <Input placeholder="Enter Commission" prefix={<PercentageOutlined />} />
                </Form.Item>
                </Col>

                <Col xs={16} sm={8} md={4}>
                <Form.Item label="Other Amount" name="otherAmount" rules={[
                        {
                        pattern: /^[0-9]+$/,
                        message: 'Other amount must only contain numbers!',
                        },
                    ]}>
                    <Input placeholder="Enter Other Amount" prefix={<ProfileOutlined />} />
                </Form.Item>
                </Col>

                <Col xs={16} sm={8} md={4}>
                <Form.Item style={{ marginTop: '28px' }}>
                    <Button
                    type="primary"
                    htmlType="submit"
                    style={{
                        width: '100%',
                        borderRadius: '8px',
                        backgroundColor: '#007BFF',
                        borderColor: '#007BFF',
                        fontWeight: 'bold',
                    }}
                    >
                    Save
                    </Button>
                </Form.Item>
                </Col>
            </Row>
            </Form>
            </Card>
        )}
        

            



            {/* Data Grid Component */}
            
        </div>
        {/* Filter Section */}
        <Row justify="center">
  <Col >
    <div
      className="filter-section"
      style={{
        padding: '20px',
        background: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Space
        size="middle"
        wrap
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '16px',
        }}
      >
        {/* Year Selection */}
        <Select
          placeholder={
            <>
              <CalendarOutlined /> Select Year
            </>
          }
          style={{ width: '160px' }}
          onChange={setSelectedYear}
          value={selectedYear || undefined}
          allowClear
        >
          {['2022', '2023', '2024', '2025', '2026'].map((year) => (
            <Select.Option key={year} value={year}>
              {year}
            </Select.Option>
          ))}
        </Select>

        {/* Month Selection */}
        <Select
          placeholder={
            <>
              <CalendarOutlined /> Select Month
            </>
          }
          style={{ width: '160px' }}
          onChange={setSelectedMonth}
          value={selectedMonth || undefined}
          allowClear
        >
          {['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'].map((month) => (
            <Select.Option key={month} value={month}>
              {month}
            </Select.Option>
          ))}
        </Select>

        {/* Vehicle Number Input */}
        <Input
          placeholder="Enter Vehicle Number"
          prefix={<TruckOutlined />}
          style={{ width: '300px', backgroundColor: '#8fd1b9' }}
          onChange={handleInputVehicle}
          value={filterValue.toUpperCase()}
        />

        {/* Submit Button */}
        <Button type="primary" icon={<SearchOutlined />} onClick={handleSelectedVehicleNo}>
          Monthly Report
        </Button>
      </Space>
    </div>
    {/* <ToastContainer /> */}
  </Col>
</Row>

        <div>
         {/* Monthly Expenses Section */}
         <Row justify="center"><Col>
         {filterValue && selectedYear && selectedMonth && selectedVehicleNo && (
        <div
            className="monthly-summary-container"
            style={{
            display: 'flex',
            justifyContent: 'space-between',
            margin: '20px auto',
            maxWidth: '1200px',
            gap: '20px',
            }}
        >
            {/* Monthly Expenses Section */}
            <div className="monthly-expense-section">
            <Card
                title={`Monthly Report for ${selectedVehicleNo} on ${selectedMonth}/${selectedYear}`}
                bordered={false}
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}
            >
                <Form layout="inline" style={{ gap: '12px', alignItems: 'center' }}>
                <Form.Item label="Driver Salary" style={{ flex: '1' }}>
                    <InputNumber
                    min={0}
                    value={driverSalary}
                    onChange={(value) => setDriverSalary(value || 0)}
                    style={{ width: '100%' }}
                    placeholder="Enter Salary"
                    />
                </Form.Item>
                <Form.Item label="Toll Amount" style={{ flex: '1' }}>
                    <InputNumber
                    min={0}
                    value={tollAmount}
                    onChange={(value) => setTollAmount(value || 0)}
                    style={{ width: '100%' }}
                    placeholder="Enter Toll"
                    />
                </Form.Item>
                </Form>
                <Button
                type="primary"
                style={{ width: '100%', marginTop: '16px' }}
                onClick={saveMonthlySummary}
                >
                Save Monthly Summary
                </Button>
            </Card>
            </div>

            {/* Monthly Profit/Loss Display */}
            <div className="profit-loss-display" style={{ flex: '1', display: 'inline-flex' }}>
            <Card
                bordered={false}
                style={{
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                borderRadius: '8px',
                }}
            >
                <h3 style={{ marginBottom: '16px' }}>Net Profit/Loss</h3>

                <Tag 
                        color={monthlyProfitLoss >= 0 ? "green" : "red"}
                        style={{ fontWeight: "bold", fontSize:'18px',padding: '10px 16px' }}
                        >
                        {monthlyProfitLoss >= 0
                            ? `${monthlyProfitLoss}`
                            : `-${Math.abs(monthlyProfitLoss)}`}
                        </Tag>
            </Card>
            </div>
        </div>
        )}
        </Col></Row>



                <div className="data-grid">
        <DataGrid
                data={formData}
                onDataChange={onDataChange} // Pass onDataChange to DataGrid
                filterValue={filterValue}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                selectedVehicleNo={selectedVehicleNo}
            />
            </div>
            </div>
        </>
    );
};

export default HomePage;
