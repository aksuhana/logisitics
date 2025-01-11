// src/components/DataGrid.js
import React from "react";
import { Table, InputNumber,Button, message, Popconfirm } from "antd";
import moment from "moment";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase-config"; // Firebase setup file

const DataGrid = ({
  data,
  onDataChange,
  filterValue,
  selectedYear,
  selectedMonth,
}) => {
  // Filter data based on search and selected filters

  const filteredData = data.filter((item) => {
    const matchesVehicleNo = item.vehicleNo
      .toLowerCase()
      .includes(filterValue.toLowerCase());

    const itemDate = moment(item.journeyDate);

    const matchesYear = selectedYear
      ? itemDate.year().toString() === selectedYear
      : true;

    const matchesMonth = selectedMonth
      ? itemDate.format("MM") === selectedMonth
      : true;

    return matchesVehicleNo && matchesYear && matchesMonth;
  });


  // const handleBalanceChange = (value, record) => {
  //   const newData = data.map((item) => {
  //     console.log(item.id === record.id)
  //     if (item.id === record.id) {
  //       item.arrears = Number(value) || 0;

  //       // Calculate profit or loss with defaults for missing values
  //       const dealAmount = item.dealAmount || 0;
  //       const advancedAmount = item.advancedAmount || 0;
  //       const dieselAmount = item.dieselAmount || 0;
  //       const driverAdvanceAmount = item.driverAdvanceAmount || 0;
  //       const commissionAmount = item.commissionAmount || 0;
  //       const otherAmount = item.otherAmount || 0;

  //       const totalSpent =
  //       advancedAmount + dieselAmount + driverAdvanceAmount + commissionAmount + otherAmount;
  //       if (item.arrears === 0) {
  //         item.profitOrLoss = dealAmount - totalSpent;
  //       } else {
  //         item.profitOrLoss = advancedAmount - totalSpent;
  //       }
  //     }
  //     return item;
  //   });

  //   onDataChange(newData);
  // };

  const handleSetArrearsToZero = async (record) => {
    const newData = data.map((item) => {
      if (item.id === record.id) {
        // Update arrears locally
        item.arrears = 0;
  
        // Calculate profit or loss with defaults for missing values
        const dealAmount = item.dealAmount || 0;
        const advancedAmount = item.advancedAmount || 0;
        const dieselAmount = item.dieselAmount || 0;
        const driverAdvanceAmount = item.driverAdvanceAmount || 0;
        const commissionAmount = item.commissionAmount || 0;
        const otherAmount = item.otherAmount || 0;
  
        const totalSpent =
          advancedAmount + dieselAmount + driverAdvanceAmount + commissionAmount + otherAmount;
  
        item.profitOrLoss = dealAmount - totalSpent;
      }
      return item;
    });
  
    onDataChange(newData); // Update local state
  
    try {
      // Prepare the fields to update in Firestore
      const updatedFields = {
        arrears: 0,
        profitOrLoss: newData.find(item => item.id === record.id).profitOrLoss,
      };
  
      // Update the record in Firestore
      await updateToFirebase(record.id, updatedFields);
      message.success('Arrears updated to 0 and saved successfully');
    } catch (error) {
      message.error('Failed to update the arrears');
      console.error('Error updating Firestore:', error);
  
      // Optionally, revert local changes if Firebase update fails
      const revertedData = data.map((item) => {
        if (item.id === record.id) {
          item.arrears = record.arrears; // Revert to original arrears
          // Recalculate profitOrLoss or revert if necessary
          // ...
        }
        return item;
      });
      onDataChange(revertedData);
    }
  };
  
  const updateToFirebase = async (id, updatedFields) => {
    try {
      const recordRef = doc(db, 'journeys', id);
      await updateDoc(recordRef, updatedFields);
    } catch (error) {
      console.error('Error updating Firebase:', error);
      throw error;
    }
  };

  const columns = [
    {
      title: "Vehicle No",

      dataIndex: "vehicleNo",

      key: "vehicleNo",
    },
   
    {
      title: "Date",

      dataIndex: "journeyDate",

      key: "journeyDate",
    },

    {
      title: "From",

      dataIndex: "sourceLocation",

      key: "sourceLocation",
    },
    {
      title: "To",

      dataIndex: "destinationLocation",

      key: "destinationLocation",
    },
    {
      title: "Deal Amount",

      dataIndex: "dealAmount",

      key: "dealAmount",
    },

    {
      title: "Advance",

      dataIndex: "advancedAmount",

      key: "advancedAmount",
    },

    {
      title: "Balance",

      dataIndex: "arrears",

      key: "arrears",

      render: (text, record) =>
        record.arrears !== 0 ? (
          <>
            <span>{record.arrears}</span>
            <Popconfirm
              title="Are you sure you want to clear the balance?"
              onConfirm={() => handleSetArrearsToZero(record)}
              okText="Yes"
              cancelText="No"
              placement="topRight"
            >
              <Button
                type="primary"
                size="small"
                style={{
                  marginLeft: '10px',
                  backgroundColor: '#1890ff',
                  borderColor: '#1890ff',
                  color: '#fff',
                  borderRadius: '4px',
                }}
              >
                Clear
              </Button>
            </Popconfirm>
          </>
        ) : (
          <span>{record.arrears}</span>
        ),
    },

    {
      title: "Profit/Loss",
      dataIndex: "profitOrLoss",
      key: "profitOrLoss",
      render: (text, record) => {
        // Calculate total spent excluding advance
        const totalSpent =
          (record.dieselAmount || 0) +
          (record.driverAdvanceAmount || 0) +
          (record.commissionAmount || 0) +
          (record.otherAmount || 0);

        // Conditional logic for profit/loss calculation
        const profitOrLoss =
          record.arrears === 0
            ? record.dealAmount - totalSpent
            : (record.advancedAmount ?? 0) - totalSpent;
        console.log(
          "totalSpent",
          totalSpent,
          record.arrears,
          record.dealAmount,
          record.advancedAmount,
          profitOrLoss
        );
        return (
          <span
            style={{
              color: profitOrLoss >= 0 ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {profitOrLoss >= 0
              ? `Profit: ${profitOrLoss}`
              : `Loss: -${Math.abs(profitOrLoss)}`}
          </span>
        );
      },
    },

    {
      title: "Diesel",

      dataIndex: "dieselAmount",

      key: "dieselAmount",
    },

    {
      title: "Driver Advance",

      dataIndex: "driverAdvanceAmount",

      key: "driverAdvanceAmount",
    },

    {
      title: "Commission",

      dataIndex: "commissionAmount",

      key: "commissionAmount",
    },

    {
      title: "Other Amount",

      dataIndex: "otherAmount",

      key: "otherAmount",
    },
  ];

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={filteredData}
      pagination={{ pageSize: 10 }}
    />
  );
};

export default DataGrid;
