export interface CreateField{
    fieldName: string;
  RecivedAmount?: string;
  fieldType: "Personal" | "Team" ;
  expiry?: string;
}

export interface FixedExpense{
  desc: string;
    category: string;
    date: string;
    price: number;
    fieldId?: string;
}