import React, { Fragment } from "react";
import { FunctionComponent } from "react"

type Props = {
    title: string;
    field: string;
    sortField: string;
    sort: () => void;
};

export const TableHeader: FunctionComponent<Props> = ({title, field, sortField, sort}) => {
    return (
        <button className="btn btn-link" onClick={() => sort()}>
            {field===sortField ? (<u><strong>{title}</strong></u>) : (<Fragment>{title}</Fragment>) }
        </button>
    )    
}
