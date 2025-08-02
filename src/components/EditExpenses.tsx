import { Helmet } from "react-helmet-async"
import { Header, Title } from "../elements/Header"
import BackBtn from "../elements/BackBtn"
import ExpensesForm from "./ExpensesForm"
import { useParams } from "react-router-dom"
import useGetExpense from "../hooks/useGetExpense"

function EditExpenses() {
    const { id } = useParams()
    const [expense] = useGetExpense(id as string)

    return (
        <>
            <Helmet>
                <title>Edit Expense</title>
                <link rel="icon" type="image/x-icon" href='../public/favicon.ico' />
            </Helmet>
            <Header>
                <BackBtn route="/list" />
                <Title>Edit expense</Title>
            </Header>

            <ExpensesForm expense={expense}/>
        </>
    )
}

export default EditExpenses