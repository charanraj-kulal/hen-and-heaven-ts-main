import React from "react";
import styled from "styled-components";

interface MarginProps {
  $margin: string | number;
}

const HorizontalMargin = styled.span<MarginProps>`
  display: flex;
  width: ${({ $margin }) =>
    typeof $margin === "string" ? $margin : `${$margin}px`};
`;

const VerticalMargin = styled.span<MarginProps>`
  display: flex;
  height: ${({ $margin }) =>
    typeof $margin === "string" ? $margin : `${$margin}px`};
`;

interface MarginerProps {
  direction?: "horizontal" | "vertical";
  margin: string | number;
}

export const Marginer: React.FC<MarginerProps> = ({
  direction = "horizontal",
  margin,
}) => {
  if (direction === "horizontal") return <HorizontalMargin $margin={margin} />;
  return <VerticalMargin $margin={margin} />;
};

Marginer.defaultProps = {
  direction: "horizontal",
};
