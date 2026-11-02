// [restore] TODO: inferred from build — путь и имя файла выведены по структуре бандла (исходный путь неизвестен).
// [restore] Источник: index-B0UwuSD7 (8)
class O7 {
  options;
  request_id = 1;
  socket_;
  queue = [];
  callbacks = [];
  eventHandler;
  reconnectHandler;
  debug = false;
  initSocket_() {
    this.socket_ = new WebSocket(this.options.socketUrl);
    this.socket_.onmessage = this.onMessage.bind(this);
    this.socket_.onclose = () => {
      setTimeout(() => {
        if (this.debug) {
          console.log("WSS reconnect");
        }
        this.initSocket_();
      }, 1000);
    };
    this.socket_.onopen = () => {
      let t = "";
      for (this.reconnectHandler && this.reconnectHandler(); (t = this.queue.pop()); ) {
        this.socket.send(t);
      }
    };
  }
  closeSocket_() {
    this.socket_.onclose = () => {
      console.log("WebSocket is closed now.");
    };
    this.socket_.close();
  }
  get socket() {
    if (this.socket_) {
      return this.socket_;
    }
    return this.initSocket_(), this.socket_;
  }
  constructor(t, r) {
    this.debug = r;
    this.options = {
      ...t,
    };
  }
  onMessage(t) {
    let r;
    try {
      r = JSON.parse(t.data);
    } catch {}
    if (this.debug) {
      console.log(r);
    }
    if (typeof r === "object" && "jsonrpc" in r && r.jsonrpc === "2.0") {
      if ("method" in r) {
        this.eventHandler(r.method, r.params);
      } else if ("result" in r && this.callbacks[r.id]) {
        let n = this.callbacks[r.id].success_cb;
        delete this.callbacks[r.id];
        n({
          ...r.result,
        });
      } else if ("error" in r && this.callbacks[r.id]) {
        let n = this.callbacks[r.id].error_cb;
        let i = {
          ...this.callbacks[r.id],
        };
        delete this.callbacks[r.id];
        if (r.error.code === -32000 && this.options.login && this.options.passwd) {
          this.call(
            "login",
            {
              login: this.options.login,
              passwd: this.options.passwd,
              loginParams: this.options.loginParams,
              userVariables: this.options.userVariables,
            },
            (a) => {
              this.socketCall_(i);
            },
            (a) => {
              n({
                ...r.result,
              });
            }
          );
        } else {
          n({
            ...r.result,
          });
        }
      }
    }
  }
  socketCall_({ request, success_cb, error_cb }) {
    request.id = this.request_id++;
    let i = JSON.stringify(request);
    this.callbacks[request.id] = {
      request,
      success_cb,
      error_cb,
    };
    if (this.socket.readyState < 1) {
      this.queue.push(i);
      if (this.debug) {
        console.log("Queued", i);
      }
    } else {
      this.socket.send(i);
      if (this.debug) {
        console.log("Sent", i);
      }
    }
  }
  setEventHandler(t) {
    this.eventHandler = t;
  }
  setReconnectHandler(t) {
    this.reconnectHandler = t;
  }
  call(method, r, success_cb, error_cb) {
    let params = {
      ...r,
    };
    let request = {
      jsonrpc: "2.0",
      method,
      params,
      id: 0,
    };
    if (this.socket) {
      this.socketCall_({
        request,
        success_cb,
        error_cb,
      });
    }
  }
  close() {
    this.queue = [];
    this.callbacks = [];
    this.eventHandler = null;
    this.reconnectHandler = null;
    this.closeSocket_();
  }
}
const fv =
  typeof window !== "undefined" &&
  typeof window.crypto !== "undefined" &&
  typeof window.crypto.getRandomValues !== "undefined"
    ? () => {
        let e = new Uint16Array(8);
        window.crypto.getRandomValues(e);
        let t = (r) => {
          let n = r.toString(16);
          while (n.length < 4) {
            n = `0${n}`;
          }
          return n;
        };
        return `${t(e[0]) + t(e[1])}-${t(e[2])}-${t(e[3])}-${t(e[4])}-${t(e[5])}${t(e[6])}${t(
          e[7]
        )}`;
      }
    : () =>
        "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
          let t = (Math.random() * 16) | 0;
          return (e === "x" ? t : (t & 3) | 8).toString(16);
        });
