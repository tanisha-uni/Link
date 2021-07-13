import styled from "styled-components";

const CallText = styled.p`
  margin : 5px;
`
const Messages = styled.div`
    width: 95%;
    height: 86%;
    // border: 1px solid black;
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &:-webkit-scrollbar {
      display: none;
    }
`;

const MessageBox = styled.textarea`
    width: 100%;
    height: 100%;
`;

const ButtonMessage = styled.div`
    width: 10%;
    // border: 1px solid black;
    height: 100%;
    border-radius: 5px;
    cursor: pointer;
    background-color: black;
    color: white;
    font-size: 18px;
`;

const MyRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
`;

const MyMessage = styled.div`
  width: 80%;
  // background-color: grey;
  color: black;
  padding: 5px;
  margin-right: 5px;
  text-align: right;
  border-radius: 5px;
    border: 2px solid black;
`;

const PartnerRow = styled(MyRow)`
  justify-content: flex-start;
`;

const PartnerMessage = styled.div`
  width: 80%;
  // background-color: grey;
  color: black;
  border: 1px solid lightgray;
  padding: 5px;
  margin-left: 5px;
  text-align: left;
  border-radius: 5px;
    border: 2px solid black;
`;

export {PartnerMessage, PartnerRow, MyMessage, MyRow, ButtonMessage, MessageBox, Messages, CallText}