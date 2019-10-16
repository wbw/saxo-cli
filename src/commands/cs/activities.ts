export default function activities(clientKey: string, cmd: any): void {
  cmd.parent.apiUrl = `cs/v1/audit/activities/?clientkey=${clientKey}`;
}
