import nats, { Stan } from "node-nats-streaming";

export class NatsClientWrapper {
  private _client?: Stan;
  static _instance: NatsClientWrapper;

  static get instance(){
    return this._instance ||= new NatsClientWrapper();
  }

  get natsClient() {
    if (this._client == null) {
      throw new Error(
        "You must connect by calling NatsClientWrapper.connect before accessing the nats client."
      );
    }
    return this._client;
  }

  connect(natsClusterId: string, clientId: string, streamingServerUrl: string) {
    return new Promise<void>((resolve, reject) => {
      this._client = nats.connect(natsClusterId, clientId, {
        url: streamingServerUrl,
      });
      this.natsClient.on("connect", (error) => {
        if (error) {
          reject(error);
          console.error("Failed to connect to nats server \n", error);
        } else {
          resolve();
          console.log("Connected to nats server");
        }
      });

      this.natsClient.on("close", () => {
        console.log("Nats server connection closed");
      });
    });
  }
}
