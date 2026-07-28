import { io, type Socket } from "socket.io-client";

import { SOCKET_URL } from "@/constants/env";
import type { ServerToClientEvents } from "@/types/temperature";

export function createSocket(): Socket<ServerToClientEvents> {
  return io(SOCKET_URL);
}
