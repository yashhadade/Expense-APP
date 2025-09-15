import { server } from "../utils/server";
import { CreateField } from "../types/expense";

const createField =async (CreateField:CreateField)=>{
    console.log("CreateField",CreateField)
     return server.post(`/field/createField`,CreateField)
        .then((res)=>{
            return res.data
        })
        .catch((error)=>{
            return error
        })
} 

const expenseServices = {
    createField
}

export default expenseServices;