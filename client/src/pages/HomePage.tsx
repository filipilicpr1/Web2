import React, { FC, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { getUserByIdAction } from "../store/userSlice";
import { IJwt } from "../shared/interfaces/userInterfaces";
import LoadingModal from "../components/UI/Modal/LoadingModal";
import { useNavigate, useLocation } from "react-router-dom";
import { getAllProductsAction } from "../store/productsSlice";
import ProductsList from "../components/Products/ProductsList";
import { Pagination, Stack, PaginationItem } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { changePage } from "../store/productsSlice";

const HomePage: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.token);
  const userApiState = useAppSelector((state) => state.user.apiState);
  const productsApiState = useAppSelector((state) => state.products.apiState);
  const finishedRegistration = useAppSelector(
    (state) => state.user.finishedRegistration
  );
  const shouldRedirect = !finishedRegistration;
  const { id } = jwtDecode<IJwt>(token ? token : "");
  const [gotUser, setGotUser] = useState<boolean>(false);
  const page = useAppSelector((state) => state.products.page);
  const totalPages = useAppSelector((state) => state.products.totalPages);
  const pageSearch = new URLSearchParams(location.search).get("page");
  const currentPage: number = pageSearch !== null ? parseInt(pageSearch) : 1;
  const [isInitial, setIsInitial] = useState<boolean>(true);

  useEffect(() => {
    if(!isInitial)
    {
      return;
    }
    setIsInitial(false);
    dispatch(changePage(currentPage));
  }, [currentPage, dispatch, page, isInitial]);

  useEffect(() => {
    if (shouldRedirect) {
      navigate("/finish-registration");
      return;
    }

    if (gotUser) {
      return;
    }

    setGotUser(true);
    dispatch(getUserByIdAction(id));
  }, [dispatch, id, shouldRedirect, navigate, gotUser]);

  useEffect(() => {
    if (!gotUser) {
      return;
    }

    dispatch(getAllProductsAction(location.search));
  }, [dispatch, gotUser, location.search]);

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
      <ProductsList />
      <Stack
        spacing={2}
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Pagination
          count={totalPages}
          siblingCount={0}
          boundaryCount={1}
          page={page}
          color="primary"
          size="large"
          onChange={handleChange}
          renderItem={(item) => (
            <PaginationItem
              slots={{ previous: ArrowBackIcon, next: ArrowForwardIcon }}
              {...item}
            />
          )}
        />
      </Stack>
      <LoadingModal
        show={userApiState === "PENDING" || productsApiState === "PENDING"}
      />
    </>
  );
};

export default HomePage;
