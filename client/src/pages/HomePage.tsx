import React, {FC, useEffect} from 'react';
import jwtDecode from 'jwt-decode';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { getUserByIdAction } from '../store/userSlice';
import { IJwt } from '../shared/interfaces/userInterfaces';

const HomePage: FC = () => {
    const dispatch = useAppDispatch();
    const token = useAppSelector((state) => state.user.token);
    const {id} = jwtDecode<IJwt>(token ? token : "");

    useEffect(() => {
        dispatch(getUserByIdAction(id))
    }, [dispatch, id]);

    return(
        <>
        
        </>
    );
};

export default HomePage;