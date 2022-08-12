import CCM from './components/ccm';
import About from './components/about';
import Products from './components/products';
import Pricing from './components/pricing';
import NavBar from './components/navbar';
import Documentation from './components/documentation';
import Footer from './components/footer'
import Landing from './components/landing';
import ErrorPage from './components/errorPage';
import React from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import awsExports from './aws-exports';
Amplify.configure(awsExports);

const App = () => {

  const pages = [
    {
      name: 'Landing',
      route: '/'
    },
    {
      name: 'Products',
      route: '/products'
    },
    {
      name: 'Pricing',
      route: '/pricing',
    },
    {
      name: 'About',
      route: '/about'
    },
    {
      name: 'Documentation',
      route: '/documentation'
    },
    {
      name: 'CCM',
      route: '/app'
    }
  ];

  return (
    <>
      <Router>
        <NavBar auth={Auth} pages={pages} useLocation={useLocation}/>
        <Routes>
          <Route exact path={pages[0].route} element={<Landing />} />
          <Route exact path={pages[1].route} element={<Products />} />
          <Route exact path={pages[2].route} element={<Pricing />} />
          <Route exact path={pages[3].route} element={<About />} />
          <Route exact path={pages[4].route} element={<Documentation />} />
          <Route exact path={pages[5].route} element={<CCM auth={Auth} useLocation={useLocation}/>} />
          <Route exact path="*" element={<ErrorPage />} />
        </Routes>
        <Footer pages={pages} />
      </Router>
    </>
  );
};

export default App;