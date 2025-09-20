import { server } from "../utils/server";
import { CreateField, FixedExpense } from "../types/expense";

const createField = async (CreateField: CreateField) => {
    return server.post(`/field/createField`, CreateField)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

const getExpensePoll = async (fieldType?: string) => {
    return server.get(`/field/?fieldType=${fieldType}`)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}
const createFixedExpense = async (FixedExpense: FixedExpense) => {
    console.log(FixedExpense)
    return server.post(`/field/add-fixed-expenses`, FixedExpense)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

const getFixedExpense = async ( fieldType: string ) => {
    return server.get(`/field/${fieldType}`)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}
const createFieldsExpense = async (fieldId:string,addFields: FixedExpense) => {
    console.log(addFields)
    return server.post(`/field/add-expense/${fieldId}`, addFields)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

const updateFieldsExpense = async ( expenseId: string, updateFields: FixedExpense) => {
    console.log(updateFields)
    return server.put(`/expenses/udpateExpense/${expenseId}`, updateFields)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

const deleteFieldsExpense = async (fieldId: string) => {
    return server.delete(`/expenses/deleteExpense/${fieldId}`)
        .then((res) => {
            return res.data
        })
        .catch((error) => {
            return error
        })
}

const expenseServices = {
    createField,
    getExpensePoll,
    createFixedExpense,
    getFixedExpense,
    createFieldsExpense,
    updateFieldsExpense,
    deleteFieldsExpense
}

export default expenseServices;