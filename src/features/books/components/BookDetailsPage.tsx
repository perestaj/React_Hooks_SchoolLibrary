import React, { FunctionComponent, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { canEditBook } from "../../../authorization/authorization";
import { selectCurrentUser } from "../../../authorization/authorizationSlice";
import { loadBookAsync, selectBook } from "../bookSlice";

export const BookDetailsPage: FunctionComponent = () => {
    const dispatch = useDispatch();
    const currentUser = useSelector(selectCurrentUser);
    const book = useSelector(selectBook);
    const params = useParams<{ id: string }>();
    const history = useHistory();
    
    const bookId = Number(params.id);
    const showEditButton = canEditBook(currentUser);

    useEffect(() => {
        dispatch(loadBookAsync(bookId));
    }, [dispatch, bookId]);

    const edit = (event: React.MouseEvent): void => {
        event.preventDefault();

        history.push(`/books/edit/${bookId}`);
    }

    const redirectToBooksList = (event: React.MouseEvent): void => {
        event.preventDefault();

        history.push("/books");
    }
    
     return (
         <div>          
           <h1 className="h3 mb-3 font-weight-normal text-center">
             Book Details
           </h1>
           <div style={{ width: "800px", margin: "0 auto" }}>
             <form>
               <div className="form-group row">
                 <label className="col-sm-3 col-form-label">Title:</label>
                 <div className="col-sm-9">                                   
                   <label className="col-form-label">{book?.title}</label>
                 </div>
               </div>
 
               <div className="form-group row">
                 <label className="col-sm-3 col-form-label">Author(s):</label>
                 <div className="col-sm-9">
                  <label className="col-form-label">{book?.authorsList}</label>
                 </div>
               </div>
 
               <div className="form-group row">
                 <label className="col-sm-3 col-form-label">Publisher:</label>
                 <div className="col-sm-9">
                  <label className="col-form-label">{book?.publisherName}</label>
                 </div>
               </div>
 
               <div className="form-group row">
                 <label className="col-sm-3 col-form-label">Additional Information:</label>
                 <div className="col-sm-9">
                  <label className="col-form-label">{book?.additionalInformation}</label>
                 </div>
               </div>
 
               <div className="form-group row">
                 <div className="col-sm-offset-3 col-sm-9">
                 {showEditButton&&
                   <span style={{ marginRight: "20px" }}>
                     <button className="btn btn-primary" onClick={(event: React.MouseEvent) => edit(event)}>Edit</button>
                   </span>
                 }
                   <button className="btn btn-secondary" onClick={(event: React.MouseEvent) => redirectToBooksList(event)}>Return</button>
                 </div>
               </div>
             </form>
           </div>          
         </div>
     )
 }