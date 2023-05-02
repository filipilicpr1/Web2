import React, { FC, useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import LoadingModal from "../components/UI/Modal/LoadingModal";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getAllSellersAction,
  clearAllSellers,
} from "../store/verificationSlice";
import { changePage } from "../store/verificationSlice";
import Pagination from "../components/UI/Pagination/Pagination";
import SellersList from "../components/Sellers/SellersList";

const AllSellersPage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const id = user != null ? user.id : "";
  const verificationApiState = useAppSelector(
    (state) => state.verification.apiState
  );
  const allSellers = useAppSelector((state) => state.verification.allSellers);
  const page = useAppSelector((state) => state.verification.page);
  const totalPages = useAppSelector((state) => state.verification.totalPages);
  const pageSearch = new URLSearchParams(location.search).get("page");
  const currentPage: number =
    pageSearch !== null
      ? isNaN(parseInt(pageSearch))
        ? 1
        : parseInt(pageSearch)
      : 1;
  const [isInitial, setIsInitial] = useState<boolean>(true);

  useEffect(() => {
    return () => {
      dispatch(clearAllSellers());
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
    dispatch(getAllSellersAction(location.search));
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
      <SellersList sellers={allSellers} showStatus={true} />
      {allSellers.length > 0 && (
        <Pagination
          page={page}
          totalPages={totalPages}
          handleChange={handleChange}
        />
      )}
      <LoadingModal show={verificationApiState === "PENDING"} />
    </>
  );
};

export default AllSellersPage;
