import { Badge } from "@/components/ui/badge";
import {
  SOCKET_CONNECTION_STATUS_CLASS_NAME,
  SOCKET_CONNECTION_STATUS_LABEL,
} from "@/constants/temperature-constant";
import { cn } from "@/lib/utils";
import type { SocketConnectionStatus } from "@/types/temperature";

type ConnectionStatusProps = {
  status: SocketConnectionStatus;
};

export function ConnectionStatus({ status }: ConnectionStatusProps) {
  return (
    <Badge
      variant="outline"
      className={cn(SOCKET_CONNECTION_STATUS_CLASS_NAME[status])}
    >
      {SOCKET_CONNECTION_STATUS_LABEL[status]}
    </Badge>
  );
}
