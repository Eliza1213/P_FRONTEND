import React from "react";
import { Routes, Route } from "react-router-dom";
import ListaDispositivos from "../components/ListaDispositivos";

const DispositivosAdmin = () => {
  return (
    <Routes>
      <Route index element={<ListaDispositivos />} />
    </Routes>
  );
};

export default DispositivosAdmin;