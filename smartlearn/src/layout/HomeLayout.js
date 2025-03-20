import React from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function HomeLayout() {
  return (
    <Routes>
    {/* This will render BaseLayout, and inside it, you can define your nested routes */}
    <Route >
      <Route />
    </Route>
  </Routes>
  )
}

export default HomeLayout
