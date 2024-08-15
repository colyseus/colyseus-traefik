import { Client, Room } from "colyseus.js";
import { cli, Options } from "@colyseus/loadtest";

export async function main(options: Options) {
    const client = new Client(options.endpoint);
    const room: Room = await client.joinOrCreate(options.roomName, {
      channel: "area" + Math.floor(Math.random() * 3),
    });

    if (Math.floor(Math.random() * 3) === 0) {
        setTimeout(() => room.sendBytes("wat", new Uint8Array([1,2,3,4,5,6,7,8,9,10])), 100);
    }


    // setTimeout(() => room.leave(), (Math.random() * 3) * 1000);

    room.onMessage("__playground_message_types", (payload) => {});
  room.onMessage("hello", (payload) => {
    console.debug("Hello world!");

  });

    room.onMessage("*", (payload) => {
        // logic
    });

    room.onStateChange((state) => {
        // console.log("state change:", state);
    });

    room.onLeave((code) => {
        console.log("left");
    });
}

cli(main);
