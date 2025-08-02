import styled from "styled-components";
import theme from "../theme";
import formatCurrency from "../functions/currencyConvertion";
import useMonthlyTotal from "../hooks/useMonthlyTotal";
import useIsMobile from "../hooks/useIsMobile";

const TotalBarStyled = styled.div`
  background: ${theme.verde};
  font-weight: bold;
  padding: 0.7rem 2rem;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;

  @media (max-width: 31.25rem) {
    /* 500px */
    flex-direction: column;
    font-size: 14px;
  }
`;

const TotalBar = () => {
  const { total } = useMonthlyTotal();
  const isMobile = useIsMobile()

  return (
    <TotalBarStyled>
      <p>{!isMobile ? 'Monthly total:' : 'Expenses:'}</p>
      <p>{formatCurrency(total)}</p>
    </TotalBarStyled>
  );
};

export default TotalBar;
