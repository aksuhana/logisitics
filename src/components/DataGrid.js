// src/components/DataGrid.js
import React from 'react';
import { Table } from 'antd';

const DataGrid = ({ data, filterValue, selectedYear, selectedMonth }) => {
    const columns = [
        { title: 'Vehicle No', dataIndex: 'vehicleNo', key: 'vehicleNo' },
        { title: 'Date', dataIndex: 'date', key: 'date' },
        { title: 'From', dataIndex: 'from', key: 'from' },
        { title: 'To', dataIndex: 'to', key: 'to' },
        { title: 'Deal Amount', dataIndex: 'dealAmount', key: 'dealAmount' },
        { title: 'Advance', dataIndex: 'advance', key: 'advance' },
        { title: 'Balance', dataIndex: 'balance', key: 'balance' },
        { title: 'Diesel', dataIndex: 'diesel', key: 'diesel' },
        { title: 'Driver Advance', dataIndex: 'driverAdvance', key: 'driverAdvance' },
        { title: 'Commission', dataIndex: 'commission', key: 'commission' },
        { title: 'Other Amount', dataIndex: 'otherAmount', key: 'otherAmount' },
        {
            title: 'Profit/Loss',
            key: 'profitOrLoss',
            render: (text, record) => {
                const totalSpent = record.diesel + record.driverAdvance + record.otherAmount + record.commission;
                const profitOrLoss = record.dealAmount - record.advance - totalSpent;

                return (
                    <span style={{ fontWeight: 'bold', color: profitOrLoss >= 0 ? 'green' : 'red' }}>
                        {profitOrLoss >= 0 ? `${profitOrLoss}` : `-${Math.abs(profitOrLoss)}`}
                    </span>
                );
            },
        },
    ];

    // Filter and calculate balance inline
    const filteredData = data
        .map((item) => ({
            ...item,
            balance: item.dealAmount - item.advance,
        }))
        .filter((item) => {
            const [year, month] = item.date.split('-');
            return (
                item.vehicleNo.toLowerCase().includes(filterValue.toLowerCase()) &&
                (selectedYear ? year === selectedYear : true) &&
                (selectedMonth ? month === selectedMonth : true)
            );
        });

    return (
        <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }}
            style={{ marginTop: '24px' }}
        />
    );
};

export default DataGrid;
