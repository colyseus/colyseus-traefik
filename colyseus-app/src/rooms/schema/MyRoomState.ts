import { Schema, Context, type, MapSchema, ArraySchema } from "@colyseus/schema";

export class Vec3 extends Schema {
  @type("number") x: number = 0;
  @type("number") y: number = 0;
  @type("number") z: number = 0;
}

export class Player extends Schema {
  @type(Vec3) position = new Vec3();
  @type("number") health: number = 100;
}

export class MyRoomState extends Schema {
  @type("string") mySynchronizedProperty: string = "Hello world";
  @type({ map: Player }) players = new MapSchema<Player>();
  // @type([Player]) players = new ArraySchema<Player>();
}
