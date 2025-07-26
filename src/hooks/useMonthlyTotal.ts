import { useContext } from "react"
import { TotalMonthlyAmountContext } from "../context/TotalMonthlyAmountContext"

const useMonthlyTotal = () => useContext(TotalMonthlyAmountContext)

export default useMonthlyTotal