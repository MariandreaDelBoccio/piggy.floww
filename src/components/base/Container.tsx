import { Helmet } from "react-helmet-async";
import { Header, Title } from "../../elements/Header";
import type { BaseContainerProps } from "../../types/types";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/20/solid";
import BaseButton from "./Button";

const BaseContainer = ({
  title,
  hasBackBtn,
  route,
  classes,
  children,
}: BaseContainerProps) => {
  const navigate = useNavigate();

  const propsClasses = classes ? classes : "bg-white m-6 border-2 rounded-lg";
  const propsRoute = route ? route : "/";

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      </Helmet>

      <div className={propsClasses}>
        <Header>
          {hasBackBtn && (
            <BaseButton hasIcon onClick={() => navigate(propsRoute)}>
              <ArrowLeftIcon />
            </BaseButton>
          )}

          <Title>{title}</Title>
        </Header>
        <div>{children}</div>
      </div>
    </>
  );
};

export default BaseContainer;
