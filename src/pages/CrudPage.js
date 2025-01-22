import React from "react";
import CRUDTable, { Fields, Field, CreateForm, UpdateForm, DeleteForm } from "react-crud-table";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config"; // Firebase setup file
import "./CrudPage.css";

const service = {
  fetchItems: async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const users = [];
    querySnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });
    return Promise.resolve(users);
  },
  create: async task => {
    const docRef = await addDoc(collection(db, "users"), task);
    return Promise.resolve({ id: docRef.id, ...task });
  },
  update: async data => {
    const docRef = doc(db, "users", data.id);
    await updateDoc(docRef, {
      name: data.name,
      age: data.age
    });
    return Promise.resolve(data);
  },
  delete: async data => {
    const docRef = doc(db, "users", data.id);
    await deleteDoc(docRef);
    return Promise.resolve(data);
  }
};

const CrudPage = () => (
  <div className="home-container">
    <CRUDTable
      caption="Users"
      fetchItems={payload => service.fetchItems(payload)}
    >
      <Fields>
        <Field name="name" label="Name" placeholder="Name" sortable={false} />
        <Field name="age" label="Age" placeholder="Age" sortable={false} />
      </Fields>
      <CreateForm
        title="User Creation"
        message="Create a new user!"
        trigger="Create User"
        onSubmit={user => service.create(user)}
        submitText="Create"
        validate={values => {
          const errors = {};
          if (!values.name) {
            errors.name = "Please, provide user's name";
          }

          if (!values.age) {
            errors.age = "Please, provide user's age";
          }

          return errors;
        }}
      />

      <UpdateForm
        title="User Update Process"
        message="Update user"
        trigger="Update"
        onSubmit={user => service.update(user)}
        submitText="Update"
        validate={values => {
          const errors = {};

          if (!values.name) {
            errors.name = "Please, provide user's name";
          }

          if (!values.age) {
            errors.age = "Please, provide user's age";
          }

          return errors;
        }}
      />

      <DeleteForm
        title="User Delete Process"
        message="Are you sure you want to delete the user?"
        trigger="Delete"
        onSubmit={user => service.delete(user)}
        submitText="Delete"
        validate={values => {
          const errors = {};
          return errors;
        }}
      />
    </CRUDTable>
  </div>
);

export default CrudPage;
