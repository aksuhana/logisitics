// src/components/DataGrid.js
import React from 'react';
import { Table, InputNumber } from 'antd';
import moment from 'moment';
const DataGrid = ({ data, onDataChange, filterValue, selectedYear, selectedMonth }) => {

    // Filter data based on search and selected filters

    const filteredData = data.filter(item => {

        const matchesVehicleNo = item.vehicleNo.toLowerCase().includes(filterValue.toLowerCase());

        const itemDate = moment(item.date);



        const matchesYear = selectedYear ? itemDate.year().toString() === selectedYear : true;

        const matchesMonth = selectedMonth ? itemDate.format("MM") === selectedMonth : true;



        return matchesVehicleNo && matchesYear && matchesMonth;

    });



    const handleBalanceChange = (value, record) => {

        const newData = data.map((item) => {

            if (item.key === record.key) {

                item.balance = Number(value);

                item.profitOrLoss = item.dealAmount - item.advance - item.balance;

            }

            return item;

        });

        onDataChange(newData);

    };

    const columns = [

        {

            title: 'Vehicle No',

            dataIndex: 'vehicleNo',

            key: 'vehicleNo',

        },

        {

            title: 'Date',

            dataIndex: 'date',

            key: 'date',

        },

        {

            title: 'Deal Amount',

            dataIndex: 'dealAmount',

            key: 'dealAmount',

        },

        {

            title: 'Advance',

            dataIndex: 'advance',

            key: 'advance',

        },

        {

            title: 'Balance',

            dataIndex: 'balance',

            key: 'balance',

            render: (text, record) =>

                record.balance !== 0 ? (

                    <InputNumber

                        min={0}

                        defaultValue={record.balance}

                        onBlur={(e) => handleBalanceChange(e.target.value, record)} // Update on blur

                        onPressEnter={(e) => handleBalanceChange(e.target.value, record)} // Update on Enter

                    />

                ) : (

                    <span>{record.balance}</span>

                ),

        },

        {

            title: 'Profit/Loss',

            dataIndex: 'profitOrLoss',

            key: 'profitOrLoss',

            render: (text, record) => {

                const profitOrLoss = record.dealAmount - record.advance - (record.balance || 0);

                return (

                    <span style={{ color: profitOrLoss >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>

                        {profitOrLoss >= 0 ? `${profitOrLoss}` : `-${Math.abs(profitOrLoss)}`}

                    </span>

                );

            },

        },

        {

            title: 'Diesel',

            dataIndex: 'diesel',

            key: 'diesel',

        },

        {

            title: 'Driver Advance',

            dataIndex: 'driverAdvance',

            key: 'driverAdvance',

        },

        {

            title: 'Commission',

            dataIndex: 'commission',

            key: 'commission',

        },

        {

            title: 'Other Amount',

            dataIndex: 'otherAmount',

            key: 'otherAmount',

        }

    ];



    return <Table rowKey="key" columns={columns} dataSource={filteredData} pagination={{ pageSize: 10 }} />;
};



export default DataGrid;