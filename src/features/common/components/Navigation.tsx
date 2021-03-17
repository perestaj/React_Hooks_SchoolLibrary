import React, { Fragment, FunctionComponent } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { canEditLoans, displayAdministrationLink, canEditAuthors, canEditPublishers, canEditUsers } from "../../../authorization/authorization";
import { selectCurrentUser } from "../../../authorization/authorizationSlice";
import { LoginInfo } from "./LoginInfo";

export const Navigation: FunctionComponent = () => {   
    const currentUser = useSelector(selectCurrentUser);
    
    let privateLinks = (
        <Fragment>
        { canEditLoans(currentUser) && <li className="nav-item">
            <NavLink to="/loans" activeClassName="active" className="nav-link">Loans</NavLink>
            </li> }
        { displayAdministrationLink(currentUser) && 
            <li className="nav-item dropdown">
                <NavLink to='/administration' role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" className="nav-link dropdown-toggle">
                    Administration
                </NavLink>
                <div className="dropdown-menu">      
                    {canEditAuthors(currentUser) && <NavLink to="/administration/authors" className="dropdown-item">Authors</NavLink> }
                    {canEditPublishers(currentUser) && <NavLink to="/administration/publishers" className="dropdown-item">Publishers</NavLink>  } 
                    {canEditUsers(currentUser) && <NavLink to="/administration/users" className="dropdown-item">Users</NavLink> }     
                </div>
            </li>  
        }
        </Fragment>
    );
    
    return (
        <div className="d-flex flex-column flex-md-row align-items-center p-3 px-md-4 mb-3 bg-white border-bottom box-shadow">
            <h5 className="my-0 mr-md-auto font-weight-normal">School Library</h5>
            
            <ul className="nav">
                <li className="nav-item">
                    <NavLink to="/" exact activeClassName="active" className="nav-link">Home</NavLink>              
                </li>
                <li className="nav-item">
                    <NavLink to="/books" activeClassName="active" className="nav-link">Books</NavLink>
                </li>
                {privateLinks}            
            </ul>
            
            <span style={{ textAlign: "right" }}>
                <LoginInfo />
            </span>
        </div>
    );
}
