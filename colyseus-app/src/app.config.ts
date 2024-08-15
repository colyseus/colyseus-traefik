import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";

/**
 * Import your Room files
 */
import { MyRoom } from "./rooms/MyRoom.js";
import { RedisDriver } from "@colyseus/redis-driver";
import { RedisPresence } from "@colyseus/redis-presence";
import { matchMaker } from "colyseus";

const port = process.env.PORT || 2567;
const subdomain = `node-${port}`;
const publicAddress = `${subdomain}.yourgamedomain.com`;

export default config({

    options: {
      presence: new RedisPresence(),
      driver: new RedisDriver(),
      publicAddress,
    },

    initializeGameServer: async (gameServer) => {
      /**
       * Define your room handlers:
       */
      gameServer.define('my_room', MyRoom).filterBy(['channel']);

      // Set up Traefik router
      matchMaker.presence.set(`traefik/http/routers/${subdomain}/rule`, `Host(\`${publicAddress}\`)`);
      matchMaker.presence.set(`traefik/http/routers/${subdomain}/service`, subdomain);

      // Set up Traefik service
      matchMaker.presence.set(`traefik/http/services/${subdomain}/loadbalancer/servers/${subdomain}/url`, `http://localhost:${port}`);
      matchMaker.presence.set(`traefik/http/services/all-servers/loadbalancer/servers/${subdomain}/url`, `http://localhost:${port}`);

      // Setup "all servers" router
      const value = await matchMaker.presence.get(`traefik/http/routers/all-servers/rule`);
      if (!value) {
        matchMaker.presence.set(`traefik/http/routers/all-servers/rule`, `Host(\`all.game.dev\`)` )
        matchMaker.presence.set(`traefik/http/routers/all-servers/service`, `all-servers`);
      }

      gameServer.onShutdown(() => {
        // Remove this process from Traefik router and service
        matchMaker.presence.del(`traefik/http/routers/${subdomain}/rule`);
        matchMaker.presence.del(`traefik/http/routers/${subdomain}/service`);
        matchMaker.presence.del(`traefik/http/services/${subdomain}/loadbalancer/servers/${subdomain}/url`);

        // Remove this process from Traefik "all-servers" service
        matchMaker.presence.del(`traefik/http/services/all-servers/loadbalancer/servers/${subdomain}/url`);
      });
    },

    initializeExpress: (app) => {
        app.get("/info", (req, res) => {
          res.send({ publicAddress });
        });

        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */
        app.get("/hello_world", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        if (process.env.NODE_ENV !== "production") {
            app.use("/", playground);
        }

        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/colyseus", monitor());
    },

    beforeListen: () => {
        // /**
        //  * Before before gameServer.listen() is called.
        //  */
        // matchMaker.createRoom("my_room", {});
    },
});
