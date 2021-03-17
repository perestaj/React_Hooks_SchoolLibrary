import React, { ChangeEvent, FormEvent, FunctionComponent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { selectAuthors, selectPublishers } from "../../../common/commonSlice";
import { loadBookAsync, selectBook, updateBookAsync } from "../bookSlice";
import { Book } from "../models/book";
import Select, { OptionsType } from 'react-select';
import { Author } from "../../../common/author";

export const BookEditPage: FunctionComponent = () => {
    const params = useParams<{ id: string }>();
    const history = useHistory();
    const [model, setModel] = useState<Book>({
      title: '',
      additionalInformation: '',
      publisherID: 0,
      authorIds: []
    });

    const [titleError, setTitleError] = useState('');
    const [selectedAuthorsError, setSelectedAuthorsError] = useState('');
    const [publisherError, setPublisherError] = useState('');

    const dispatch = useDispatch();
    const book = useSelector(selectBook);

    const authors = useSelector(selectAuthors);
    const publishers = useSelector(selectPublishers);

    const bookId = Number(params.id);

    const authorOptions = (authors || []).map((author: Author) => {
      return {value: author.authorID, label: author.fullName};
    });

    const selectedAuthors = authorOptions.filter(author => book?.authorIds?.some(id => +author.value === id));

    useEffect(() => {
      dispatch(loadBookAsync(bookId));
    }, [dispatch, bookId]);

    useEffect(() => {
      setModel(book!);
    }, [book]);

    const changeHandler = (e: ChangeEvent<{name: string; value: string}>): void => {
      setModel( prevValues => {
          return { ...prevValues, [e.target.name]: e.target.value };
      });            
    };
     
    const selectedAuthorsChange = (options: OptionsType<{value: number; label: string; }>): void => {
      setModel( prevValues => {
        return { ...prevValues, authorIds: options.map(option => option.value) };
      }); 
    };

    const isAddMode = isNaN(bookId) || bookId < 1;
      
    const cancel = (event: React.MouseEvent): void => {
      event.preventDefault();
      history.push(`/books/details/${bookId}`);
    }

    const redirectToBooksList = (event: React.MouseEvent): void => {
      event.preventDefault();

      history.push("/books");
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
      event.preventDefault();

      // check if the form is valid, if it's ok then:
      if (model && isFormValid()) {
          dispatch(updateBookAsync(model, history));
      }        
    }

    function isFormValid(): boolean {
      let isValid = true;

      setTitleError('');
      setPublisherError('');
      setSelectedAuthorsError('');

      if (!model.title || model.title.length === 0) {
        setTitleError('Field required');
        isValid = false;
      }

      if (model.title && model.title.length > 100) {
        setTitleError('Max 100 characters are allowed');
        isValid = false;
      }

      if (!model.publisherID || model.publisherID <= 0) {
        setPublisherError('Select publisher');
        isValid = false;
      }

      if (!model.authorIds || model.authorIds.length === 0) {
        setSelectedAuthorsError('Select author(s)');
        isValid = false;
      }

      return isValid;
    }

    const returnButton = isAddMode ? (<button className="btn btn-secondary" onClick={redirectToBooksList}>Return</button>) :
     (<button className="btn btn-secondary" onClick={cancel}>Cancel</button>);
 
     if (!model) {
       return (<div></div>);
     }

     return (
         <div>          
           <h1 className="h3 mb-3 font-weight-normal text-center">
             {isAddMode ? 'Add Book' : 'Edit Book'}
           </h1>
           <div style={{ width: "800px", margin: "0 auto" }}>
             <form onSubmit={handleSubmit}>
               <div className="form-group row">
                 <label className="col-sm-3 col-form-label">Title:</label>
                 <div className="col-sm-9">                 
                     <input name="title" className="form-control" type="text" placeholder="Enter title" value={model.title} onChange={changeHandler} />
                     {titleError && <div className='text-danger'>{titleError} </div>}
                 </div>
               </div>
 
               <div className="form-group row">
                 <label className="col-sm-3 col-form-label">Author(s):</label>
                 <div className="col-sm-9">
                   <Select options={authorOptions} defaultValue={selectedAuthors} isMulti onChange={selectedAuthorsChange}></Select>
                   {selectedAuthorsError && <div className='text-danger'>{selectedAuthorsError} </div>}
                 </div>
               </div>
 
               <div className="form-group row">
                 <label className="col-sm-3 col-form-label">Publisher:</label>
                 <div className="col-sm-9">                 
                     <select name="publisherID" className="form-control" value={model.publisherID} onChange={changeHandler}>
                     <option key="0" value="0">-- select publisher --</option>
                         {(publishers || []).map(publisher => <option key={+publisher.publisherID} value={+publisher.publisherID}>{publisher.name}</option>)}
                     </select>
                     {publisherError && <div className='text-danger'>{publisherError} </div>}                                       
                 </div>
               </div>
 
               <div className="form-group row">
                 <label className="col-sm-3 col-form-label">Additional Information:</label>
                 <div className="col-sm-9">                  
                       <input name="additionalInformation" type="text" placeholder="Enter additional information" className="form-control" 
                        value={model.additionalInformation} onChange={changeHandler} />                        
                 </div>
               </div>
 
               <div className="form-group row">
                 <div className="col-sm-offset-3 col-sm-9">
                     <span style={{ marginRight: "20px" }}>
                         <button className="btn btn-primary" type="submit">{isAddMode ? 'Add' : 'Update' }</button>
                     </span>
                     {returnButton}
                 </div>
               </div>
             </form>
           </div>
           
         </div>
     )
 }

