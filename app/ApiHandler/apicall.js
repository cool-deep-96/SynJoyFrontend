import axios from 'axios';
import toast from 'react-hot-toast';

async function apicall  (
    method,
    url,
    data,
    headers
){

        const response = await axios({
            method,
            url,
            data,
            headers,
        }).then((response )=>{
            return response.data;
        }).catch((error) => {
            if(error.response){
                throw new Error (error.response.data.message);
            }
            else if(error.request){
                toast.error(error.message);
                throw new Error("Network Error occured");
            }else{
                throw new Error(error.message);
            }     
        })
        return response;   
}

export default apicall;