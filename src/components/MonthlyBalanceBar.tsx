import styled from "styled-components";
import theme from "../theme";
import formatCurrency from "../functions/currencyConvertion";
import { useBalance } from "../hooks/useBalance";
import useMonthlyTotal from "../hooks/useMonthlyTotal";

const Bar = styled.div`
  background-color: ${theme.azulClaro};
  font-size: 1.25rem;
  letter-spacing: 1px;
  font-weight: 500;
  text-transform: uppercase;
  padding: 0.62rem 2.25rem;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 31.25rem) {
    flex-direction: column;
    font-size: 14px;
  }
`;

export default function MonthlyBalanceBar() {
  const { balance } = useBalance();
  const { total } = useMonthlyTotal();

  return (
    <Bar>
      <div>
        <p>Monthly balance:</p>
        <p>{formatCurrency(balance)}</p>
        <p>Total expenses:</p>
        <p>{formatCurrency(total)}</p>
      </div>
    </Bar>
  );
}
