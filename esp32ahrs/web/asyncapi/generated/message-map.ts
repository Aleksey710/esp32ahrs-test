import * as Msg from "./types";

export type MessageMap = {
  hello: Msg.hello;
  ahrs: Msg.ahrs;
  heartbeat: Msg.heartbeat;
  acknowledge: Msg.acknowledge;
};
