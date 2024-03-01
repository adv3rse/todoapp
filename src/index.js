import React, {Suspense, lazy} from 'react';
import '../src/App.css';
import ReactDOM from 'react-dom/client';
import App from './Components/App';
//import About from './Routes/About';
//import ContactUs from './Routes/ContactUs';
import reportWebVitals from './reportWebVitals';
import ErrorPage from "./Routes/ErrorPage";
import SingleTodo from "./Routes/SingleTodo"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./Routes/Home";
const About = lazy(() => import('./Routes/About'));
const ContactUs = lazy(() => import('./Routes/ContactUs'));
const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/about",
        element: <Suspense fallback={<div>Loading.......</div>}>
                  <About />
                 </Suspense>,
      },
      {
        path: "/contact-us",
        element: <Suspense fallback={<div>Loading.......</div>}>
                  <ContactUs />
                 </Suspense>,
        children: [
          {
            path: "form",
            element: <h2>This is the form</h2>,
          },
          {
            path: "address",
            element: <h2>This is the Address</h2>,
          }
        ]
      },
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/Todo/SingleTodo/:id",
        element: <SingleTodo />
      },]
  },

  // {
  //   path:"/Todo/SingleTodo",
  //   element:<SingleTodo />
  // },
  // {
  //   path:"/contact-us",
  //   element:<ContactUs />
  // 
  // }
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
