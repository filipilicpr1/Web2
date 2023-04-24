import React, { FC, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import LoadingModal from "../components/UI/Modal/LoadingModal";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllProductsBySellerAction } from "../store/productsSlice";
import { changePage } from "../store/productsSlice";
import Pagination from "../components/UI/Pagination/Pagination";
import SellerProductsList from "../components/Products/SellerProductsList";

const SellerProductsPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const id = user != null ? user.id : "";
  const productsApiState = useAppSelector((state) => state.products.apiState);
  const sellerProducts = useAppSelector(
    (state) => state.products.sellerProducts
  );
  const page = useAppSelector((state) => state.products.page);
  const totalPages = useAppSelector((state) => state.products.totalPages);
  const pageSearch = new URLSearchParams(location.search).get("page");
  const currentPage: number = pageSearch !== null ? parseInt(pageSearch) : 1;
  const [isInitial, setIsInitial] = useState<boolean>(true);

  useEffect(() => {
    if (!isInitial) {
      return;
    }
    setIsInitial(false);
    dispatch(changePage(currentPage));
  }, [currentPage, dispatch, page, isInitial]);

  useEffect(() => {
    dispatch(getAllProductsBySellerAction({ id: id, query: location.search }));
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
      <SellerProductsList />
      {sellerProducts.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          handleChange={handleChange}
        />
      )}
      <LoadingModal show={productsApiState === "PENDING"} />
    </>
  );
};

export default SellerProductsPage;
