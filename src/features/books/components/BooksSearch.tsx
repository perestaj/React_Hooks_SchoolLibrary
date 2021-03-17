import React, { ChangeEvent, FunctionComponent } from "react";
import { Author } from "../../../common/author";
import { BooksSearchFilter } from "../models/booksSearchFilter";

type Props = {
    authors?: Author[];
    filter: BooksSearchFilter;
    showAddButton: boolean;
    filterChanged: (filter: BooksSearchFilter) => void;
    add: (event: React.MouseEvent) => void;
}

export const BooksSearch: FunctionComponent<Props> = ({authors, filter, showAddButton, filterChanged, add}) => {          
    const handleInputChange = (e: ChangeEvent<{name: string; value: string; checked?: boolean}>): void => {
        let newFilter: BooksSearchFilter;

        if (e.target.name === 'onlyAvailable') {
            newFilter = {...filter, onlyAvailable: !!e.target.checked};
        } else {
            newFilter = {...filter, [e.target.name]: e.target.value}
        }
        
        filterChanged(newFilter);
     };

    return (
        <div style={{width: '95%', margin: '0 auto'}}>
            <form>
                {showAddButton &&
                (
                    <div className="form-group">               
                        <div>
                            <button className="btn btn-primary" onClick={event => add(event)}>Add</button>
                        </div>                
                    </div>
                )}
                <div className="form-row">
                    <div className="col-md-3 mb-3">
                        <label></label>
                        <div>
                            <input type="checkbox" id="chkOnlyAvailable" className="form-check-input" name="onlyAvailable" checked={filter.onlyAvailable}
                                onChange={handleInputChange} />

                            <label className="form-check-label" htmlFor="chkOnlyAvailable">Only available</label>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <label>Title:</label>
                        <div>
                            <input type="text" name="title" className="form-control" value={filter.title} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="col-md-3 mb-3">
                        <label className="control-label">Author(s):</label>
                        <div>
                            <select name="authorID" value={filter.authorID} onChange={handleInputChange} className="form-control">
                                <option value='0'>-- ALL --</option>
                                {(authors || []).map((author: Author) => (
                                <option key={author.authorID} value={author.authorID}>
                                    {author.fullName}
                                </option>
                                ))}
                            </select>
                        </div>
                    </div>                    
                </div>                
            </form>
        </div>
    );    
}
