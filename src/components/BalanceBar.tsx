import styled from "styled-components";
import { useBalance } from "../hooks/useBalance";
import formatCurrency from "../functions/currencyConvertion";
import useIsMobile from "../hooks/useIsMobile";
import useMonthlyTotal from "../hooks/useMonthlyTotal";
import theme from "../theme";

const BalanceBarStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.7rem 2rem;
  flex: 1;
  background: ${theme.rojo}

  @media (max-width: 31.25rem) {
    justify-content: center!important;

    .balance-amount,
    p {
      font-size: 14px;
    }
  }
`;

const BalanceBar = () => {
  const { balance } = useBalance();
  const { total } = useMonthlyTotal();
  const isMobile = useIsMobile();

  return (
    <BalanceBarStyled>
      <div className="mr-6">
        <p className="font-light">
          {!isMobile && "Available"} Balance:{" "}
          <span className="font-medium">{formatCurrency(balance)}</span>
        </p>
      </div>
      <div>
        <p className="font-light">
          Monthly expenses:{" "}
          <span className="font-medium">{formatCurrency(total)}</span>
        </p>
      </div>
    </BalanceBarStyled>
  );
};

export default BalanceBar;
