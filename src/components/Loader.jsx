//import React from 'react';
import {LoaderIcon} from "lucide-react";

const Loader = () => {
    return (
        <div>
            <LoaderIcon color={'#000000'} size={52} className={'animate-spin text-white mx-auto my-5'}/>
        </div>
    );
};

export default Loader;