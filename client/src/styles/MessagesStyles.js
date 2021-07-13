import styled from "styled-components";

const CallText = styled.p`
  margin : 5px;
  font-family: 'Courier New', Courier, monospace;
  font-size: 20px;
  font-weight: 200;
  margin-top: 10px
`
const Messages = styled.div`
    width: 95%;
    height: 84%;
    // border: 1px solid black;
    overflow-y: auto;
    -ms-overflow-style: none;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
`;

const SendMessage = styled.div`
  display: flex;
  width: 95%;
  marginTop: 10px;
  marginBottom: 10px;
  background-color: white;
  height: 10%;
  border-radius: 20px;
  border: 1px solid black
`


const MessageBox = styled.textarea`
    width: 90%;
    height: 71%;
    border-radius: 0px;
    border: 0px;
    font-size: 18px;
    margin: 5px;
    margin-bottom: 3px;
    color: (white, white);
    margin-left: 10px;
    &:focus-visible {
      outline: none;
    }
    &::-webkit-scrollbar {
      display: none;
    }
`;

const Image = styled.img`
  height: 50%;
  width: 8%;
  margin-right: 10px;
  margin-top: 15px
`

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
    font-family: 'Courier New', Courier, monospace;
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
    font-family: 'Courier New', Courier, monospace;
`;



export {PartnerMessage, PartnerRow, MyMessage, MyRow, ButtonMessage, MessageBox, Messages, CallText, Image, SendMessage}