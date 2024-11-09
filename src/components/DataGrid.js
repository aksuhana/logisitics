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
                item.balance = Number(value) || 0;

                // Calculate profit or loss with defaults for missing values
                const dealAmount = item.dealAmount || 0;
                const advance = item.advance || 0;
                const diesel = item.diesel || 0;
                const driverAdvance = item.driverAdvance || 0;
                const commission = item.commission || 0;
                const otherAmount = item.otherAmount || 0;

                const totalSpent = advance + diesel + driverAdvance + commission + otherAmount;
                if (item.balance === 0) {
                    item.profitOrLoss = dealAmount - totalSpent;
                } else {
                    item.profitOrLoss = advance - totalSpent;
                }
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
                // Calculate total spent excluding advance
                const totalSpent = (record.diesel || 0) + (record.driverAdvance || 0) + (record.commission || 0) + (record.otherAmount || 0);
               
                // Conditional logic for profit/loss calculation
                const profitOrLoss = record.balance === 0
                    ? record.dealAmount - totalSpent
                    : (record.advance ?? 0) - totalSpent;
                    console.log("totalSpent", totalSpent, record.balance, record.dealAmount, record.advance, profitOrLoss )
                return (
                    <span style={{ color: profitOrLoss >= 0 ? 'green' : 'red', fontWeight: 'bold' }}>
                        {profitOrLoss >= 0 ? `Profit: ${profitOrLoss}` : `Loss: -${Math.abs(profitOrLoss)}`}
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