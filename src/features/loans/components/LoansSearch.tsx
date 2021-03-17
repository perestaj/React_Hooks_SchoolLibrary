import React, { ChangeEvent, FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoanStatus } from "../../../common/loanStatus";
import { selectBookStatuses } from "../../books/bookSlice";
import { filterLoans, loadBookStatuses, selectLoansSearchFilter } from "../loanSlice";
import { BookStatus } from "../models/bookStatus";
import { BookStatusSearch, LoanSearchFilter } from "../models/loanSearchFilter";

export const LoansSearch: FunctionComponent = () => {
    const loanBookStatuses = useSelector(selectBookStatuses);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadBookStatuses());
    }, [dispatch]);

    const loansSearchFilter = useSelector(selectLoansSearchFilter);    

    const handleInputChange = (e: ChangeEvent<{name: string; value: string; checked?: boolean}>): void => {
        let filter: LoanSearchFilter;
        if (e.target.name === 'bookStatuses') {
            let bookStatuses: BookStatusSearch[] = JSON.parse(JSON.stringify(loansSearchFilter?.bookStatuses || []));
            let status = bookStatuses.find(status => status.id === +e.target.value);
            if (status) {
                status.isSelected = !!e.target.checked;
            }          

            filter = {...loansSearchFilter, bookStatuses: bookStatuses};
        } else {
            filter = {...loansSearchFilter, [e.target.name]: e.target.value}
        }
        
        dispatch(filterLoans(filter));
     };    
        
    const isStatusSelected = (loanStatus: LoanStatus): boolean | undefined => {
        const status = (loansSearchFilter?.bookStatuses || []).find(status => status.id === loanStatus);
        return status && status.isSelected;
    }

    return (
        <div style={{width: '95%', margin: '0 auto'}}>
            <form className="form-horizontal">
                <div className="form-row">
                    <div className="col-md-6 mb-3">
                        <label>Title:</label>
                        <div>
                            <input type="text" name='title' className="form-control" value={loansSearchFilter?.title || ''} onChange={(event) => handleInputChange(event)}></input>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>User:</label>
                        <div>
                            <input type="text" name='user' className="form-control" value={loansSearchFilter?.user || ''} onChange={(event) => handleInputChange(event)}></input>
                        </div>
                    </div>
                </div>
                <div className="form-group">                    
                    <div className="form-check">
                        {loanBookStatuses.map((status: BookStatus) => (
                            <label key={status.id} style={{marginRight: '10px'}}>
                                <input type="checkbox" key={status.id} name='bookStatuses' value={status.id} 
                                    checked={isStatusSelected(status.id)}
                                    onChange={(event) => handleInputChange(event)} /> {status.name}
                            </label>)
                        )
                        }
                    </div>
                </div>
            </form>
        </div>
    );
}
