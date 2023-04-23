import React, { FC, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { getUserByIdAction } from "../store/userSlice";
import { IJwt } from "../shared/interfaces/userInterfaces";
import LoadingModal from "../components/UI/Modal/LoadingModal";
import { useNavigate } from "react-router-dom";
import { getAllProductsAction } from "../store/productsSlice";

const HomePage: FC = () => {
  const navigate = useNavigate();
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

    dispatch(getAllProductsAction());
  }, [dispatch, gotUser]);

  return (
    <>
      <LoadingModal
        show={userApiState === "PENDING" || productsApiState === "PENDING"}
      />
    </>
  );
};

export default HomePage;
