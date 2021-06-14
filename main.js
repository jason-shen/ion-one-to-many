const pubVideo = document.getElementById("pub_video");
const subVideo = document.getElementById("sub_video");
const bntPubCam = document.getElementById("bnt_pubcam");
const bntPubScreen = document.getElementById("bnt_pubscreen");

const serverURL = "ws://localhost:7000/ws";

const config = {
  iceServers: [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ],
};

const signalLocal = new Signal.IonSFUJSONRPCSignal(serverURL);
const clientLocal = new IonSDK.Client(signalLocal, config);

signalLocal.onopen = () => clientLocal.join("test session");

const start = (type) => {
  if (type) {
    IonSDK.LocalStream.getUserMedia({
      resolution: "vga",
      audio: true,
      codec: "vp8",
    }).then((media) => {
      pubVideo.srcObject = media;
      pubVideo.autoplay = true;
      pubVideo.controls = true;
      pubVideo.muted = true;
      bntPubCam.disabled = true;
      bntPubScreen.disabled = true;
      clientLocal.publish(media);
    }).catch(console.error);
  } else {
    IonSDK.LocalStream.getDisplayMedia({
      resolution: "vga",
      audio: true,
      codec: "vp8",
    }).then((media) => {
      pubVideo.srcObject = media;
      pubVideo.autoplay = true;
      pubVideo.controls = true;
      pubVideo.muted = true;
      bntPubCam.disabled = true;
      bntPubScreen.disabled = true;
      clientLocal.publish(media);
    }).catch(console.error);
}
}

clientLocal.ontrack = (track, stream) => {
  console.log("got track: ", track.id, "for stream: ", stream.id);
   track.onunmute = () => {
    subVideo.srcObject = stream;
    subVideo.autoplay = true;
    subVideo.muted = false;

  stream.onremovetrack = () => {
    subVideo.srcObject = null;
  }
  }
}