import React from "react";

interface timeFieldProps {
    width: number
}

const TimeField: React.FC<timeFieldProps> = ({width}) => {

    return(
        <div style={{width: width+'px', height:'30px', display:'flex', borderTop: '1px solid black', boxSizing: 'border-box'}}>
            
        </div>
    )
}

export default TimeField;