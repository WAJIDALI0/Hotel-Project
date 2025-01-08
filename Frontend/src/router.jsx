import { createBrowserRouter } from "react-router-dom";
import DashBoardLayout from "./screens/dashboard/DashBoardLayout";
import LoginScreen from "./screens/login/LoginScreen";
import SignupScreen from "./screens/login/SignupScreen";
import DashBoardScreen from "./screens/dashboard/DashBoardScreen";

import AuthLayout from "./screens/login/AuthLayout";
import InventoryFormScreen from "./screens/InventoryFormScreen";
import ProductInfoScreen from "./screens/product/ProductInfoScreen";
import AddNewProductScreen from "./screens/product/AddNewProductScreen";
import ProductEditScreen from "./screens/product/ProductEditScreen";
import PrductsScreen from "./screens/product/ProductsScreen";
import LocationsScreen from "./screens/locations/LocationsScreen";
import NewLocationScreen from "./screens/locations/NewLocationScreen";
import EditLocationScreen from "./screens/locations/EditLocationScreen";

import BrandsScreen from "./screens/brands/BrandsScreen";
import NewBrandsScreen from "./screens/brands/NewBrandsScreen";
import EditBrandsScreen from "./screens/brands/EditBrandsScreen";
import UserManagementScreen from "./screens/users/UserManagementScreen";
import AddNewCookScreen from "./screens/product/AddNewCoojScreen";
import AssignCookProduct from "./screens/product/AssignCookProduct";
import GetCookProducts from "./screens/product/GetCookProducts";
import ReturnProduct from './screens/product/ReturnProduct'
import ShowReturnProducts from "./screens/product/ShowReturnProducts"
import ListCookProducts from "./screens/product/ListCookProduct";
// import ReturnedProducts from "./screens/product/ReturnProduct";
const router = createBrowserRouter([
  {
    path: "/",
    element: <DashBoardLayout />,
    children: [
      {
        path: "",
        element: <DashBoardScreen />,
      },
      // {
      //   path: "add-item",
      //   element: <AddItemScreen />,
      // },
      {
        path: "add-product",
        element: <InventoryFormScreen />,
      },
      {
        path: "products/:id",
        element: <ProductInfoScreen />,
      },
      {
        path: "products/:id/edit",
        element: <ProductEditScreen />,
      },

      // new routes

      {
        path: "/products",
        element: <PrductsScreen />,
      },
      { path: "/products/new", element: <AddNewProductScreen /> },
      { path: "/cook/new", element: <AddNewCookScreen/> },
      { path: "/cook/assign/", element: <AssignCookProduct /> },
      { path: "return/product/", element: <ReturnProduct/> },
      { path: "/cook/show/", element: <GetCookProducts /> },
      {
        path: "/List/product",
        element: <ListCookProducts />,
      },
      {
        path: "/return/show/product",
        element: <ShowReturnProducts />,
      },

      { path: "/products/edit/:id", element: <ProductEditScreen /> },

      // users
      {
        path: "/users",
        element: <UserManagementScreen />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        path: "",
        element: <LoginScreen />,
      },
      {
        path: "signup",
        element: <SignupScreen />,
      },
    ],
  },
]);

export default router;
export const SERVER_URL =
     import.meta.env.VITE_MODE === "DEV"
    ? import.meta.env.VITE_LOCAL
    : import.meta.env.VITE_SERVER;
