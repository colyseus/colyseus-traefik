import { Room, Client } from "@colyseus/core";
import { MyRoomState, Player } from "./schema/MyRoomState.js";

export class MyRoom extends Room {
  maxClients = 10;

  async onCreate (options: any) {
    this.setState(new MyRoomState());

    this.onMessage("*", (client, type, message) => {
      console.log(type, message)
      //
      // handle "type" message
      //
    });
  }

  async onJoin (client: Client, options: any) {
    console.log(client.sessionId, "joined!", client.auth);

    const player = new Player();
    this.state.players.set(client.sessionId, player);
  }

  onLeave (client: Client, consented: boolean) {
    console.log(client.sessionId, "left!");
    this.state.players.delete(client.sessionId);
  }

  onDispose() {
    // console.log("room", this.roomId, "disposing...");
  }

}
