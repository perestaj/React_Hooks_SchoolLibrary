import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadLoansAsync } from '../loanSlice';
import { LoansList } from './LoansList';
import { LoansSearch } from './LoansSearch';

export const LoansPage = () => {
    const dispatch = useDispatch();    

    useEffect(() => {
        dispatch(loadLoansAsync());
    }, [dispatch]);    

    return (
            <div>
                <h1 className="h3 mb-3 font-weight-normal text-center">Loans</h1>
                <LoansSearch />
                <LoansList  />
            </div>
    );    
}