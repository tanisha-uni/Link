import React, { useRef, useEffect, useState } from "react";
import io from "socket.io-client";
import { PartnerMessage, PartnerRow, MyMessage, MyRow, ButtonMessage, MessageBox, Messages, CallText } from '../styles/MessagesStyles'
import '../styles/RoomStyles.css'


const Room = (props) => {
    const userVideo = useRef();
    const partnerVideo = useRef();
    const peerRef = useRef();
    const socketRef = useRef();
    const otherUser = useRef();
    const userStream = useRef();
    const senders = useRef([]);
    const sendChannel = useRef();
    const [text, setText] = useState("");
    const [messages, setMessages] = useState([]);
  //

    useEffect(() => {
            
            navigator.mediaDevices.getUserMedia({ audio: true, video: true }).then(stream => {
            userVideo.current.srcObject = stream;
            userStream.current = stream;

            try { socketRef.current = io.connect("/");  console.log('connection done')}
                catch (err) { console.log(err) }
            
            try
                {
                socketRef.current.emit("join room", props.match.params.roomID);
                console.log('join room working')
                } catch(err) { console.log('error is' , err) }

            socketRef.current.on('other user', userID => {
                callUser(userID);
                otherUser.current = userID;
            });

            socketRef.current.on("user joined", userID => {
                otherUser.current = userID;
            });

            socketRef.current.on("offer", handleRecieveCall);

            socketRef.current.on("answer", handleAnswer);

            socketRef.current.on("ice-candidate", handleNewICECandidateMsg);
           })
           

    }, []);

//   useEffect(() => {
//     document.addEventListener("visibilitychange", event => {
//       if (document.visibilityState === 'hidden') {
//         if (document.pictureInPictureElement) {
//           document.exitPictureInPicture();
//           }
//       }
//       })
//     })
    
  
    function callUser(userID) {
        peerRef.current = createPeer(userID);
        userStream.current.getTracks().forEach(track =>
        senders.current.push(
          peerRef.current.addTrack(track, userStream.current
          )
        )
      );
      //
      sendChannel.current = peerRef.current.createDataChannel("sendChannel")
      sendChannel.current.onmessage = handleRecieveMessage;
      //
  }
  //
  function handleRecieveMessage(e) {
    setMessages(messages => [...messages, {yours: false, value: e.data}])
  }
  //

    function createPeer(userID) {
        const peer = new RTCPeerConnection({
            iceServers: [
                {
                    urls: "stun:stun.stunprotocol.org"
                },
                {
                    urls: 'turn:numb.viagenie.ca',
                    credential: 'muazkh',
                    username: 'webrtc@live.com'
                },
            ]
        });

        peer.onicecandidate = handleICECandidateEvent;
        peer.ontrack = handleTrackEvent;
        peer.onnegotiationneeded = () => handleNegotiationNeededEvent(userID);

        return peer;
    }

    function handleNegotiationNeededEvent(userID) {
        peerRef.current.createOffer().then(offer => {
            return peerRef.current.setLocalDescription(offer);
        }).then(() => {
            const payload = {
                target: userID,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            };
            socketRef.current.emit("offer", payload);
        }).catch(e => console.log(e));
    }

    function handleRecieveCall(incoming) {
      peerRef.current = createPeer();
      //
      peerRef.current.ondatachannel = (event) => {
        sendChannel.current = event.channel;
        sendChannel.current.onmessage = handleRecieveMessage;
      }
        const desc = new RTCSessionDescription(incoming.sdp);
        peerRef.current.setRemoteDescription(desc).then(() => {
            userStream.current.getTracks().forEach(track => peerRef.current.addTrack(track, userStream.current));
        }).then(() => {
            return peerRef.current.createAnswer();
        }).then(answer => {
            return peerRef.current.setLocalDescription(answer);
        }).then(() => {
            const payload = {
                target: incoming.caller,
                caller: socketRef.current.id,
                sdp: peerRef.current.localDescription
            }
            socketRef.current.emit("answer", payload);
        })
    }

    function handleAnswer(message) {
        const desc = new RTCSessionDescription(message.sdp);
        peerRef.current.setRemoteDescription(desc).catch(e => console.log(e));
    }

    function handleICECandidateEvent(e) {
        if (e.candidate) {
            const payload = {
                target: otherUser.current,
                candidate: e.candidate,
            }
            socketRef.current.emit("ice-candidate", payload);
        }
    }

    function handleNewICECandidateMsg(incoming) {
        const candidate = new RTCIceCandidate(incoming);

        peerRef.current.addIceCandidate(candidate)
            .catch(e => console.log(e));
    }

    function handleTrackEvent(e) {
        partnerVideo.current.srcObject = e.streams[0];
    };

    function shareScreen() {
        navigator.mediaDevices.getDisplayMedia({ cursor: true }).then(stream => {
            const screenTrack = stream.getTracks()[0];
            senders.current.find(sender => sender.track.kind === 'video').replaceTrack(screenTrack);
            screenTrack.onended = function() {
                senders.current.find(sender => sender.track.kind === "video").replaceTrack(userStream.current.getTracks()[1]);
            }
        })
    }


  function requestPictureInPicture() {
    partnerVideo.current.requestPictureInPicture();
  }

  function handleChange(e) {
    setText(e.target.value);
}

  function sendMessage() {
    sendChannel.current.send(text)
    setMessages(messages => [...messages, { yours: true, value: text }])
    setText('');
  }

  function renderMessage(message, index) {
    if (message.yours) {
        return (
            <MyRow key={index}>
                <MyMessage>
                    {message.value}
                </MyMessage>
            </MyRow>
        )
    }

    return (
        <PartnerRow key={index}>
            <PartnerMessage>
                {message.value}
            </PartnerMessage>
        </PartnerRow>
    )
}
    return (
        <div className='container-room'>
            <div className='body-room'>
                <div className='videos-room'>
                    <div style={{ display: 'flex' }}>
                    <video className='video' muted autoPlay ref={userVideo} />
                    <video className='video' autoPlay ref={partnerVideo} /> 
                    </div>
                    <div>
                    <button onClick={shareScreen}>Share screen</button>
                    <button onClick={requestPictureInPicture}>Picture In Picture</button>
                    </div>
                </div>

                <div className='chat-room'>
                    <CallText>In-Call Messagess</CallText>
                <Messages className = "messages">
                 {messages.map(renderMessage)}
                </Messages>
                    <div style={{ display: 'flex', width: '95%', marginTop: '10px'}}>
                    <MessageBox value={text} onChange={handleChange} placeholder="..." />
                        <ButtonMessage onClick={sendMessage}>
                    </ButtonMessage>
                </div>
                </div>
            </div>
        </div>
    )
};

export default Room;