class hv {
  event_handlers = {};
  debug;
  constructor(t) {
    this.debug = t;
  }
  subscribeEvent(t, code) {
    let id = fv();
    if (!this.event_handlers[t]) {
      this.event_handlers[t] = [];
    }
    this.event_handlers[t].push({
      id,
      code,
    });
    return id;
  }
  unsubscribeEvent(t, r) {
    if (r) {
      this.event_handlers[t] = this.event_handlers[t].map((n, i, a) => {
        if (n.id !== r) {
          return n;
        }
      });
    } else {
      this.event_handlers[t] = [];
    }
  }
  dispatchEvent(t, r) {
    if (this.debug) {
      console.log("Dispatch", t, r);
    }
    if (this.event_handlers[t]) {
      for (let n of this.event_handlers[t]) {
        n.code(r);
      }
    }
  }
}
const Nh = {
  Incoming: 0,
  0: "Incoming",
  Outgoing: 1,
  1: "Outgoing",
};
class N7 extends hv {
  pc;
  state = 0;
  presdp;
  direction = 0;
  ice_timer;
  ice_timeout;
  constructor(t, r, n, i) {
    super(i);
    this.ice_timeout = n || 3000;
    t.iceCandidatePoolSize = "iceCandidatePoolSize" in t ? t.iceCandidatePoolSize : 1;
    this.pc = new RTCPeerConnection(t);
    this.pc.ontrack = this.onTrack.bind(this);
    this.pc.onnegotiationneeded = this.onNegotiation.bind(this);
    this.pc.onicecandidate = this.onCandidate.bind(this);
    this.pc.onicegatheringstatechange = this.onIceGatheringStateChange.bind(this);
    if (typeof r !== "undefined") {
      this.direction = r;
    }
  }
  onTrack(t) {
    this.dispatchEvent("track", t.track);
  }
  onCandidate(t) {}
  onIceGatheringStateChange(t) {
    if (this.pc.iceGatheringState === "complete") {
      if (this.ice_timer) {
        clearTimeout(this.ice_timer);
      }
      if (this.state === 2) {
        return;
      }
      if (this.direction) {
        this.dispatchEvent("send-offer", this.pc.localDescription);
      } else {
        this.dispatchEvent("send-answer", this.pc.localDescription);
      }
    }
  }
  iceTimerTriggered() {
    if (this.debug) {
      console.log(this.pc);
    }
    if (this.state === 1) {
      this.state = 2;
      if (this.direction) {
        this.dispatchEvent("send-offer", this.pc.localDescription);
      } else {
        this.dispatchEvent("send-answer", this.pc.localDescription);
      }
    }
  }
  onNegotiation() {
    this.pc
      .createOffer()
      .then((t) => {
        this.ice_timer = setTimeout(this.iceTimerTriggered.bind(this), this.ice_timeout);
        return this.pc.setLocalDescription(t);
      })
      .then(() => {
        this.state = 1;
      })
      .catch((t) => {});
  }
  getStats() {
    if (this.pc) {
      return this.pc.getStats();
    }
    return Promise.reject();
  }
  onMedia(sdp) {
    this.pc
      .setRemoteDescription(
        new RTCSessionDescription({
          type: "answer",
          sdp,
        })
      )
      .then(() => {
        if (this.debug) {
          console.log("got remote media");
        }
      })
      .catch((r) => {
        if (this.debug) {
          console.log("remote media error", r);
        }
      });
  }
  preSdp(t) {
    this.presdp = t;
  }
  addTrack(t) {
    this.pc.addTrack(t);
  }
  answer(t) {
    for (let r of t) {
      this.pc.addTrack(r);
    }
    this.ice_timer = setTimeout(this.iceTimerTriggered.bind(this), this.ice_timeout);
    this.pc
      .setRemoteDescription(
        new RTCSessionDescription({
          type: "offer",
          sdp: this.presdp,
        })
      )
      .then(() => {
        this.pc.createAnswer().then((r) => {
          this.pc.setLocalDescription(r);
          this.state = 1;
        });
      });
  }
}
const Vr = {
  Invite: "verto.invite",
  Answer: "verto.answer",
  Bye: "verto.bye",
  Media: "verto.media",
  Modify: "verto.modify",
  Info: "verto.info",
};
class c0 extends hv {
  rtc;
  rpc;
  id;
  options;
  direction;
  holdStatus;
  constructor(t, r, destination_number, i, a, o, s) {
    super(s);
    this.id = i || fv();
    this.options = a || {};
    this.direction = destination_number ? Nh.Outgoing : Nh.Incoming;
    this.rtc = new N7(t, this.direction, o, s);
    this.rpc = r;
    this.rtc.subscribeEvent("send-offer", (l) => {
      let dialogParams = {
        ...this.options,
      };
      dialogParams = Object.assign(dialogParams, {
        destination_number,
        callID: this.id,
      });
      this.rpc.call(
        Vr.Invite,
        {
          dialogParams,
          sdp: l.sdp,
        },
        (u) => {},
        (u) => {}
      );
    });
    this.rtc.subscribeEvent("send-answer", (l) => {
      this.rpc.call(
        Vr.Answer,
        {
          dialogParams: {
            destination_number,
            callID: this.id,
          },
          sdp: l.sdp,
        },
        (c) => {},
        (c) => {}
      );
    });
    this.rtc.subscribeEvent("track", (l) => {
      this.dispatchEvent("track", l);
    });
  }
  getStats() {
    return this.rtc.getStats();
  }
  onAnswer(t) {
    if (t) {
      this.rtc.onMedia(t);
    }
    if (this.debug) {
      console.log("answer");
    }
    this.dispatchEvent("answer");
  }
  onMedia(t) {
    this.rtc.onMedia(t);
    this.dispatchEvent("media");
  }
  addTrack(t) {
    this.rtc.addTrack(t);
  }
  preSdp(t) {
    this.rtc.preSdp(t);
  }
  answer(t) {
    this.rtc.answer(t);
  }
  hangup(t = {}) {
    this.rpc.call(
      Vr.Bye,
      {
        dialogParams: {
          callID: this.id,
        },
        ...t,
      },
      (r) => {},
      (r) => {}
    );
    this.clear();
  }
  clear() {
    this.dispatchEvent("bye", this);
  }
  dtmf(t) {
    this.rpc.call(
      Vr.Info,
      {
        dtmf: t.toString(),
        dialogParams: {
          callID: this.id,
        },
      },
      (r) => {},
      (r) => {}
    );
  }
  hold(t) {
    this.rpc.call(
      Vr.Modify,
      {
        action: "hold",
        dialogParams: {
          callID: this.id,
          ...this.options,
          ...t,
        },
      },
      (r) => {
        if (r.holdState === "held") {
          this.holdStatus = true;
          this.dispatchEvent("hold", this);
        } else {
          this.holdStatus = false;
          this.dispatchEvent("unhold", this);
        }
      },
      (r) => {}
    );
  }
  unhold(t) {
    this.rpc.call(
      Vr.Modify,
      {
        action: "unhold",
        dialogParams: {
          callID: this.id,
          ...this.options,
          ...t,
        },
      },
      (r) => {
        if (r.holdState === "held") {
          this.holdStatus = true;
          this.dispatchEvent("hold", this);
        } else {
          this.holdStatus = false;
          this.dispatchEvent("unhold", this);
        }
      },
      (r) => {}
    );
  }
  toggleHold(t) {
    this.rpc.call(
      Vr.Modify,
      {
        action: "toggleHold",
        dialogParams: {
          callID: this.id,
          ...this.options,
          ...t,
        },
      },
      (r) => {
        if (r.holdState === "held") {
          this.holdStatus = true;
          this.dispatchEvent("hold", this);
        } else {
          this.holdStatus = false;
          this.dispatchEvent("unhold", this);
        }
      },
      (r) => {}
    );
  }
}
class k7 extends hv {
  calls = {};
  rpc;
  options;
  sessid;
  logged_in = false;
  constructor(t) {
    super(t.debug);
    this.options = t;
    this.rpc = new O7(t.transportConfig, t.debug);
    this.rpc.setEventHandler((r, n) => {
      switch (r) {
        case Vr.Answer: {
          let i = n.callID;
          this.calls[i].onAnswer(n.sdp);
          break;
        }
        case Vr.Media: {
          let i = n.callID;
          this.calls[i].onMedia(n.sdp);
          break;
        }
        case Vr.Invite: {
          let i = new c0(
            this.options.rtcConfig,
            this.rpc,
            "",
            n.callID,
            {
              caller_id_name: n.caller_id_name,
              caller_id_number: n.caller_id_number,
            },
            this.options.ice_timeout,
            this.options.debug
          );
          i.preSdp(n.sdp);
          this.calls[n.callID] = i;
          this.dispatchEvent("invite", i);
          break;
        }
        case Vr.Bye: {
          this.calls[n.callID].clear();
          delete this.calls[n.callID];
          break;
        }
      }
    });
    this.rpc.setReconnectHandler(() => {
      if (this.logged_in) {
        this.login();
      }
    });
    this.options.rtcConfig = {
      ...(this.options.rtcConfig || {}),
    };
  }
  login() {
    return new Promise((resolve, reject) => {
      this.rpc.call(
        "login",
        {
          login: this.options.transportConfig.login,
          passwd: this.options.transportConfig.passwd,
        },
        (n) => {
          this.sessid = n.sessid;
          this.logged_in = true;
          resolve(n);
        },
        (n) => {
          reject(n);
        }
      );
    });
  }
  call(t, r, n) {
    let i = new c0(
      this.options.rtcConfig,
      this.rpc,
      r,
      fv(),
      n,
      this.options.ice_timeout,
      this.options.debug
    );
    for (let a of t) {
      i.addTrack(a);
    }
    this.calls[i.id] = i;
    return i;
  }
  isLogged() {
    return this.logged_in;
  }
  logout() {
    if (this.calls) {
      Object.keys(this.calls).forEach((t) => {
        this.calls[t].hangup();
      });
    }
    this.rpc.close();
    this.rpc = null;
    this.sessid = null;
    this.logged_in = false;
  }
}
export { k7 };
