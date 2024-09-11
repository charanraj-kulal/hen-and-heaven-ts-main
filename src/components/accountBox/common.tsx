import styled from "styled-components";

export const BoxContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10px;
`;

export const FormContainer = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const MutedLink = styled.a`
  font-size: 12px;
  color: rgba(0, 0, 0, 0.8);
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px dashed rgba(0, 0, 0, 0.8);
`;

export const BoldLink = styled.a`
  font-size: 12px;
  color: #df1c1f;
  font-weight: 500;
  text-decoration: none;
  border-bottom: 1px dashed rgba(241, 196, 15, 1);
`;
export const HomeLink = styled.a`
  display: flex;
  justify-content: center;
  font-size: 12px;
  color: #000000;
  font-weight: 500;
  text-decoration: none;
`;
export const Input = styled.input`
  width: 100%;
  height: 42px;
  outline: none;
  color: #000;
  background-color: #f5f5f5;
  border: 1px solid black;
  border-radius: 5px;
  padding: 0px 10px;
  transition: all 200ms ease-in-out;
  margin-bottom: 5px;

  &::placeholder {
    color: rgba(0, 0, 0, 0.7);
  }

  &:focus {
    outline: none;
    border-bottom: 1px solid rgba(241, 196, 15, 1);
  }
`;

export const SubmitButton = styled.button`
  width: 100%;
  max-width: 150px;
  padding: 10px;
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  border: none;
  border-radius: 100px;
  cursor: pointer;
  transition: all 240ms ease-in-out;
  background-color: #df1c1f;
  &:hover {
    filter: brightness(1.03);
  }
`;

export const LineText = styled.p`
  font-size: 12px;
  color: rgba(200, 200, 200, 0.8);
  font-weight: 500;
  color: #000;
`;
