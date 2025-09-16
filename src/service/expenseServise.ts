import { server } from "../utils/server";
import { CreateField } from "../types/expense";

const createField = async (CreateField: CreateField) => {
    return server.post(`/field/createField`, CreateField)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

const getExpensePoll = async () => {
    return server.get('/field/')
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}


const expenseServices = {
    createField,
    getExpensePoll
}

export default expenseServices;