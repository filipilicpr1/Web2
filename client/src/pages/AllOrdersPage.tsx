import React, { FC, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import LoadingModal from "../components/UI/Modal/LoadingModal";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllOrdersAction, clearAllOrders } from "../store/ordersSlice";
import { changePage } from "../store/ordersSlice";
import Pagination from "../components/UI/Pagination/Pagination";
import OrdersList from "../components/Orders/OrdersList";

const AllOrdersPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const id = user != null ? user.id : "";
  const orderApiState = useAppSelector((state) => state.orders.apiState);
  const allOrders = useAppSelector((state) => state.orders.allOrders);
  const page = useAppSelector((state) => state.orders.page);
  const totalPages = useAppSelector((state) => state.orders.totalPages);
  const pageSearch = new URLSearchParams(location.search).get("page");
  const currentPage: number = pageSearch !== null ? parseInt(pageSearch) : 1;
  const [isInitial, setIsInitial] = useState<boolean>(true);

  useEffect(() => {
    return () => {
      dispatch(clearAllOrders());
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isInitial) {
      return;
    }
    setIsInitial(false);
    dispatch(changePage(currentPage));
  }, [currentPage, dispatch, page, isInitial]);

  useEffect(() => {
    dispatch(getAllOrdersAction(location.search));
  }, [dispatch, id, location.search]);

  useEffect(() => {
    navigate({
      pathname: location.pathname,
      search: page < 2 ? "" : "?page=" + page,
    });
  }, [page, navigate, location.pathname]);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(changePage(value));
  };

  return (
    <>
      <OrdersList orders={allOrders} />
      {allOrders.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          handleChange={handleChange}
        />
      )}
      <LoadingModal show={orderApiState === "PENDING"} />
    </>
  );
};

export default AllOrdersPage;
