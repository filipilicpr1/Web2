import React, { FC, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { getUserByIdAction } from "../store/userSlice";
import { IJwt } from "../shared/interfaces/userInterfaces";
import LoadingModal from "../components/UI/Modal/LoadingModal";
import { useNavigate } from "react-router-dom";

const HomePage: FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.user.token);
  const apiState = useAppSelector((state) => state.user.apiState);
  const finishedRegistration = useAppSelector((state) => state.user.finishedRegistration);
  const shouldRedirect = !finishedRegistration;
  const { id } = jwtDecode<IJwt>(token ? token : "");

  useEffect(() => {
    if(shouldRedirect)
    {
      navigate("/finish-registration");
      return;
    }

    dispatch(getUserByIdAction(id));
  }, [dispatch, id, shouldRedirect, navigate]);

  return (
    <>
      <LoadingModal show={apiState === "PENDING"} />
    </>
  );
};

export default HomePage;
